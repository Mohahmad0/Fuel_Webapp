import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { fullName, address1, address2, city, state, zipcode, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'userId is required' });
        }

        try {
            const updatedProfile = await prisma.profile.update({
                where: { userId: userId },
                data: {
                    fullName,
                    address1,
                    address2,
                    city,
                    state,
                    zipcode
                },
            });

            res.status(200).json(updatedProfile);
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
