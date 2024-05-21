"use client";

import React, { FC, PropsWithChildren } from "react";
import AppProvider from "@/contexts/AppProvider";
import { NotificationProvider } from "@/contexts/NotificationProvider";
import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as leapWallets } from "@cosmos-kit/leap";
import { wallets as ninjiWallets } from "@cosmos-kit/ninji";
import { wallets as ledgerWallets } from "@cosmos-kit/ledger";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { ChainName } from "@/enums/Chain";
import { GasPrice } from "@cosmjs/stargate";
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
        <ChainProvider
          chains={chains}
          assetLists={assets}
          wallets={[
            keplrWallets[0],
            leapWallets[0],
            ninjiWallets[0],
            cosmostationWallets[0],
            ledgerWallets[0],
          ]}
          signerOptions={{
            signingCosmwasm: (chain) => {
              switch (typeof chain === "string" ? chain : chain.chain_name) {
                case ChainName.INJECTIVE:
                  return {
                    gasPrice: GasPrice.fromString("0.025inj"),
                  };
                case ChainName.SEI:
                  return {
                    gasPrice: GasPrice.fromString("0.025sei"),
                  };
                case ChainName.ARCHWAY:
                  return {
                    gasPrice: GasPrice.fromString("0.025uatom"),
                  };
                case ChainName.NEUTRON:
                  return {
                    gasPrice: GasPrice.fromString("0.025untrn"),
                  };
                default:
                  return {
                    gasPrice: GasPrice.fromString("0.025inj"),
                  };
              }
            },
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
        </ChainProvider>
      </AbstraxionProvider>
    </>
  );
};

export default Providers;
