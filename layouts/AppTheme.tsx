import React, { useEffect, useState } from "react";
import Text from "@/components/Texts/Text";
import { ExitIcon, LogoSecondary } from "@/components/Icons/Icons";
import NotificationDropdown from "@/app/app/dashboard/_components/NotificationDropdown";
import { isNil, set } from "lodash";
import AccountModal from "@/components/AccountModal/AccountModal";
import { convertAmount } from "@/utils/contractUtils";
import NotificationModal from "@/components/Modal/NotificationModal";
import WalletButton from "@/components/Buttons/WalletButton";
import useChainAdapter from "@/hooks/useChainAdapter";
import { WalletType } from "@/enums/WalletType";
import { useProfile } from "@/contexts/ProfileProvider";
import { usePageData } from "@/contexts/DashboardProvider";
import { useBalances } from "@/contexts/BalanceProvider";
import { ChainName } from "@/enums/Chain";
import { useNotification } from "@/contexts/NotificationProvider";
import Swal from "sweetalert2";
import { EthereumChainId } from "@injectivelabs/ts-types";
import ChainData from "@/services/data/chain.json";
import MobileHamburgerMenu from "@/components/MobileHamburgerMenu";
import ChainSelector from "@/components/ChainSelector/ChainSelector";
import Tooltip from "@/components/Tooltip/Tooltip";
import OutlinedButton from "@/components/Buttons/OutlinedButton";
import { checkPoint } from "@/hooks/usePointer";
import pb from "@/lib/pocketbase";
import ReferralModal from "@/components/AccountModal/RefModal";

const chainID = EthereumChainId.Mainnet;

