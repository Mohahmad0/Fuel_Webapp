import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const profiles = await prisma.profile.findMany();
            res.status(200).json(profiles);
        } catch (error) {
            console.error('Error fetching profiles:', error);
            res.status(500).json({ error: 'Failed to fetch profiles' });
        }
    } else if (req.method === 'POST') {
        const { fullName, address1, address2, city, state, zipcode, userId } = req.body;

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        try {
            const profile = await prisma.profile.upsert({
                where: { userId },
                update: {
                    fullName,
                    address1,
                    address2: address2 || null,
                    city,
                    state,
                    zipcode,
                },
                create: {
                    userId,
                    fullName,
                    address1,
                    address2: address2 || null,
                    city,
                    state,
                    zipcode,
                },
            });
            res.status(200).json(profile);
        } catch (error) {
            console.error('Error handling profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
