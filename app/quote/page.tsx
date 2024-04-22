"use client";


import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client'; // Assuming Supabase is used for user management and data storage
import { User } from '@supabase/supabase-js';



// Form schema
const formSchema = z.object({
    gallonsRequested: z.number().min(1, { message: "Gallons must be greater than 0" }),
    deliveryDate: z.date(),
});

export default function FuelQuote() {
    const [loading, setLoading] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [deliveryDate, setDeliveryDate] = useState<Date | string>("");
    const [gallonsRequested, setGallonsRequested] = useState<number | string>("");
    const [suggestedPrice, setSuggestedPrice] = useState<number | string>("");
    const [totalAmountDue, setTotalAmountDue] = useState<number | string>("");
    const [quoteRetrieved, setQuoteRetrieved] = useState(false);  // New state variable
    const supabase = createClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            const { data: authResponse, error } = await supabase.auth.getUser();
            if (error || !authResponse) {
                console.error('Authentication error or no user:', error);
                setLoading(false);
                return;
            }

            const user: User = authResponse.user;

            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    gallonsRequested: data.gallonsRequested,
                    deliveryDate: data.deliveryDate,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create quote');
            }

            const quoteData = await response.json();
            // Set all fields to reflect all the data from the response
            setGallonsRequested(quoteData.gallonsRequested);
            setDeliveryDate(quoteData.deliveryDate);
            setDeliveryAddress(quoteData.deliveryAddress);
            setSuggestedPrice(quoteData.suggestedPrice);
            setTotalAmountDue(quoteData.totalAmountDue);
            window.location.href = '/quotehistory';
        } catch (error) {
            console.error('Error requesting quote:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleGetQuote = async () => {
        if (!form.getValues().gallonsRequested || !form.getValues().deliveryDate) {
            return;
        }
        setLoading(true);
        try {
            const { data: authResponse, error } = await supabase.auth.getUser();
            if (error || !authResponse) {
                console.error('Authentication error or no user:', error);
                setLoading(false);
                return;
            }
            const user: User = authResponse.user;
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    gallonsRequested: form.getValues().gallonsRequested,
                    deliveryDate: form.getValues().deliveryDate,
                    getQuoteOnly: true,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get quote');
            }

            const quoteData = await response.json();
            setGallonsRequested(form.getValues().gallonsRequested);
            setDeliveryDate(form.getValues().deliveryDate);
            setDeliveryAddress(quoteData.deliveryAddress);
            setSuggestedPrice(quoteData.suggestedPrice);
            setTotalAmountDue(quoteData.totalAmountDue);
            setQuoteRetrieved(true);  // Set to true once quote is retrieved
            
        } catch (error) {
            console.error('Error getting quote:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-0 flex-row items-left justify-between p-24">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4">Request a Fuel Quote</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                        {/* Gallons requested */}
                        <FormField
                            control={form.control}
                            name="gallonsRequested"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>How Many Gallons Would You Like?</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Number of Gallons"
                                            type="number"
                                            {...field}
                                            disabled={quoteRetrieved}
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
                                                field.onChange(value === '' ? undefined : parseInt(value)); // Parse numeric value or undefined
                                            
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Delivery date */}
                        <FormField
                            control={form.control}
                            name="deliveryDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select A Delivery Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Date"
                                            type="date"
                                            {...field}
                                            disabled={quoteRetrieved}
                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const date = new Date(value);
                                                field.onChange(date);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Get Quote button */}
                        <Button
                            type="button"
                            onClick={handleGetQuote}
                            disabled={loading || !form.watch('gallonsRequested') || !form.watch('deliveryDate') || quoteRetrieved}>
                            Get Quote
                        </Button>

                        <Button type="submit" disabled={loading || !suggestedPrice || !totalAmountDue}>
                            Submit Quote
                        </Button>
                    </form>
                </Form>
            </div>
            {/* Quote details */}
            <Card className="flex flex-col justify-between p-6 ml-auto flex-h-screen">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Calculated Fuel Quote</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-lg font-semibold p-2">Delivery Address: {deliveryAddress}</div>
                    <div className="text-lg font-semibold p-2">Delivery Date: {typeof deliveryDate === 'object' ? deliveryDate.toISOString().split('T')[0] : deliveryDate}</div>
                    <div className="text-lg font-semibold p-2">Gallons requested: {gallonsRequested}</div>
                    <div className="text-lg font-semibold p-2 ">Price per Gallon: ${suggestedPrice}</div>
                    <div className="text-2xl font-bold mt-2">Total Amount Due: ${totalAmountDue}</div>
                </CardContent>

            </Card>

        </main>
    );
}
