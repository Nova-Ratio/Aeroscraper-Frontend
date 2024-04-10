import { AnimatePresence, motion } from "framer-motion";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import Text from "@/components/Texts/Text";
import { ExitIcon, HamburgerIcon } from "./Icons/Icons";
import { convertAmount } from "@/utils/contractUtils";
import { isNil } from "lodash";
import WalletButton from "./Buttons/WalletButton";
import useChainAdapter from "@/hooks/useChainAdapter";
import { useBalances } from "@/contexts/BalanceProvider";
import { camelCaseToTitleCase } from "@/utils/stringUtils";
import NotificationDropdown from "@/app/app/dashboard/_components/NotificationDropdown";
import { useProfile } from "@/contexts/ProfileProvider";
import { useTabs } from "@/contexts/TabsProvider";
import useOutsideHandler from "@/hooks/useOutsideHandler";
import ReferralModal from "./AccountModal/RefModal";
import pb from "@/lib/pocketbase";
import OutlinedButton from "./Buttons/OutlinedButton";
import { checkPoint } from "@/hooks/usePointer";
import { useNotification } from "@/contexts/NotificationProvider";

interface Props {
  setAccountModal: Dispatch<boolean>;
  disconnectWallet: () => void;
}

const MobileHamburgerMenu: FC<Props> = ({
  setAccountModal,
  disconnectWallet,
}) => {
  const { addNotification, processLoading, setProcessLoading } =
    useNotification();

  const {
    isWalletConnected,
    baseCoin,
    walletInfo,
    address,
    username,
    basePrice,
  } = useChainAdapter();

  const { tabList, selectedTab, setSelectedTab } = useTabs();

  const { profileDetail } = useProfile();

  const [showMenu, setShowMenu] = useState(false);

  const { balanceByDenom } = useBalances();

  const ref = useRef(null);

  const [refModal, setRefModal] = useState<boolean>(false);

  const [userId, setUserId] = useState<string>("");

  const [expTime, setExpTime] = useState<number>(0);

  const [getTime, setGetTime] = useState<number>(new Date().getTime());

  useEffect(() => {
    if (showMenu) {
      address && getPointsInfo();
    }
  }, [showMenu, address]);

  const handleShowMenu = () => {
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  const getCheckPoint = async (address: string) => {
    try {
      setProcessLoading(true);
      const res = await checkPoint(address);
      console.log("res", res);
      if (res?.updated) {
        if (res?.data?.message.includes("Created")) {
          addNotification({
            status: "create",
            directLink: "",
            message: "Your account created successfully. Please click Daily Check-In again.",
          });
        } else {
          addNotification({
            status: "check",
            directLink: "",
            message: "Your point updated successfully",
          });
        }
        getPointsInfo();
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
  };

  const getPointsInfo = async () => {
    try {
      const res = await pb
        .collection(
          process.env.NEXT_PUBLIC_WEBSITE_REF_COLLECTION_NAME as string
        )
        .getFirstListItem(`address = '${address}'`);
      setUserId(res?.id || "");
      setExpTime(res?.expTime || 0);
    } catch (error) {
      console.log("error", error);
      setExpTime(0);
    }
  };

  useOutsideHandler(ref, handleCloseMenu);

  return (
    <div>
      <button className="pt-2" onClick={handleShowMenu}>
        <HamburgerIcon />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, right: -100, top: -15 }}
            animate={{ opacity: 1, right: 0, top: 0 }}
            exit={{ opacity: 0 }}
            className={`z-[50] fixed text-end rounded-tl-lg rounded-bl-lg top-0 -right-2 border-2 border-white/10 p-7 backdrop-blur bg-[#1a0b1c]`}
          >
            <button className="pt-2" onClick={handleCloseMenu}>
              <HamburgerIcon />
            </button>
            <ul className="space-y-4 my-6 border-b border-red-500/90 pb-8 -mx-6 px-6">
              {tabList.map((tab) => (
                <motion.li
                  key={tab}
                  onClick={() => {
                    setSelectedTab?.(tab);
                    handleCloseMenu();
                  }}
                >
                  <Text
                    weight={tab == selectedTab ? "font-bold" : "font-regular"}
                    textColor={`${
                      tab == selectedTab ? "text-gradient" : "text-white"
                    }`}
                  >
                    {camelCaseToTitleCase(tab)}
                  </Text>
                </motion.li>
              ))}
            </ul>
            {isWalletConnected && !isNil(baseCoin) ? (
              <>
                <OutlinedButton
                  disabledText="Already checked in today"
                  disabled={getTime < expTime}
                  loading={processLoading}
                  onClick={() => {
                    address && getCheckPoint(address);
                  }}
                  containerClassName="w-full mb-2 px-8"
                  className="rounded-lg text-center h-16 flex"
                >
                  {getTime < expTime ? (
                    <div className="flex flex-col mx-4 items-center justify-start">
                      <Text size="base">Daily Check-In</Text>
                      <Text
                        size="sm"
                        className="text-white main-gradient w-fit px-6 py-1 mt-1 mb-1 rounded-md"
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
                <button
                  onClick={() => {
                    setRefModal(true);
                  }}
                  className=" text-base font-semibold text-gradient w-full h-10"
                >
                  Create Referral
                </button>
                <button
                  onClick={() => {
                    setAccountModal(true);
                  }}
                  className="flex gap-2 items-center hover:blur-[1px] transition-all duration-300 mt-6"
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
                      handleCloseMenu();
                    }}
                  >
                    <ExitIcon className="text-white" />
                  </button>
                </button>
              </>
            ) : (
              <WalletButton
                ausdBalance={0}
                className="rounded-lg w-[220px] ml-2 h-[36px] md:h-[48px]"
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
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ReferralModal
        showModal={refModal}
        userId={userId}
        onClose={() => setRefModal(false)}
        refresh={getPointsInfo}
        loading={processLoading}
        setLoading={setProcessLoading}
      />
    </div>
  );
};

export default MobileHamburgerMenu;
