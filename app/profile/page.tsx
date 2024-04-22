"use client";

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'; 
import { PrismaClient } from '@prisma/client';
import { createClient } from '@/utils/supabase/client'; // Import Supabase client
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from 'react';


// Form Schema 
const formSchema = z.object({
    fullName: z.string().regex(/^[a-zA-Z\s]+$/, { message: "Full Name must contain only letters and spaces" }).min(1, { message: "Full Name is required" }).max(50, { message: "Full Name must not exceed 50 characters" }),   
    address1: z.string().min(1, { message: "Address 1 is required" }).max(100),
    address2: z.string().max(100).optional(),
    city: z.string().regex(/^[a-zA-Z\s]+$/, { message: "City must contain only letters " }).min(1, { message: "City is required" }).max(100),
    state: z.string().min(2, { message: "Please Select a State" }),
    zipcode: z.string().regex(/^\d+$/, "Zipcode must contain only digits").min(5, { message: "Zipcode must be at least 5 digits" }).max(9, { message: "Zipcode must be no more than 9 digits" })
});

// Define your states
const states = [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" },
    { label: "Delaware", value: "DE" },
    { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" },
    { label: "Hawaii", value: "HI" },
    { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" },
    { label: "Indiana", value: "IN" },
    { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" },
    { label: "Kentucky", value: "KY" },
    { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" },
    { label: "Maryland", value: "MD" },
    { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" },
    { label: "Minnesota", value: "MN" },
    { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" },
    { label: "Montana", value: "MT" },
    { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" },
    { label: "New Hampshire", value: "NH" },
    { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" },
    { label: "New York", value: "NY" },
    { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" },
    { label: "Ohio", value: "OH" },
    { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" },
    { label: "Pennsylvania", value: "PA" },
    { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" },
    { label: "South Dakota", value: "SD" },
    { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" },
    { label: "Utah", value: "UT" },
    { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" },
    { label: "Washington", value: "WA" },
    { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" },
    { label: "Wyoming", value: "WY" },
];

interface Profile {
    fullName: string;
    address1: string;
    address2?: string;  // Optional as it might not always be present
    city: string;
    state: string;
    zipcode: string;
}



export default function Profile() {
    const [profile, setProfile] = useState<Profile | undefined>(undefined);
    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const supabase = createClient(); // Initialize Supabase client

    useEffect(() => {
        async function fetchProfile() {
            const supabase = createClient();
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                // Add a null check for the user object
                if (!user) {
                    console.error('User not found');
                    return;
                }

                const response = await fetch(`api/profile?userId=${user?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const fetchedProfile = await response.json();
                setProfile(fetchedProfile);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        }

        fetchProfile();
    }, []);







    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log('Form data:', data);
        const supabase = createClient();
        
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;

            const response = await fetch('api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    userId: user?.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedProfile = await response.json(); // Get the updated profile data from the response
            setProfile(updatedProfile); // Update the profile state

            console.log('Profile updated successfully');
            window.location.href = '/quote'; // Redirect or other actions after update
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };



    return (
        <main className="flex min-h-screen flex-row items-center justify-between p-24">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-6"
                    >
                        <FormField control={form.control} //Full Name
                            name="fullName"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Full Name"
                                            type="name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField control={form.control} //Address1
                            name="address1"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address 1"
                                            type="Address 1"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField control={form.control} //Address2
                            name="address2"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Address 2</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Address 2"
                                            type="Address 2"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField control={form.control} //City
                            name="city"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="City"
                                            type="City"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
    

                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                                <select
                                    {...form.register("state")}
                                    defaultValue=""
                                    style={{
                                        width: '100%', // Full width
                                        padding: '8px 12px', // Some padding
                                        border: '1px solid #ccc', // Gray border
                                        borderRadius: '4px', // Rounded borders
                                        boxSizing: 'border-box', // Box sizing
                                        appearance: 'none', // Remove default styling
                                        backgroundColor: 'white', // White background
                                        cursor: 'pointer', // Pointer cursor on hover
                                    }}
                                >
                                    <option value="" disabled>Select a State</option>
                                    {states.map((state) => (
                                        <option key={state.value} value={state.value}>
                                            {state.label}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormMessage>{form.formState.errors.state?.message}</FormMessage>
                        </FormItem>







                        <FormField control={form.control} //Zipcode
                            name="zipcode"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Zipcode</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Zipcode"
                                            type="Zipcode"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />

                        <Button type="submit" className="w-full">
                            Update Profile
                        </Button>
                    </form>
                </Form>
            </div>
            <Card className="flex flex-col justify-between p-6 ml-auto flex-h-screen">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Current Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {profile ? (
                        <>
                            <div className="text-lg font-semibold p-2">Full Name: {profile.fullName}</div>
                            <div className="text-lg font-semibold p-2">Address: {profile.address1} {profile.address2}</div>
                            <div className="text-lg font-semibold p-2">City: {profile.city}</div>
                            <div className="text-lg font-semibold p-2">State: {profile.state}</div>
                            <div className="text-lg font-semibold p-2">Zip Code: {profile.zipcode}</div>
                        </>
                    ) : (
                        <div>No profile found.</div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
