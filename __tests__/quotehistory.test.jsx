import { render, screen } from '@testing-library/react';
import QuoteHistoryTable from '@/app/quotehistory/page.tsx'; 
import '@testing-library/jest-dom';

describe('QuoteHistoryTable', () => {
    it('renders without crashing', () => {
        render(<QuoteHistoryTable />);
        expect(screen.getByText('Your Fuel Quote History')).toBeInTheDocument();
    });

    it('displays the correct table headers', () => {
        render(<QuoteHistoryTable />);
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Gallons Requested')).toBeInTheDocument();
        expect(screen.getByText('Price Per Gallon')).toBeInTheDocument();
        expect(screen.getByText('Total Due')).toBeInTheDocument();
        expect(screen.getByText('Delivery Address')).toBeInTheDocument();
        expect(screen.getByText('Delivery Date')).toBeInTheDocument();
    });

    it('displays the correct data for each quote history entry', () => {
        render(<QuoteHistoryTable />);

        expect(screen.getByText('2023-12-15')).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('$2.50')).toBeInTheDocument();
        expect(screen.getByText('$1250.00')).toBeInTheDocument();
        expect(screen.getByText('123 Main St, Anytown, CA')).toBeInTheDocument();
        expect(screen.getByText('2023-12-20')).toBeInTheDocument();


        expect(screen.getByText('2023-11-28')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();
        expect(screen.getByText('$2.75')).toBeInTheDocument();
        expect(screen.getByText('$550.00')).toBeInTheDocument();
        expect(screen.getByText('456 Elm St, Sometown, TX')).toBeInTheDocument();
        expect(screen.getByText('2023-12-01')).toBeInTheDocument();
    });
});
