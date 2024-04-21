import { useContext, useEffect, useRef } from "react";
import { GrazProvider } from "graz";
import { StytchProvider } from "@stytch/nextjs";
import { ApolloProvider } from "@apollo/client";
import {
  AbstraxionContext,
  AbstraxionContextProps,
  AbstraxionContextProvider,
} from "@/components/xion/AbstraxionContext";
import { apolloClient, stytchClient } from "@/lib/xion/lib";
import { Dialog, DialogContent } from "@burnt-labs/ui";
import { AbstraxionSignin } from "@/components/xion/AbstraxionSignin";
import { useAbstraxionAccount } from "@/hooks/xion";
import { AbstraxionWallets } from "@/components/xion/AbstraxionWallets";
import { ErrorDisplay } from "@/components/xion/ErrorDisplay";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export interface ModalProps {
  onClose: VoidFunction;
  isOpen: boolean;
}

export const Abstraxion = ({ isOpen, onClose }: ModalProps) => {
  const searchParams = useSearchParams();

  const { abstraxionError, isMainnet } = useContext(
    AbstraxionContext
  ) as AbstraxionContextProps;

  const { isConnected, data: account } = useAbstraxionAccount();

  const contracts = searchParams.get("contracts");
  /* const stake = Boolean(searchParams.get("stake"));
  const bank = searchParams.get("bank");
  const contractsArray = contracts?.split(",") || [];

  const grantee = searchParams.get("grantee"); */
  useEffect(() => {
    const closeOnEscKey = (e: any) => (e.key === "Escape" ? onClose() : null);
    document.addEventListener("keydown", closeOnEscKey);
    return () => {
      document.removeEventListener("keydown", closeOnEscKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <button
            onClick={onClose}
            className="absolute top-4 right-4"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {abstraxionError ? (
            <ErrorDisplay
              message={abstraxionError}
              onClose={onClose}
            /> /* : account?.id &&
          grantee &&
          // We support granting any combunation of
          (contractsArray.length > 0 || stake || bankArray.length > 0) ? (
          <AbstraxionGrant
            bank={bankArray}
            contracts={contractsArray}
            grantee={grantee}
            stake={stake}
          />
        ) : */
          ) : isConnected ? (
            <AbstraxionWallets />
          ) : (
            <AbstraxionSignin />
          )}
          <div className="flex gap-2 justify-center items-end text-white -mt-0 lg:-mt-10 ">
            <p className="font-akkuratLL text-sm text-zinc-100 opacity-50 leading-tight">
              Powered by
            </p>
            <div className="flex flex-row-reverse items-center sm:items-start  sm:flex-col">
              <div
                className={`flex justify-between ${
                  isMainnet ? "bg-mainnet-bg" : "bg-testnet-bg"
                } px-2 py-1 ml-2 sm:ml-0 sm:mb-2 ${
                  isMainnet ? "text-mainnet" : "text-testnet"
                } rounded-md font-akkuratLL text-xs tracking-widest`}
              >
                {isMainnet ? "MAINNET" : "TESTNET"}
              </div>
              <a href="https://xion.burnt.com/">
                <Image
                  src="/logo.png"
                  alt="XION Logo"
                  width="108"
                  height="48"
                />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const AbstraxionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <AbstraxionContextProvider>
      <StytchProvider stytch={stytchClient}>
        <ApolloProvider client={apolloClient}>
          <GrazProvider>{children}</GrazProvider>
        </ApolloProvider>
      </StytchProvider>
    </AbstraxionContextProvider>
  );
};
