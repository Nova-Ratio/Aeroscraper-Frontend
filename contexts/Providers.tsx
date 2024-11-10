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

export const TREASURY = { treasury: 'xion16xu4rkdp06fplsw85fw72c703ze4fdu9haz7fv7wkxuag8qjtdrsnh5ady' }

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const cw20Ausd = process.env.NEXT_PUBLIC_CW20_AUSD_XION as string;
  const aero = process.env.NEXT_PUBLIC_AERO_XION as string;
  const oracleHelper = process.env.NEXT_PUBLIC_ORACLE_HELPER_XION as string;
  const cw20CustomToken = process.env.NEXT_PUBLIC_CW20_CUSTOM_TOKEN_XION as string;
  const cw20Minter = process.env.NEXT_PUBLIC_CW20_MINTER_XION as string;

const treasuryConfig = {
  treasury: TREASURY.treasury,
  contracts: [
    cw20Ausd,
    aero,
    oracleHelper,
    cw20CustomToken,
    cw20Minter,
  ],
  gasPrice: "0uxion",
  rpcUrl: "https://xion-test-priv-rpc.kingnodes.com/",
  restUrl: "https://xion-test-priv-rest.kingnodes.com/",
};

  return (
    <>
      <AbstraxionProvider
        config={treasuryConfig}
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
