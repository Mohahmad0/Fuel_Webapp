import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const userId = req.query.userId; // Ensure this parameter is being passed correctly

    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: userId }
        });

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
