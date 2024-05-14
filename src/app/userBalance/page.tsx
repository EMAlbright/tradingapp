import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "./balance.css";

export default function Balance(){
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
        <div className="balance">
          <hr />
          {balance !== null ? (
            <p>Your balance: ${balance}</p>
          ) : (
            <p>Loading balance...</p>
          )}
        </div>
      );
}