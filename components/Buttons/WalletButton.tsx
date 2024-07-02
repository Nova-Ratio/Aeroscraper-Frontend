"use client";

import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import GradientButton from "@/components/Buttons/GradientButton";
import Text from "@/components/Texts/Text";
import { motion } from "framer-motion";
import useOutsideHandler from "@/hooks/useOutsideHandler";
import Loading from "../Loading/Loading";
import { Wallets } from "@/constants/walletConstants";
import { isNil } from "lodash";
import { Modal } from "../Modal/Modal";
import Button from "./Button";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import TransactionButton from "./TransactionButton";
import { ChainName } from "@/enums/Chain";
import { WalletType } from "@/enums/WalletType";
import { HashpackWallet } from "@/app/wallet/hashpack-wallet";
import { BladeWallet } from "@/app/wallet/blade-wallet";
import { useAppContext } from "@/contexts/AppProvider";
import { ChainInfoByName } from "@/constants/chainConstants";
import { WalletInfo } from "@/types/types";
import { WalletConnect } from "@/app/wallet/wallet-connect";

export const runtime = 'edge';

type Props = {
  ausdBalance?: number;
  baseCoinBalance?: number;
  className?: string;
  basePrice?: number;
};

const walletConnect = new WalletConnect();

const WalletButton: FC<Props> = ({ className = "w-[268px] h-[69px]" }) => {
  const ref = useRef<HTMLDivElement>(null);

  const { selectedChainName, selectWallet, userInfo, setUserInfo, isConnected, isConnecting, setIsConnecting } = useAppContext();

  const [wallets, setWallets] = useState<any>({
    hashpack: {
      name: 'hashpack',
      title: 'HashPack',
      instance: new HashpackWallet(setUserInfo),
    },
    blade: {
      name: 'blade',
      title: 'Blade',
      instance: new BladeWallet(setUserInfo),
    },
    walletconnect: {
      name: 'walletconnect',
      title: 'WalletConnect',
      instance: walletConnect,
    }
  });

  const [walletSelectionOpen, setWalletSelectionOpen] = useState(false);

  const [walletExtensions, setWalletExtensions] = useState<{ installed: WalletInfo[]; otherWallets: (WalletInfo & { downloadLink: string })[]; }>();

  const [showDownloadExtension, setShowDownloadExtension] = useState<(WalletInfo & { downloadLink: string }) | undefined>();

  useEffect(() => {
    walletConnect.init(setUserInfo).then(extensionData => {
      const walletConnectWallets: any = {};
      extensionData.forEach(extension => {
        if (extension.id === 'cnoepnljjcacmnjnopbhjelpmfokpijm') {
          walletConnectWallets.kabila = {
            name: 'kabila',
            title: extension.name || 'Kabila',
            instance: walletConnect,
            extensionId: extension.id,
          };
        }
      });

      setWallets({
        ...wallets,
        ...walletConnectWallets,
      })
    });
  }, []);


  useEffect(() => {
    checkWalletExtensions();
  }, []);

  const checkWalletExtensions = () => {
    const anyWindow: any = window;

    let walletExtensions: { installed: WalletInfo[]; otherWallets: (WalletInfo & { downloadLink: string })[]; } = {
      installed: [],
      otherWallets: [],
    };

    true ? walletExtensions.installed.push(Wallets.find(i => i.name === WalletType.HASHPACK)!) : walletExtensions.otherWallets.push({ ...Wallets.find(i => i.name === WalletType.HASHPACK)!, downloadLink: "https://chromewebstore.google.com/detail/hashpack/gjagmgiddbbciopjhllkdnddhcglnemk?hl=tr" });
    anyWindow.bladeConnect ? walletExtensions.installed.push(Wallets.find(i => i.name === WalletType.BLADE)!) : walletExtensions.otherWallets.push({ ...Wallets.find(i => i.name === WalletType.BLADE)!, downloadLink: "https://chromewebstore.google.com/detail/blade-%E2%80%93-hedera-web3-digit/abogmiocnneedmmepnohnhlijcjpcifd" });
    true ? walletExtensions.installed.push(Wallets.find(i => i.name === WalletType.WALLETCONNECT)!) : walletExtensions.otherWallets.push({ ...Wallets.find(i => i.name === WalletType.WALLETCONNECT)!, downloadLink: "https://chromewebstore.google.com/detail/blade-%E2%80%93-hedera-web3-digit/abogmiocnneedmmepnohnhlijcjpcifd" });

    setWalletExtensions(walletExtensions);
  };

  const connectWallet = (name: WalletType) => {
    setIsConnecting(true);

    if (userInfo.address) {
      if (userInfo.name === name) {
        return null;
      }

      wallets[name].instance.disconnect();
    }

    wallets[name].instance.connect(false, wallets[name]?.extensionId);

    selectWallet(name);

    setIsConnecting(false);
  }


  const toggleWallet = () => {
    setWalletSelectionOpen((prev) => !prev);
  };

  const closeWalletSelection = () => {
    setWalletSelectionOpen(false);
    setShowDownloadExtension(undefined);

    if (!isConnected) {

    }
  };

  useOutsideHandler(ref, closeWalletSelection);

  return (
    <div className="relative">
      <GradientButton className={className} onClick={() => {
        toggleWallet()
      }}>
        {isConnecting ? (
          <Loading width={36} height={36} />
        ) : (
          <Text size="base">Connect Wallet</Text>
        )}
      </GradientButton>

      <Modal modalSize="lg" showModal={walletSelectionOpen}>
        <div ref={ref} className="md:flex md:h-[644px]">
          <div className="pt-10 pl-8 w-[300px] md:border-r border-white/10 relative">
            <h2 className="text-[#F7F7FF] text-2xl font-medium">
              {!isNil(selectedChainName) ? "Connect Wallet" : "Select Chain"}
            </h2>
            {!isNil(selectedChainName) && (
              <div
                className={`gap-y-4 flex flex-col mt-10 ${isNil(selectedChainName) ? "hidden" : ""
                  }`}
              >
                {walletExtensions?.installed.map((wallet: any, idx: any) => {
                  return (
                    <div
                      key={idx}
                      className={`mr-auto`}
                    >
                      {idx === 0 && (
                        <Text size="base" className="mb-4">
                          Installed Wallets
                        </Text>
                      )}
                      <Button
                        onClick={() => {
                          connectWallet(wallet.name)
                        }}
                        startIcon={
                          <img
                            className="w-6 h-6 object-contain"
                            alt={wallet.name}
                            src={wallet.logo as string}
                          />
                        }
                      >
                        <span className="text-[18px] font-medium text-ghost-white">
                          {capitalizeFirstLetter(wallet.walletPrettyName)}
                        </span>
                      </Button>
                    </div>
                  );
                })}
                {walletExtensions?.otherWallets.map((wallet: any, idx: any) => (
                  <div
                    key={idx}
                    className={`mr-auto md:inline-block hidden`}
                  >
                    {idx === 0 && (
                      <Text size="base" className="mb-4">
                        Other Wallets
                      </Text>
                    )}
                    <Button
                      onClick={() => {
                        setShowDownloadExtension(wallet);
                      }}
                      startIcon={
                        <img
                          className="w-6 h-6 object-contain"
                          alt={wallet.name}
                          src={wallet.logo as string}
                        />
                      }
                    >
                      <span className="text-[18px] font-medium text-ghost-white">
                        {capitalizeFirstLetter(wallet.walletPrettyName)}
                      </span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {isNil(selectedChainName) && (
              <div className={`gap-y-4 flex-col mt-10 md:flex hidden`}>
                {/* {installedHoveredWallets.map((wallet: any, idx: any) => {
                  return (
                    <motion.div
                      key={idx}
                      className={`inline-block mr-auto duration-300 transition-all`}
                      initial={{ opacity: 0.0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      {idx === 0 && (
                        <Text size="base" className="mb-4">
                          Installed Wallets
                        </Text>
                      )}
                      <Button
                        disabled
                        onClick={() => {
                          wallet.connect();
                        }}
                        startIcon={
                          <img
                            className="w-6 h-6 object-contain"
                            alt={wallet.name}
                            src={wallet.logo as string}
                          />
                        }
                      >
                        <span className="text-[18px] font-medium text-ghost-white">
                          {capitalizeFirstLetter(wallet.walletPrettyName)}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })}

                {otherHoveredWallets.map((wallet: any, idx: any) => {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0.0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className={`inline-block mr-auto`}
                    >
                      {idx === 0 && (
                        <Text size="base" className="mb-4">
                          Other Wallets
                        </Text>
                      )}
                      <Button
                        disabled
                        onClick={() => {
                          setShowDownloadExtension({
                            name: wallet.walletPrettyName as WalletType,
                            downloadLink: walletExtensions?.otherWallets.find(
                              (i) => i.name === wallet.name
                            )?.downloadLink!,
                          });
                        }}
                        startIcon={
                          <img
                            className="w-6 h-6 object-contain"
                            alt={wallet.name}
                            src={wallet.logo as string}
                          />
                        }
                      >
                        <span className="text-[18px] font-medium text-ghost-white">
                          {capitalizeFirstLetter(wallet.walletPrettyName)}
                        </span>
                      </Button>
                    </motion.div>
                  );
                })} */}
              </div>
            )}
          </div>
          <div
            className={`flex-1 flex flex-col items-center justify-center text-center md:border-t-0 border-t border-white/20 mt-8 pt-8 md:pt-0`}
          >
            {showDownloadExtension && (
              <motion.div
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                className="mx-[140px]"
              >
                <img
                  className="w-[112px] h-[112px] object-contain mx-auto mb-14"
                  alt={showDownloadExtension.name}
                  src={showDownloadExtension.logo}
                />
                <Text size="4xl" textColor="text-white" className="mb-10">
                  {capitalizeFirstLetter(showDownloadExtension.name)} is not
                  installed
                </Text>
                <Text size="base" textColor="text-[#989396]">
                  If {capitalizeFirstLetter(showDownloadExtension.name)}{" "}
                  installed on your device, please refresh this page or follow
                  the browser instructions.
                </Text>
                <TransactionButton
                  className="w-[375px] h-11 mt-10 mx-auto"
                  onClick={() => {
                    window.open(
                      showDownloadExtension.downloadLink,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  text={`Install ${capitalizeFirstLetter(showDownloadExtension.name)}`}
                />
              </motion.div>
            )}
            {!showDownloadExtension &&
              <motion.div
                initial={{ opacity: 0.1 }}
                animate={{ opacity: 1 }}
                className="mx-10 md:mx-[140px] md:block hidden"
              >
                <Text
                  size="4xl"
                  textColor="text-white"
                  className="mb-4 md:mb-10 mt-4"
                >
                  How do I connect my wallet?
                </Text>
                <div className="flex justify-center items-center gap-16 mb-8">
                  {/* {filteredWallets.map((wallet: any, idx: any) => {
                    return (
                      <img
                        alt={wallet.name}
                        key={idx}
                        className={`w-6 h-6 object-contain`}
                        src={wallet.logo as string}
                      />
                    );
                  })} */}
                </div>
                <Text size="base" textColor="text-[#989396]">
                  If you want to connect an installed wallet, you can log in
                  by selecting your wallet under &quot;Installed Wallets&quot;
                  on the left side of the screen and using the browser
                  extension.
                </Text>
                <Text
                  size="base"
                  textColor="text-[#989396]"
                  className="mt-2 md:mt-10"
                >
                  If you do not have an installed wallet, you can choose one
                  of the wallet options on the left side of the screen and
                  follow the instructions to set up your wallet.
                </Text>
              </motion.div>}
          </div>
          {selectedChainName && (
            <div className="flex gap-4 items-center mt-auto absolute bottom-8 left-8">
              <Text size="base">Chain</Text>
              <div className="flex items-center space-x-2">
                <img
                  alt={selectedChainName}
                  src={ChainInfoByName[selectedChainName].logo}
                  className="w-6 h-6"
                />
                <Text size="lg">
                  {capitalizeFirstLetter(
                    ChainInfoByName[selectedChainName].displayName
                  )}
                </Text>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default WalletButton;
