import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { userId } = req.query; // Assuming userId is passed as a query parameter for simplicity

    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Fetch past quotes for the specified user
        const quotes = await prisma.quote.findMany({
            where: { userId: userId },
            select: {
                deliveryDate: true,
                gallonsRequested: true,
                suggestedPrice: true,
                totalAmountDue: true,
                deliveryAddress: true
            }
        });

        // Send the fetched data back to the client
        res.status(200).json(quotes.map(q => ({
            deliveryDate: q.deliveryDate.toISOString().split('T')[0],
            gallonsRequested: q.gallonsRequested,
            suggestedPrice: q.suggestedPrice.toFixed(2), // Keep as 'suggestedPrice'
            totalAmountDue: q.totalAmountDue.toFixed(2), // Keep as 'totalAmountDue'
            deliveryAddress: q.deliveryAddress,
        })));

    } catch (error) {
        console.error('Error fetching quote history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
