import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { profileId, gallonsRequested, deliveryDate, deliveryAddress } = req.body;

    try {
        const profile = await prisma.profile.findUnique({
            where: { uuid: profileId }  // Adjusted to use uuid field
        });

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        const quote = await prisma.quote.create({
            data: {
                profileId: profile.id, // Assuming profile.id is the correct integer ID
                gallonsRequested,
                deliveryDate: new Date(deliveryDate),
                deliveryAddress,
            },
        });

        res.status(201).json(quote);
    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
