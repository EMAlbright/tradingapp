"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage(){

    const [token, setToken] = useState("");
    const [message, setMessage] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = async() => {
        try{
            await axios.post('/api/users/verifyemail', {token})
            setMessage(true);
        }
        catch(error:any){
            setError(true);
            console.log(error.response.data);
        }
    }

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    useEffect(()=> {
        if(token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return(
        <div className='h-screen bg-gray-50 flex justify-center items-center'>
            <h1 className="text-4xl">Verify Email</h1>
            <h2 className="p-2 bg-green-500 text-black">{token ? `${token}`:"no token"}</h2>
            {message && (
                <div>
                    <h2 className="text-2xl">Email Verified</h2>
                    <Link href="/login">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl bg-red-500 text-black">Error</h2>
                </div>
            )}
        </div>
    )
}