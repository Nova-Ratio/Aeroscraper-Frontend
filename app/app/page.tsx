'use client';

import { Suspense } from "react";
import Dashboard from "./dashboard/_components/Dashboard";

export default function DashboardPage() {
    return (
        <Suspense>
            <Dashboard />
        </Suspense>
    )
}