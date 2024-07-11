"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";


    export default function LoginPage(){
        const router = useRouter();
        const [user, setUser] = React.useState({
            email:"",
            password: "",
            username: "",
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onLogin = async() =>{
        try{
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login sucess", response.data);
            toast.success("Login success");
            //maybe push to either profile page or to home
            router.push("/profile");
        } catch(error: any){
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
            setLoading(false);
        }

    }

    useEffect(() =>{
        if(user.email.length > 0 && user.password.length > 0){
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-blue-600 to-blue-900 text-white">
          <h1 className="text-4xl font-bold mb-4">{loading ? "Processing..." : "Login"}</h1>
          <hr className="border-white w-1/4 mb-4" />
          <input
            className="p-2 mb-4 rounded-md text-black focus:outline-none"
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Email"
          />
          <input
            className="p-2 mb-4 rounded-md text-black focus:outline-none"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
          />
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className="p-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md mb-4 focus:outline-none"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link href="/signup">
            <div className="text-blue-300 hover:text-blue-100">Visit Signup page</div>
          </Link>
        </div>
      );
}