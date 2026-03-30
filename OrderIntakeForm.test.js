import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import OrderIntakeForm from './OrderIntakeForm';

describe('OrderIntakeForm', () => {
  it('renders the form', () => {
    const { getByText } = render(<OrderIntakeForm />);
    expect(getByText('Customer Name:')).toBeInTheDocument();
    expect(getByText('Customer Email:')).toBeInTheDocument();
    expect(getByText('Order Date:')).toBeInTheDocument();
    expect(getByText('Total Cost:')).toBeInTheDocument();
    expect(getByText('Products:')).toBeInTheDocument();
    expect(getByText('Submit Order')).toBeInTheDocument();
  });

  it('submits the form', () => {
    const { getByText, getByLabelText } = render(<OrderIntakeForm />);
    const customerNameInput = getByLabelText('Customer Name:');
    const customerEmailInput = getByLabelText('Customer Email:');
    const orderDateInput = getByLabelText('Order Date:');
    const totalCostInput = getByLabelText('Total Cost:');
    const productsSelect = getByLabelText('Products:');
    const submitButton = getByText('Submit Order');

    fireEvent.change(customerNameInput, { target: { value: 'John Doe' } });
    fireEvent.change(customerEmailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(orderDateInput, { target: { value: '2023-03-01' } });
    fireEvent.change(totalCostInput, { target: { value: '100.00' } });
    fireEvent.change(productsSelect, { target: { value: ['cake', 'cookie'] } });

    fireEvent.click(submitButton);

    waitFor(() => {
      expect(console.log).toHaveBeenCalledTimes(1);
    });
  });
});