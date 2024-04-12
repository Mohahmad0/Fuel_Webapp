import { PrismaClient } from '@prisma/client';
import { createClient } from '@/utils/supabase/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            // Check if the user exists in the database
            const existingUser = await prisma.login.findUnique({
                where: {
                    username,
                },
            });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Verify the password
            if (existingUser.password !== password) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            // Authenticate the user using Supabase
            const supabase = createClient();
            const { data: authData, error } = await supabase.auth.signIn({
                email: username, // Supabase expects email for login
                password,
            });

            if (error) {
                throw error;
            }

            const user = authData?.user;
            if (!user) {
                throw new Error("User not found in sign in response");
            }

            console.log('User logged in:', user);

            // Redirect to the profile page or return some success response
            res.status(200).json({ user });

        } catch (error) {
            console.error('Error logging in:', error); // Log the error message
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
