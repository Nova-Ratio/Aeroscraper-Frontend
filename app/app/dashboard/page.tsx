'use client';

import { useSearchParams } from "next/navigation";
import Dashboard from "./_components/Dashboard";
import { useEffect } from "react";

export default function DashboardPage() {
    const search = useSearchParams();
    useEffect(() => {
      const ref = search.get("ref");
      console.log(ref);
      if (ref) {
        localStorage.setItem("referralCode", ref);
      }
    }, [search]);
    return (
        <Dashboard />
    )
}