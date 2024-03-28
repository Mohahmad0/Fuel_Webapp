import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FuelQuote from '@/app/quote/page.tsx'; 
import '@testing-library/jest-dom';

describe('FuelQuote', () => {
    it('renders without crashing', () => {
        render(<FuelQuote />);
        expect(screen.getByText('Request a Fuel Quote')).toBeInTheDocument();
        expect(screen.getByText('Calculated Fuel Quote')).toBeInTheDocument();
    });

    it('allows form submission with valid data', async () => {
        render(<FuelQuote />);

        await userEvent.type(screen.getByPlaceholderText('Number of Gallons'), '500');
    });

    it('displays the calculated fuel quote correctly', () => {
        render(<FuelQuote />);

        expect(screen.getByText('Delivery Date: 3/10/2024')).toBeInTheDocument();
        expect(screen.getByText('Gallons requested: 250')).toBeInTheDocument();
        expect(screen.getByText('Price per Gallon: $2.52')).toBeInTheDocument();
        expect(screen.getByText('Total Amount Due: $500')).toBeInTheDocument();
    });
});
