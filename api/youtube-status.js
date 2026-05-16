// /api/youtube-status.js
//
// Vercel serverless function that returns the channel's current broadcast state.
//
// Response shape (always 200 unless a real error):
//   {
//     state: 'live' | 'replay' | 'videos',
//     liveVideo?:    { id, title, thumbnail, viewers, startedAt },
//     replayVideo?:  { id, title, thumbnail, publishedAt },
//     latestVideos?: [{ id, title, thumbnail, publishedAt }, ...]
//   }
//
// Env vars required:
//   YOUTUBE_API_KEY      - YouTube Data API v3 key (server-side only)
//   YOUTUBE_CHANNEL_ID   - e.g. UCcGj78lfiLuDPxujO2AaHHw
//
// Edge cache: 60 seconds. Plenty fresh for "is he live right now?" UX,
// and keeps us well under the 10k units/day free quota.

const YT = 'https://www.googleapis.com/youtube/v3';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API ${res.status}: ${text}`);
  }
  return res.json();
}

// Find a current live broadcast on the channel (if any).
async function getLiveVideo(channelId, apiKey) {
  const url = `${YT}/search?part=snippet&channelId=${channelId}&eventType=live&type=video&maxResults=1&key=${apiKey}`;
  const data = await fetchJSON(url);
  const item = data.items?.[0];
  if (!item) return null;

  const videoId = item.id.videoId;

  // Pull live viewer count + actual start time from videos endpoint.
  const detailsUrl = `${YT}/videos?part=liveStreamingDetails,snippet&id=${videoId}&key=${apiKey}`;
  const details = await fetchJSON(detailsUrl);
  const v = details.items?.[0];

  return {
    id: videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      '',
    viewers: v?.liveStreamingDetails?.concurrentViewers
      ? Number(v.liveStreamingDetails.concurrentViewers)
      : null,
    startedAt: v?.liveStreamingDetails?.actualStartTime || null,
  };
}

// Get the channel's uploads playlist ID (one API call, very cheap: 1 unit).
async function getUploadsPlaylistId(channelId, apiKey) {
  const url = `${YT}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const data = await fetchJSON(url);
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
}

// Get the most recent N videos via the uploads playlist (1 unit, much cheaper than search).
async function getLatestVideos(channelId, apiKey, count = 4) {
  const uploadsId = await getUploadsPlaylistId(channelId, apiKey);
  if (!uploadsId) return [];

  const url = `${YT}/playlistItems?part=snippet,contentDetails&playlistId=${uploadsId}&maxResults=${count}&key=${apiKey}`;
  const data = await fetchJSON(url);
  return (data.items || []).map(item => ({
    id: item.contentDetails.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.maxres?.url ||
      item.snippet.thumbnails?.high?.url ||
      item.snippet.thumbnails?.medium?.url ||
      '',
    publishedAt: item.contentDetails.videoPublishedAt || item.snippet.publishedAt,
  }));
}

export default async function handler(req, res) {
  // Cache at the edge for 60s; serve stale while revalidating for another 5m.
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return res.status(500).json({
      error: 'Server misconfigured: missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID',
    });
  }

  try {
    // Always fetch latest videos in parallel — we use them whether he's live or not
    // (offline state shows them; live/replay state may surface them too later).
    const [liveVideo, latestVideos] = await Promise.all([
      getLiveVideo(channelId, apiKey),
      getLatestVideos(channelId, apiKey, 4),
    ]);

    if (liveVideo) {
      return res.status(200).json({
        state: 'live',
        liveVideo,
        latestVideos,
      });
    }

    // No active live stream — show the most recent video as a "replay/latest broadcast"
    // and the rest as the video grid.
    const [replay, ...rest] = latestVideos;
    if (replay) {
      return res.status(200).json({
        state: 'replay',
        replayVideo: replay,
        latestVideos: rest,
      });
    }

    return res.status(200).json({
      state: 'videos',
      latestVideos: [],
    });
  } catch (err) {
    console.error('[youtube-status] error:', err);
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
