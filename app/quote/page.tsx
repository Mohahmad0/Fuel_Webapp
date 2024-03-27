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

// Form schema
const formSchema = z.object({
    gallonsRequested: z.number().min(1, { message: "Gallons must be greater than 0" }),
    deliveryAddress: z.string().min(1, { message: "Delivery address is required" }),
    deliveryDate: z.date(),
    suggestedPrice: z.number(),
    totalAmountDue: z.number(),
});

export default function FuelQuote() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            //     deliveryAddress: Get the address from the client profile 
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data); // send  data to your backend)
    };

    return (

        <main className="flex min-h-0 flex-row items-left justify-between p-24">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4">Request a Fuel Quote</h1>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <FormField control={form.control} //gallons requested
                            name="gallonsRequested"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>How Many Gallons Would You Like?</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Number of Gallons"
                                            type="Gallons Requested"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />

                        <FormField control={form.control} //Address
                            name="deliveryAddress"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Delivery Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Will be auto populated from profile "
                                            type="deliveryAddress"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />

                        <FormField control={form.control} //Delivery Date
                            name="deliveryDate"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Select A Delivery Date</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="date"
                                            type="date"
                                            {...field}
                                            value={field.value ? field.value.toLocaleDateString('en-US') : ''} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />


                        <Button type="submit" className="w-full">
                            Request Quote
                        </Button>
                    </form>
                </Form>
            </div>

            <Card className="flex flex-col justify-between p-6 ml-auto flex-h-screen">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Calculated Fuel Quote</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="text-lg font-semibold p-2">Delivery Date: 3/10/2024</div>
                    <div className="text-lg font-semibold p-2">Gallons requested: {250}</div>
                    <div className="text-lg font-semibold p-2 ">Price per Gallon: ${2.52}</div>
                    <div className="text-2xl font-bold mt-2">Total Amount Due: ${500}</div>
                </CardContent>

            </Card>

        </main>
    );
}
