import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Pricing module function
function calculatePrice(gallonsRequested, location, hasHistory) {
    const currentPrice = 1.50;
    const locationFactor = location === 'TX' ? 0.02 : 0.04;
    const rateHistoryFactor = hasHistory ? 0.01 : 0;
    const gallonsRequestedFactor = gallonsRequested > 1000 ? 0.02 : 0.03;
    const companyProfitFactor = 0.1;


    const margin = (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor) * currentPrice;

    // console.log("currentPrice:", currentPrice);
    // console.log("Location:", locationFactor);
    // console.log("rate History:", rateHistoryFactor);
    // console.log("gallonsFactor:", gallonsRequestedFactor);
    // console.log("co profit factor:", companyProfitFactor);
    // console.log("margin:", margin);

    const suggestedPrice = currentPrice + margin;
    const totalAmountDue = suggestedPrice * gallonsRequested;

    return { suggestedPrice, totalAmountDue };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const { userId, gallonsRequested, deliveryDate, getQuoteOnly } = req.body;

    if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
    }

    try {
        // Fetch the user's profile to get the delivery address and state
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: { address1: true, address2: true, city: true, state: true }
        });

        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }

        const deliveryAddress = `${profile.address1}, ${profile.address2 || ''}, ${profile.city}, ${profile.state}`.trim();
        const locationState = profile.state; // Using the state from the profile as the location for the price calculation

        // Check if the user has a history of fuel requests
        const hasHistory = await prisma.quote.findFirst({
            where: { userId },
        });

        // Calculate suggested price and total amount due using the pricing module
        const { suggestedPrice, totalAmountDue } = calculatePrice(gallonsRequested, locationState, !!hasHistory);

        if (getQuoteOnly) {
            res.status(200).json({
                suggestedPrice,
                totalAmountDue,
                deliveryAddress
            });
            return;
        }

        // Create a quote record
        const quote = await prisma.quote.create({
            data: {
                userId,
                gallonsRequested,
                deliveryAddress,
                deliveryDate: new Date(deliveryDate),
                suggestedPrice,
                totalAmountDue,
            }
        });

        res.status(200).json({
            gallonsRequested,
            deliveryDate: new Date(deliveryDate).toISOString().split('T')[0],
            deliveryAddress,
            suggestedPrice,
            totalAmountDue,
        });

    } catch (error) {
        console.error('Error creating quote:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
