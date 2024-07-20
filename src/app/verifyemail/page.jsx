"use client";
// pages/verifyemail.js

import React, { useEffect, useState } from "react";

import axios from "axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {

    const router = useRouter();
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);


    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    const verifyUserEmail = async () => {
        try {
            const response = await axios.post('/api/users/verifyemail', { token });
            router.push('/login');
            setVerified(true);
            toast.success(response?.data?.message);
        } catch (error) {
            setVerified(false);
            console.log("error from verify email frontend", error);
            toast.error(error?.response?.data?.message);
        }

    };

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
            <h2 className="text-4xl mb-8">Verify Email</h2>


            <h2 className="p-2 bg-orange-500 text-black mb-8">{token ? `${token}` : "No token"}</h2>

            {verified ? (
                <div className="text-center">
                    <h2 className="text-2xl mb-4">Email Verified Successfully!</h2>
                    <Link href="/login">
                        <p className="text-blue-500 hover:underline">Login</p>
                    </Link>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl bg-red-500 text-white p-4 rounded-lg">not verified yet</h2>
                </div>
            )}
        </div>
    );
}
