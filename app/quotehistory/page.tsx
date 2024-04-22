"use client";

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { createClient } from '@/utils/supabase/client'; 
import { User } from '@supabase/supabase-js';

interface QuoteHistoryEntry {
    deliveryDate: string;
    gallonsRequested: number;
    suggestedPrice: string; // Renamed from pricePerGallon
    totalAmountDue: string;
    deliveryAddress: string;
}

const supabase = createClient();

export default function QuoteHistoryTable() {
    const [quoteHistory, setQuoteHistory] = useState<QuoteHistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuoteHistory = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const { data: authResponse, error } = await supabase.auth.getUser();
                if (error || !authResponse) {
                    setError('Authentication error or no user');
                    return;
                }

                const user: User = authResponse.user;
                const userId = user.id;

                const response = await fetch(`/api/quotehistory?userId=${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch quote history');
                }

                const data: QuoteHistoryEntry[] = await response.json();
                setQuoteHistory(data);
            } catch (error) {
                console.error('Error fetching quote history:', error);
                setError('An error occurred while fetching your quotes.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuoteHistory();
    }, []);

    return (
        <main>
            {isLoading && <p>Loading quote history...</p>}

            {error && <p className="text-error">{error}</p>}

            {!isLoading && !error && (
                <Table>
                    <TableCaption>Your Fuel Quote History</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Delivery Date</TableHead>
                            <TableHead>Gallons Requested</TableHead>
                            <TableHead>Price Per Gallon</TableHead>
                            <TableHead>Total Due</TableHead>
                            <TableHead>Delivery Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quoteHistory.map((entry, index) => (
                            <TableRow key={index}>
                                <TableCell>{entry.deliveryDate}</TableCell>
                                <TableCell>{entry.gallonsRequested}</TableCell>
                                <TableCell>${entry.suggestedPrice}</TableCell>
                                <TableCell>${entry.totalAmountDue}</TableCell>
                                <TableCell>{entry.deliveryAddress}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </main>
    );
}
