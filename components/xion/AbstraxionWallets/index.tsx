import { useContext, useEffect, useState } from "react";
import { useDisconnect } from "graz";
import { useStytch, useStytchUser } from "@stytch/nextjs";
import { useQuery } from "@apollo/client";
import { Button, Spinner } from "@burnt-labs/ui";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { AllSmartWalletQuery } from "@/utils/xion/queries";
import { truncateAddress } from "@/utils/xion";
import { useAbstraxionAccount } from "@/hooks/xion";
import { Loading } from "../Loading";
import { WalletIcon } from "../Icons";
import useChainAdapter from "@/hooks/useChainAdapter";

export const AbstraxionWallets = () => {
  const {
    connectionType,
    setConnectionType,
    abstractAccount,
    setAbstractAccount,
    setAbstraxionError,
    apiUrl,
  } = useContext(AbstraxionContext) as AbstraxionContextProps;
  const { selectXionChain, disconnectXion } = useChainAdapter();

  const { user } = useStytchUser();
  const stytchClient = useStytch();
  const session_jwt = stytchClient.session.getTokens()?.session_jwt;
  const session_token = stytchClient.session.getTokens()?.session_token;

  const { loginAuthenticator } = useAbstraxionAccount();

  const { disconnect } = useDisconnect();

  const { loading, error, data, startPolling, stopPolling, previousData } =
    useQuery(AllSmartWalletQuery, {
      variables: {
        authenticator: loginAuthenticator,
      },
      fetchPolicy: "network-only",
      notifyOnNetworkStatusChange: true,
    });

  const [isGeneratingNewWallet, setIsGeneratingNewWallet] = useState(false);
  const [fetchingNewWallets, setFetchingNewWallets] = useState(false);

  useEffect(() => {
    async function onStartup() {
      if (!loading && data && !previousData && !isGeneratingNewWallet) {
        if (
          data?.smartAccounts?.nodes.length === 0 &&
          connectionType === "stytch"
        ) {
          await handleJwtAALoginOrCreate();
        }
      }
    }

    onStartup();
  }, [loading, data]);

  useEffect(() => {
    if (previousData && data !== previousData) {
      stopPolling();
      setFetchingNewWallets(false);
    }
  }, [data, previousData]);

  useEffect(() => {
    if (abstractAccount && previousData && data !== previousData) {
      // Updating abstract account in context on poll
      setAbstractAccount(
        data?.smartAccounts?.nodes.find(
          (smartAccount:any) => smartAccount.id === abstractAccount.id,
        ),
      );
    }
  }, [data, previousData]);

  const handleDisconnect = async () => {
    if (connectionType === "stytch") {
      await stytchClient.session.revoke();
    }
    disconnect();
    setConnectionType("none");
    setAbstractAccount(undefined);
    localStorage.removeItem("loginType");
    localStorage.removeItem("loginAuthenticator");
    disconnectXion();
  };

  const handleJwtAALoginOrCreate = async () => {
    try {
      setIsGeneratingNewWallet(true);
      const res = await fetch(`${apiUrl}/api/v1/jwt-accounts/create`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          salt: Date.now().toString(),
          session_jwt,
          session_token,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        throw new Error(body.error);
      }
      startPolling(3000);
      setFetchingNewWallets(true);
      return;
    } catch (error) {
      console.log(error);
      setAbstraxionError("Error creating abstract account.");
    } finally {
      setIsGeneratingNewWallet(false);
    }
  };

  if (error) {
    setAbstraxionError((error as Error).message);
    return null;
  }

  return (
    <>
      {isGeneratingNewWallet ? (
        <Loading />
      ) : (
        <div className="flex h-full w-full flex-col items-start justify-between gap-8 sm:p-10 text-white">
          <div className="flex flex-col w-full text-center">
            <h1 className="w-full leading-[38.40px] tracking-tighter text-3xl font-light text-white uppercase mb-3">
              Welcome
            </h1>
            <h2 className="w-full mb-4 text-center text-sm font-normal leading-tight text-white/50">
              Select an account to continue
            </h2>
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-4">
            <div className="text-white text-base font-bold font-akkuratLL leading-tight">
              Accounts
            </div>
            <div className="flex max-h-64 w-full flex-col items-center gap-4 overflow-auto">
              {loading || fetchingNewWallets ? (
                <Spinner />
              ) : data?.smartAccounts?.nodes.length >= 1 ? (
                data?.smartAccounts?.nodes?.map((node: any, i: number) => (
                  <div
                    className={`w-full items-center gap-4 rounded-lg p-6 flex bg-transparent hover:cursor-pointer border-[1px] border-white hover:bg-white/5 ${
                      node.id === abstractAccount?.id
                        ? ""
                        : "border-opacity-30"
                    }`}
                    key={i}
                    onClick={() => {
                      setAbstractAccount({
                        ...node,
                        userId: user?.user_id,
                        currentAuthenticatorIndex:
                          node.authenticators.nodes.find(
                            (authenticator:any) =>
                              authenticator.authenticator ===
                              loginAuthenticator,
                          ).authenticatorIndex,
                      });
                      selectXionChain();
                    }}
                  >
                    <WalletIcon color="white" backgroundColor="#363635" />
                    <div className="flex flex-col gap-1">
                      <h1 className="text-sm font-bold font-akkuratLL leading-none">
                        Personal Account {i + 1}
                      </h1>
                      <h2 className="text-xs text-neutral-400 font-akkuratLL leading-tight">
                        {truncateAddress(node.id)}
                      </h2>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p>No Accounts Found.</p>
                  {connectionType !== "stytch" ? (
                    <p className="text-center text-neutral-400">
                      This authenticator can only be used as a backup right now.
                      Please log in with email to create an account.
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            {!fetchingNewWallets &&
            data?.smartAccounts?.nodes.length < 1 &&
            connectionType === "stytch" ? (
              <Button
                structure="naked"
                fullWidth={true}
                onClick={handleJwtAALoginOrCreate}
              >
                Create
              </Button>
            ) : null}
            <Button
              structure="outlined"
              fullWidth={true}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
