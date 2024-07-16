import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

interface Networth {
    name: string,
    networth: number
}

export default function Leaderboard(){
    const [networths, setNetworth] = useState <Networth[]>([]);
    
    useEffect(() =>{
        const getNetworth = async() =>{
            try{
                const res = await axios.get("/api/leaderboards");
                setNetworth(res.data.netWorth);
            } catch(error){
                toast.error("Failed to get balance");
            }
        };
        getNetworth();
        const interval = setInterval(getNetworth, 300000); 

        return () => clearInterval(interval); 
    }, []);
        return (
          <div className="bg-[#3333aa] rounded-lg shadow-lg p-6 max-w-md">
            <h2 className="text-2xl font-bold text-center text-[#c0c0c0] mb-6">Top Investors</h2>
            <div className="space-y-4">
              {networths?.map((user, index) => (
                <div key={index} className="flex items-center bg-[#2b547c] bg-opacity-50 rounded-lg p-4 transition-colors hover:bg-opacity-70">
                  <div className="w-8 h-8 flex-shrink-0 bg-[#c0c0c0] text-[#2b547c] rounded-full flex items-center justify-center font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <span className="font-semibold text-white">{user.name}</span>
                  </div>
                  <div className="text-[#c0c0c0] font-bold ml-5">
                    ${user.networth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
}