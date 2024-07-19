"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export default function Loginpage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', { username, password });

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            }
            );

            if (!response.ok) {
                alert("wrong login")
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.success) {
                router.push(`/${username}?username=${username}`);
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert('An error occurred during login. Please try again.');
        }
    };


    return (
        <div className="max-w-md w-full mx-auto rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black" >
            <h2 className="font-bold text-xl text-center">
                Login
            </h2>

            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-2">
                    <Label htmlFor="Username" >Username</Label>
                    <Input id="Username" placeholder="Username" type="text" className="bg-black" style={{ color: 'white', fontSize: '17 px' }} value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </LabelInputContainer>
                <LabelInputContainer className="mb-2">
                    <Label htmlFor="Password" >Password</Label>
                    <Input id="Password" placeholder="Password" type="password" className="bg-black" style={{ color: 'white', fontSize: '17 px' }} value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </LabelInputContainer>

                <button
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Sign up &rarr;
                    <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};