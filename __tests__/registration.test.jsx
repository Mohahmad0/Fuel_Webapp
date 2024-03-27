import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Registration from '@/app/registration/page.tsx';
import '@testing-library/jest-dom'



describe('Registration Form', () => {
    it('renders correctly', () => {
        render(<Registration />);

        // If you have labels:
        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();

        // Or using roles:
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('validates user inputs and displays error messages', async () => {
        render(<Registration />);

        userEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(screen.queryByText('Username must contain at least 3 characters')).toBeInTheDocument();
        });

        userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
        userEvent.type(screen.getByPlaceholderText('Password'), 'password');
        userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password123');

        userEvent.click(screen.getByRole('button', { name: 'Submit' }));

    });

    it('submits the form with valid data', async () => {
        render(<Registration />);

        userEvent.type(screen.getByPlaceholderText('Username'), 'testuser');
        userEvent.type(screen.getByPlaceholderText('Password'), 'password');
        userEvent.type(screen.getByPlaceholderText('Confirm Password'), 'password');

        userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });
});

