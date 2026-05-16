// /api/youtube-status.js
//
// Vercel serverless function that returns the channel's current broadcast state.
//
// Response shape (always 200 unless a real error):
//   {
//     state: 'live' | 'replay' | 'videos',
//     liveVideo?:   { id, title, thumbnail, viewers, startedAt },
//     replayVideo?: { id, title, thumbnail, publishedAt }
//   }
//
// Env vars required:
//   YOUTUBE_API_KEY      - YouTube Data API v3 key (server-side only)
//   YOUTUBE_CHANNEL_ID   - e.g. UCcGj78lfiLuDPxujO2AaHHw
//
// Quota math: previous implementation used search?eventType=live (100 units per
// cache miss), which can blow through the 10k/day free quota quickly. This
// version uses the cheap path — channels.list + playlistItems.list + videos.list
// = 3 units per cache miss — and infers "live" from snippet.liveBroadcastContent
// on the most recent upload. Active live broadcasts surface in the uploads
// playlist with liveBroadcastContent === 'live'.
//
// Cache: 15 min fresh + 1 hour stale-while-revalidate on success. Errors are
// not cached so we recover immediately once quota refreshes (midnight Pacific).

const YT = 'https://www.googleapis.com/youtube/v3';

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`YouTube API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getUploadsPlaylistId(channelId, apiKey) {
  const url = `${YT}/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
  const data = await fetchJSON(url);
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null;
}

async function getMostRecentVideoId(uploadsId, apiKey) {
  const url = `${YT}/playlistItems?part=contentDetails&playlistId=${uploadsId}&maxResults=1&key=${apiKey}`;
  const data = await fetchJSON(url);
  return data.items?.[0]?.contentDetails?.videoId || null;
}

async function getVideoDetails(videoId, apiKey) {
  const url = `${YT}/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${apiKey}`;
  const data = await fetchJSON(url);
  const v = data.items?.[0];
  if (!v) return null;
  return {
    id: videoId,
    title: v.snippet.title,
    thumbnail:
      v.snippet.thumbnails?.maxres?.url ||
      v.snippet.thumbnails?.high?.url ||
      v.snippet.thumbnails?.medium?.url ||
      '',
    isLive: v.snippet.liveBroadcastContent === 'live',
    viewers: v.liveStreamingDetails?.concurrentViewers
      ? Number(v.liveStreamingDetails.concurrentViewers)
      : null,
    startedAt: v.liveStreamingDetails?.actualStartTime || null,
    publishedAt: v.snippet.publishedAt,
  };
}

export default async function handler(req, res) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({
      error: 'Server misconfigured: missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID',
    });
  }

  try {
    const uploadsId = await getUploadsPlaylistId(channelId, apiKey);
    if (!uploadsId) {
      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
      return res.status(200).json({ state: 'videos' });
    }

    const videoId = await getMostRecentVideoId(uploadsId, apiKey);
    if (!videoId) {
      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
      return res.status(200).json({ state: 'videos' });
    }

    const v = await getVideoDetails(videoId, apiKey);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');

    if (v?.isLive) {
      return res.status(200).json({
        state: 'live',
        liveVideo: {
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          viewers: v.viewers,
          startedAt: v.startedAt,
        },
      });
    }

    if (v) {
      return res.status(200).json({
        state: 'replay',
        replayVideo: {
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          publishedAt: v.publishedAt,
        },
      });
    }

    return res.status(200).json({ state: 'videos' });
  } catch (err) {
    console.error('[youtube-status] error:', err);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(500).json({ error: err.message || 'Unknown error' });
  }
}
