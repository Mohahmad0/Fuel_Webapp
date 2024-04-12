import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password, passwordConfirm } = req.body;

        // Validate the password confirmation
        if (password !== passwordConfirm) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        try {
            // Create the user in the database
            const newUser = await prisma.login.create({
                data: {
                    username,
                    password,
                },
            });

            res.status(201).json(newUser);
        } catch (error) {
            console.error('Error creating user:', error); // Log the error message
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
