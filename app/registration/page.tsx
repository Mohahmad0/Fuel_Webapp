"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';


// Form schema
const formSchema = z.object({
    username: z.string().min(3, { message: "Username must contain at least 3 characters" }).max(30),
    password: z.string().min(3),
    passwordConfirm: z.string()
}).refine((data) => {
    return data.password === data.passwordConfirm
}, {
    message: "passwords do not match",
    path: ["passwordConfirm"]
});

export default function Registration() {

    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: ""
        }
    });

    const supabase = createClient(); 

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        const supabase = createClient(); 
        try {
            const { data: authData, error } = await supabase.auth.signUp({
                email: data.username,
                password: data.password,
            });


            const user = authData?.user;
            if (!user) {
                throw new Error("User not found in sign up response");
            }

            console.log('User registered:', user);
            window.location.href = '/profile';
        } catch (error: any) {
            console.error('Error registering user:', error.message);
            setError(error.message || 'Registration failed. Please try again.');
        }
    };


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="max-w-md w-full">
                <h1 className="text-3xl font-bold mb-4">Register</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6">
                        <FormField control={form.control} //Username
                            name="username"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField control={form.control} //Password
                            name="password"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <FormField control={form.control} //Password Confirmation
                            name="passwordConfirm"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Confirm Password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            }}
                        />
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                </Form>
            </div>
        </main>
    );
}
