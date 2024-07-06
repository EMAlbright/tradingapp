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
                console.log(res.data.netWorth);
            } catch(error){
                toast.error("Failed to get balance");
            }
        };
        getNetworth();
    }, []);

    return (
        <div className="networths">
            <table className='portfolioTable'>
                <thead>
                    <tr>
                        <th>User</th>
                        <td>Net Worth</td>
                    </tr>
                </thead>
                <tbody>
                    {networths?.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.networth}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      );
}