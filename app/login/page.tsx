"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import * as z from 'zod';

// Form schema
const formSchema = z.object({
  username: z.string().min(3, { message: "Invalid Username" }).max(30),
  password: z.string().min(3, { message: "Must be at least 3 characters" }),
});

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ""
    }
  });

  const supabase = createClient(); // Initialize Supabase client

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.username,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      // No need to log in the user here, Supabase handles it internally
      console.log('User logged in successfully');
      window.location.href = '/quote';
      // Redirect or perform actions after successful login
    } catch (error: any) {
      console.error('Error logging in:', error.message);
      setError(error.message || 'Login failed. Please try again.');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
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
            <p className="text-center">
              Don't have an account?{' '}
              <Link legacyBehavior href="/registration" >
                <a className="text-blue-500 hover:underline">Create an account</a>
              </Link>
            </p>
            <Button type="submit" className="w-full">
              Log In
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </Form>
      </div>
    </main>
  );
}
