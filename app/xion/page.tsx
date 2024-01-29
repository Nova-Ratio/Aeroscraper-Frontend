"use client";
import Link from "next/link";
import { useCallback, useState } from "react";

import "@burnt-labs/ui/styles.css";
import type { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import useChainAdapter from "@/hooks/useChainAdapter";
import XionTheme from "@/layouts/themes/XionTheme";
import XionDashboard from "../app/dashboard/_chain/XionDashboard";
import { Abstraxion } from "@/components/xion/Abstraxion";
import { useSearchParams } from "next/navigation";
import { useAbstraxionAccount, useAbstraxionSigningClient } from "@/hooks/xion";
import { useAccountBalance } from "@/hooks/xion/useAccountBalance";


export default function Page(): JSX.Element {
  // Abstraxion hooks
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const { data: account } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient();
  const accountBalance = useAccountBalance(account, client);

  const contracts = searchParams.get("contracts");
  const grantee = searchParams.get("grantee");
    
  return (
    <main className="m-auto xion flex min-h-screen flex-col items-center text-white justify-start gap-4 p-4 container mx-auto px-3 md:px-[64px] w-full">
      <XionTheme />
      {/* !account?.bech32Address || (contracts && grantee) ? (
        <div className="ui-flex ui-h-screen ui-flex-1 ui-items-center ui-justify-center ui-overflow-y-auto ui-p-6">
          <Abstraxion onClose={() => null} isOpen={true} />
        </div>
      ) : */
      (<XionDashboard />)}
    </main>
  );
}
