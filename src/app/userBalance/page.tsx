import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Balance = () =>{
    const [balance, setBalance] = useState(0);
    

    useEffect(() =>{
        const getBalance = async() =>{
            try{
                const res = await axios.get("/api/users/balance");
                setBalance(res.data.balance);
            } catch(error){
                toast.error("Failed to get balance");
            }
        };
        getBalance();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
          <h1>Profile</h1>
          <hr />
          {balance !== null ? (
            <p>Your balance: ${balance}</p>
          ) : (
            <p>Loading balance...</p>
          )}
        </div>
      );
}