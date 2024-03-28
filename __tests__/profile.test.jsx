import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Profile from '@/app/profile/page'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('Profile Form', () => {
    it('renders correctly', async () => {
        render(<Profile />);

        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Address 2')).toBeInTheDocument();
        expect(screen.getByLabelText('City')).toBeInTheDocument();
        // Since state is a custom select, you might need to adjust how you check for its presence
        expect(screen.getByText('Select a State')).toBeInTheDocument();
        expect(screen.getByLabelText('Zipcode')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Update Profile' })).toBeInTheDocument();
    });

    it('validates user inputs and displays error messages', async () => {
        render(<Profile />);

        // Attempt to submit the form without filling it out to trigger validation
        userEvent.click(screen.getByRole('button', { name: 'Update Profile' }));


        userEvent.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
        userEvent.type(screen.getByPlaceholderText('Address 1'), '123 Main St');
        userEvent.type(screen.getByPlaceholderText('City'), 'Metropolis');
        userEvent.type(screen.getByPlaceholderText('Zipcode'), '12345');

        userEvent.click(screen.getByRole('button', { name: 'Update Profile' }));

    });

    it('submits the form with valid data', async () => {
        render(<Profile />);

        userEvent.type(screen.getByPlaceholderText('Full Name'), 'Jane Doe');
        userEvent.type(screen.getByPlaceholderText('Address 1'), '456 Elm St');
        userEvent.type(screen.getByPlaceholderText('Address 2'), 'Apt 789');
        userEvent.type(screen.getByPlaceholderText('City'), 'Springfield');

        userEvent.type(screen.getByPlaceholderText('Zipcode'), '98765');

        userEvent.click(screen.getByRole('button', { name: 'Update Profile' }));

    });
});
