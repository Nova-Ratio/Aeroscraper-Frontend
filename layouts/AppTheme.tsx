import React, { useState } from "react";
import Text from "@/components/Texts/Text";
import { ExitIcon, LogoSecondary } from "@/components/Icons/Icons";
import NotificationDropdown from "@/app/app/dashboard/_components/NotificationDropdown";
import { isNil } from "lodash";
import AccountModal from "@/components/AccountModal/AccountModal";
import { convertAmount } from "@/utils/contractUtils";
import NotificationModal from "@/components/Modal/NotificationModal";
import WalletButton from "@/components/Buttons/WalletButton";
import useChainAdapter from "@/hooks/useChainAdapter";
import { WalletType } from "@/enums/WalletType";
import { useProfile } from "@/contexts/ProfileProvider";
import { usePageData } from "@/contexts/DashboardProvider";
import { useBalances } from "@/contexts/BalanceProvider";
import MobileHamburgerMenu from "@/components/MobileHamburgerMenu";
import ChainSelector from "@/components/ChainSelector/ChainSelector";
import Tooltip from "@/components/Tooltip/Tooltip";

const AppTheme = () => {
  const {
    isWalletConnected,
    baseCoin,
    walletInfo,
    address,
    username,
    disconnect,
    basePrice
  } = useChainAdapter();
  const { balanceByDenom } = useBalances();
  const { pageData } = usePageData();
  const { profileDetail } = useProfile();

  const [accountModal, setAccountModal] = useState(false);

  const disconnectWallet = () => {
    disconnect?.();
    localStorage.removeItem("selectedWallet");
    localStorage.removeItem("profile-detail");
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
          <Text size="base" className="mr-2 md:block hidden">Price Data:</Text>
          <div className="items-center gap-2 mr-8 md:flex hidden">
            <Text size="base">$1.00</Text>
            <Tooltip containerClassName='flex items-center text-white' width='w-fit' title="aUSD">
              <img
                alt="ausd"
                className="w-5 h-5"
                src="/images/token-images/ausd-blue.svg"
              />
            </Tooltip>
          </div>
          {!isNil(baseCoin) && (
            <div className="items-center gap-2 mr-6 md:flex hidden">
              <Text size="base">$ {basePrice.toFixed(4)}</Text>
              <Tooltip containerClassName='flex items-center text-white' width='w-fit' title="SEI">
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
            <MobileHamburgerMenu setAccountModal={setAccountModal} disconnectWallet={disconnectWallet} />
          </div>
          <div className="md:flex hidden">
            {isWalletConnected && !isNil(baseCoin) ? (
              <>
                <div className="md:flex hidden mr-6">
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
          </div >
        </div >
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
      </header >
    </>
  );
};

export default AppTheme;
