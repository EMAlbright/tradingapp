"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SideBar from "../components/sidebar/page";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState("nothing");

    const logout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout Successful");
            router.push('/login');
        } catch (error: any) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserDetails = async () => {
        const res = await axios.get('/api/users/me');
        console.log(res.data);
        setData(res.data.data._id);
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 text-white p-4 flex">
            <SideBar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-md p-8">
                    <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>
                    <hr className="border-white w-full mb-6" />
                    <p className="text-lg mb-6 text-center">Welcome to your profile page</p>
                    <h2 className="text-2xl mb-6 text-center">
                        {data === 'nothing' 
                            ? "No user data available" 
                            : <Link href={`/profile/${data}`}>
                                <div className="underline hover:text-blue-300">{data}</div>
                              </Link>
                        }
                    </h2>
                    <hr className="border-white w-full mb-6" />
                    <div className="flex flex-col space-y-4">
                        <button
                            onClick={logout}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-6 rounded-md focus:outline-none transition duration-300 ease-in-out"
                        >
                            Logout
                        </button>
                        <button 
                            onClick={getUserDetails}
                            className="bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded-md focus:outline-none transition duration-300 ease-in-out"
                        >
                            Get User Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}