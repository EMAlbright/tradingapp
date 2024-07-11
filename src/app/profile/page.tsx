"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import "./profile.css";

export default function ProfilePage (){
    const router = useRouter();
    const [data, setData] = useState("nothing");
    const logout = async () =>{
        try{
           await axios.get("/api/users/logout")
           toast.success("Logout Successful")
           router.push('/login')
        }
        catch(error: any){
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me')
        console.log(res.data);
        setData(res.data.data._id);
    }

    const onHome = async() =>{
        router.push("/home");
    }

    return (
        <div className="flex flex-col items-center
        justify-center min-h-screen py-2">
            <button className="homeButton" onClick={onHome}>
                <i className="animation">
                    </i>Home<i className="animation"></i>
            </button>
            <h1 className="text-4xl font-bold mb-4">Profile</h1>
            <hr/>
            <hr className="border-white w-1/4 mb-4" />
            <p className="text-lg mb-4">Welcome to your profile page</p>
            <h2 className="text-2xl mb-4">{data === 'nothing'?"No user data available": <Link
            href={'/profile/${data}'}>
            <div className="underline hover:text-blue-300">{data}</div>
            </Link>}</h2>
            <hr/>
            <hr className="border-white w-1/4 mb-4" />
            <button
                onClick={logout}
                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-md mb-4 focus:outline-none"
      >     Logout</button>

            <button 
            onClick={getUserDetails}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-md mb-4 focus:outline-none">Get User Details</button>
        </div>
    )
}