const AppTheme = () => {
  const {
    selectedChainName,
    isWalletConnected,
    baseCoin,
    walletInfo,
    address,
    username,
    selectedWallet,
    disconnect,
    disconnectMetamask,
    basePrice,
  } = useChainAdapter();
  const { addNotification, processLoading, setProcessLoading } =
    useNotification();
  const { balanceByDenom } = useBalances();
  const { pageData } = usePageData();
  const { profileDetail } = useProfile();

  const [accountModal, setAccountModal] = useState(false);

  const disconnectWallet = () => {
    if (walletInfo?.name === WalletType.METAMASK) {
      disconnectMetamask();
    } else {
      disconnect?.();
    }
    localStorage.removeItem("selectedWallet");
    localStorage.removeItem("profile-detail");
  };

  useEffect(() => {
    if (
      window.ethereum &&
      typeof window !== "undefined" &&
      selectedWallet === WalletType.METAMASK &&
      selectedChainName === ChainName.INJECTIVE &&
      isWalletConnected
    ) {
      const getChainId = async () => {
        const { ethereum } = window as any;
        const chainIdMetamask: any = await ethereum?.request({
          method: "eth_chainId",
        });

        if (chainIdMetamask != chainID) {
          CheckChain(chainIdMetamask);
        }
      };
      getChainId();

      window.ethereum?.on("chainChanged", (chainId: any) => {
        CheckChain(chainId);
        if (chainID === Number(chainId)) {
          /* ToastSuccess.fire({
            title: "Network Changed",
          }); */
          addNotification({
            status: "networkchange",
            directLink: "",
            message: "Network Changed",
          });
          //window.location.reload();
        }
      });
    }
  }, [selectedWallet, isWalletConnected]);
  const [expTime, setExpTime] = useState<number>(0);

  const [getTime, setGetTime] = useState<number>(new Date().getTime());

  useEffect(() => {
    //if (localTime && parseInt(localTime) < new Date().getTime()) {}
    const interval = setInterval(() => {
      setGetTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const [userId, setUserId] = useState<string>("");
  async function getPointsInfo(address: string) {
    try {
      const res = await pb
        .collection("points")
        .getFirstListItem(`address = '${address}'`);
      setUserId(res?.id || "");
      setExpTime(new Date(res?.updated).getTime() + 86400000);
    } catch (error) {
      console.log("error", error);
      setExpTime(0);
    }
  }
  useEffect(() => {
    address && getPointsInfo(address);
  }, [address]);
  async function getCheckPoint(address: string) {
    try {
      setProcessLoading(true);
      const res = await checkPoint(address);
      console.log("res", res);
      if (res?.updated) {
        addNotification({
          status: "check",
          directLink: "",
          message: "Your point updated successfully",
        });
        getPointsInfo(address);
      } else {
        addNotification({
          status: "checkError",
          directLink: "",
          message: "Failed to update your point",
        });
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setProcessLoading(false);
    }
  }

  const [chainData, setChainData] = useState<any>(ChainData);
  const [refModal, setRefModal] = useState<boolean>(false);
  const CheckChain = (id: number) => {
    try {
      id = Number(id);
      if (id !== chainID) {
        const { name } = chainData[id.toString()] || { name: "UNKNOW" };
        const fromNetwork = name || "Unknown Network";
        const toNetwork =
          chainData[chainID.toString()]?.name || "ETHERIUM NETWORK ";
        const alert = async () =>
          await Swal.fire({
            title: "Please Change Network",
            text: `From ${fromNetwork} to ${toNetwork}`,
            iconColor: "white",
            showCancelButton: false,
            showCloseButton: true,
            backdrop: true,
            background: "#150A17",
            iconHtml: `<img src="/images/checkchain.svg" width="150" height="150" class="w-full shrink-0 " style="background:#150A17" />`,
            color: "#fff",
            confirmButtonText: "Change Network",
            customClass: {
              icon: "!bg-[#150A17] w-[150px] h-auto !border-0",
              confirmButton:
                "w-full md:w-[350px] py-2 px-8 h-[50px] text-base font-normal confirmBtn md:mb-8",
              htmlContainer: "!text-white/50 !text-sm md:mb-3",
              title: "!text-[32px] ",
              popup: " lg:!p-10",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              window.ethereum?.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: chainData[chainID.toString()].chainId }],
              }) ||
                window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: chainData[chainID.toString()].chainId,
                      chainName: chainData[chainID.toString()].name,
                      nativeCurrency: {
                        name: chainData[chainID.toString()].nativeCurrency.name,
                        symbol:
                          chainData[chainID.toString()].nativeCurrency.symbol,
                        decimals: 18,
                      },
                      rpcUrls: chainData[chainID.toString()].rpcUrls,
                      blockExplorerUrls:
                        chainData[chainID.toString()].blockExplorerUrls,
                    },
                  ],
                });
            }
          });
        alert();
      }
    } catch (error) {
      console.log("CheckChain error:", error);
    }
  };

  return (
    <>
      <div className="bg-[#5C5CFF] opacity-[0.09] h-[600px] w-full  md:w-[600px] absolute -top-60 -translate-x-1/3 left-1/3 rounded-full blur-3xl -z-10 px-3" />
      <header className="md:mb-[88px]  w-full container mx-auto mt-8 flex justify-between items-center px-3 md:px-[64px]">
        <div className="flex items-center gap-2 mr-2">
          <LogoSecondary className="w-6 md:w-10 h-6 md:h-10" />
          <Text size="2xl">Aeroscraper</Text>
        </div>
        <div className="flex items-center">
          <Text size="base" className="mr-2 md:block hidden">
            Price Data:
          </Text>
          <div className="items-center gap-2 mr-8 md:flex hidden">
            <Text size="base">$1.00</Text>
            <Tooltip
              containerClassName="flex items-center text-white"
              width="w-fit"
              title="aUSD"
            >
              <img
                alt="ausd"
                className="w-5 h-5"
                src="/images/token-images/ausd.svg"
              />
            </Tooltip>
          </div>
          {!isNil(baseCoin) && (
            <div className="items-center gap-2 mr-6 md:flex hidden">
              <Text size="base">$ {basePrice.toFixed(4)}</Text>
              <Tooltip
                containerClassName="flex items-center text-white"
                width="w-fit"
                title="INJ"
              >
                <img
                  alt={baseCoin.name}
                  className="w-5 h-5"
                  src={baseCoin.tokenImage}
                />
              </Tooltip>
            </div>
          )}

          <div className="flex md:hidden items-center gap-4">
            <ChainSelector />
            <MobileHamburgerMenu
              setAccountModal={setAccountModal}
              disconnectWallet={disconnectWallet}
            />
          </div>
          <div className="md:flex hidden items-center">
            {isWalletConnected && !isNil(baseCoin) ? (
              <>
                <div className="md:flex hidden mr-3">
                  <OutlinedButton
                    disabledText="Already checked in today"
                    disabled={getTime < expTime}
                    loading={processLoading}
                    onClick={() => {
                      address && getCheckPoint(address);
                    }}
                    className="rounded-lg w-[128px] md:w-[128px] ml-2 text-center h-[52px]"
                  >
                    {getTime < expTime ? (
                      <div className="w-full flex flex-col items-center justify-start">
                        <Text size="base">Daily Check-In</Text>
                        <Text
                          size="sm"
                          className="text-white main-gradient w-fit px-6 mb-1 rounded-full"
                        >
                          {` ${new Date(expTime - getTime)
                            .toISOString()
                            .substr(11, 8)}`}
                        </Text>
                      </div>
                    ) : (
                      <Text size="base">Daily Check-In</Text>
                    )}
                  </OutlinedButton>
                </div>
                <button
                  onClick={() => {
                    setRefModal(true);
                  }}
                  className="text-base font-semibold text-gradient w-full h-10"
                >
                  Create Referral
                </button>
                <div className="md:flex hidden mr-3">
                  <NotificationDropdown />
                </div>
                <div>
                  <ChainSelector />
                </div>
                <button
                  onClick={() => {
                    setAccountModal(true);
                  }}
                  className="flex ml-12 gap-2 items-center hover:blur-[1px] transition-all duration-300"
                >
                  <img
                    alt="user-profile-image"
                    src={
                      profileDetail?.photoUrl ??
                      "/images/profile-images/profile-i-1.jpg"
                    }
                    className="rounded-sm bg-raisin-black w-12 h-12"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center ml-auto">
                      <img
                        alt={walletInfo?.name}
                        className="w-4 h-4 object-contain rounded"
                        src={walletInfo?.logo as string}
                      />
                      <Text
                        size="lg"
                        weight="font-regular"
                        className="truncate ml-2"
                      >
                        {username}
                      </Text>
                    </div>
                    <Text size="sm">
                      {address?.slice(0, 6)}...{address?.slice(-6)}
                    </Text>
                    <div></div>
                  </div>
                  <button
                    className="w-12 h-12 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      disconnectWallet();
                    }}
                  >
                    <ExitIcon className="text-white" />
                  </button>
                </button>
              </>
            ) : (
              <>
                <div className="mr-3">
                  <ChainSelector />
                </div>
                <WalletButton
                  ausdBalance={0}
                  className="rounded-lg w-[200px] md:w-[287px] ml-2 h-[36px] md:h-[48px]"
                  baseCoinBalance={
                    !isNil(baseCoin)
                      ? Number(
                        convertAmount(
                          balanceByDenom[baseCoin.denom]?.amount ?? 0,
                          baseCoin.decimal
                        )
                      )
                      : 0
                  }
                  basePrice={0}
                />
              </>
            )}
          </div>
        </div>
        <NotificationModal />
        <AccountModal
          balance={{
            ausd: pageData.ausdBalance,
            base: !isNil(baseCoin)
              ? Number(
                convertAmount(
                  balanceByDenom[baseCoin.denom]?.amount ?? 0,
                  baseCoin?.decimal
                )
              )
              : 0,
          }}
          basePrice={basePrice}
          showModal={accountModal}
          onClose={() => {
            setAccountModal(false);
          }}
        />
        <ReferralModal
          showModal={refModal}
          userId={userId}
          onClose={() => setRefModal(false)}
        />
      </header>
    </>
  );
};

export default AppTheme;
