import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/app/login/page'; 
import '@testing-library/jest-dom';

describe('Login Form', () => {
    it('renders correctly', () => {
        render(<Login />);

        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
        expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    it('validates user inputs and displays error messages', async () => {
        render(<Login />);

        
        userEvent.click(screen.getByRole('button', { name: 'Log In' }));

        userEvent.type(screen.getByPlaceholderText('Username'), 'us');
        userEvent.type(screen.getByPlaceholderText('Password'), 'password');

        userEvent.click(screen.getByRole('button', { name: 'Log In' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid Username')).toBeInTheDocument();
        });
    });

    it('submits the form with valid data', async () => {
        render(<Login />);

        userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
        userEvent.type(screen.getByPlaceholderText('Password'), 'password123');

        // Submit the form
        userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    });
});
