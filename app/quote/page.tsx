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


// Form schema
const formSchema = z.object({
    gallonsRequested: z.number().min(1, { message: "Gallons must be greater than 0" }),
    deliveryDate: z.date(),
});

export default function FuelQuote() {
    const [loading, setLoading] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState("123 Main St, Anytown, USA");
    const [deliveryDate, setDeliveryDate] = useState<Date | string>("");
    const [gallonsRequested, setGallonsRequested] = useState<number | string>("");
    const supabase = createClient();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });


    useEffect(() => {
        // Here, you could fetch the actual address and update it
        // For now, the placeholder remains unless fetched data updates it
        const fetchDeliveryAddress = async () => {
            const { data, error } = await supabase.from('profile').select('address1, address2').single();
            if (error) {
                console.error('Error fetching delivery address:', error);
                return;
            }
            if (data && data.address1) {
                const fullAddress = `${data.address1}, ${data.address2 || ''}`.trim();
                setDeliveryAddress(fullAddress);
            } else {
                console.error('No address data found');
            }
        };

        fetchDeliveryAddress();
    }, []);

    const handleSubmit = async (data: any) => {
        setLoading(true);
        try {
            const { data: { user }, error: sessionError } = await supabase.auth.getUser();
            if (sessionError) throw sessionError;
            if (!user) throw new Error('No user logged in');

            const postData = {
                profileId: user.id,  // Assuming the profile ID can be derived like this
                gallonsRequested: data.gallonsRequested,
                deliveryDate: data.deliveryDate.toISOString().substring(0, 10),
                deliveryAddress,
            };

            console.log('Sending POST data to /api/quote:', postData);
            const response = await fetch('/api/quote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('POST request failed:', errorData);
                throw new Error('Failed to create quote');
            }

            const quoteResponse = await response.json();
            console.log('Quote created successfully:', quoteResponse);
        } catch (error) {
            console.error('Error requesting quote:', error);
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
                                            type="text" // Change type to text
                                            {...field}
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


                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Requesting Quote...' : 'Request Quote'}
                        </Button>
                    </form>
                </Form>
            </div>

            <Card className="flex flex-col justify-between p-6 ml-auto flex-h-screen">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Calculated Fuel Quote</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="text-lg font-semibold p-2">Delivery Address: {deliveryAddress}</div>
                    <div className="text-lg font-semibold p-2">Delivery Date: {typeof deliveryDate === 'object' ? deliveryDate.toISOString().split('T')[0] : deliveryDate}</div>
                    <div className="text-lg font-semibold p-2">Gallons requested: {gallonsRequested}</div>
                    <div className="text-lg font-semibold p-2 ">Price per Gallon: ${2.52}</div>
                    <div className="text-2xl font-bold mt-2">Total Amount Due: ${500}</div>
                </CardContent>

            </Card>

        </main>
    );
}
