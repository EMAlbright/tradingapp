"use client";
import Router, { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(()=> {
    router.push("/home");
  }, [router])
  return null; 
}
