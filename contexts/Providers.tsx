"use client";

import React, { FC, PropsWithChildren } from "react";
import AppProvider from "@/contexts/AppProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import ProfileProvider from "./ProfileProvider";
import PriceProvider from "./PriceProvider";
import DashboardProvider from "./DashboardProvider";
import BalanceProvider from "./BalanceProvider";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const cw20Ausd = process.env.NEXT_PUBLIC_CW20_AUSD_XION as string;
  const aero = process.env.NEXT_PUBLIC_AERO_XION as string;
  const oracleHelper = process.env.NEXT_PUBLIC_ORACLE_HELPER_XION as string;
  const cw20CustomToken = process.env
    .NEXT_PUBLIC_CW20_CUSTOM_TOKEN_XION as string;
  const cw20Minter = process.env.NEXT_PUBLIC_CW20_MINTER_XION as string;

  return (
    <>
      <AbstraxionProvider
        config={{
          rpcUrl: "https://rpc.xion-testnet-1.burnt.com:443",
          contracts: [
            // Usually, you would have a list of different contracts here
            cw20Ausd,
            aero,
            oracleHelper,
            cw20CustomToken,
            cw20Minter,
          ],
        }}
      >
        <PriceProvider>
          <AppProvider>
            <NotificationProvider>
              <ProfileProvider>
                <BalanceProvider>
                  <DashboardProvider>{children}</DashboardProvider>
                </BalanceProvider>
              </ProfileProvider>
            </NotificationProvider>
          </AppProvider>
        </PriceProvider>
      </AbstraxionProvider>
    </>
  );
};

export default Providers;
