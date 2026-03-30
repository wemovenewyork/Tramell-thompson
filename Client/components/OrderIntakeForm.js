import React, { useState } from 'react';

const OrderIntakeForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [products, setProducts] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit the order data to the database
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Customer Name:
        <input type="text" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
      </label>
      <label>
        Customer Email:
        <input type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} />
      </label>
      <label>
        Order Date:
        <input type="date" value={orderDate} onChange={(event) => setOrderDate(event.target.value)} />
      </label>
      <label>
        Total Cost:
        <input type="number" value={totalCost} onChange={(event) => setTotalCost(event.target.value)} />
      </label>
      <label>
        Products:
        <select multiple value={products} onChange={(event) => setProducts(event.target.value)}>
          <option value="cake">Cake</option>
          <option value="cookie">Cookie</option>
        </select>
      </label>
      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderIntakeForm;