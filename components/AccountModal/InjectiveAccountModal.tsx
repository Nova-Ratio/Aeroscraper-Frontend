import { useWallet } from "@/contexts/WalletProvider";
import useOutsideHandler from "@/hooks/useOutsideHandler";
import { useCompass } from "@/services/compass";
import { useFin } from "@/services/fin";
import { useKeplr } from "@/services/keplr";
import { useLeap } from "@/services/leap";
import { motion } from "framer-motion";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import QRCode from 'react-qr-code';
import { WalletType } from "@/enums/WalletType";
import { NumericFormat } from "react-number-format";
import { CounterUp } from "../CounterUp";
import Text from '../Texts/Text';
import ImageUpload from "./ImageUpload";
import Loading from "../Loading/Loading";
import GradientButton from "../Buttons/GradientButton";
import ProfilePhotoSlider from "./ProfilePhotosSlider";
import { AUSD_PRICE } from "@/utils/contractUtils";
import { ClientEnum } from "@/types/types";
import { BaseCoinByClient, ClientTransactionUrlByName, WalletImagesByName } from "@/constants/walletConstants";
import { Modal } from "../Modal/Modal";
import Button from "../Buttons/Button";
import { ArrowLeftIcon, ExitIcon } from "../Icons/Icons";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

interface Props {
  showModal: boolean,
  onClose: () => void,
  balance: { ausd: number, base: number }
  basePrice: number
}

type Tabs = "avatar-select" | "wallet-details"

const AccountModal: FC<Props> = (props: Props) => {
  const avatarSelectRef = useRef<HTMLDivElement>(null);
  const qrCodeViewRef = useRef<HTMLDivElement>(null);

  const keplr = useKeplr();
  const leap = useLeap();
  const fin = useFin();
  const compass = useCompass();

  const { walletType, name, address, profileDetail, baseCoin, setProfileDetail } = useWallet();

  const [selectedTab, setSelectedTab] = useState<Tabs | null>(null);

  const [isClipped, setIsClipped] = useState<"QR" | "WALLET" | null>(null);

  const [photoUrlInput, setPhotoUrlInput] = useState<string>("");
  const [processLoading, setProcessLoading] = useState<{ status: boolean, idx?: number }>({ status: false, idx: -1 });

  const totalDollarBalance = useMemo(() => (props.balance.ausd * AUSD_PRICE) + (props.balance.base * props.basePrice), [props.balance, props.basePrice]);

  const [errorLargeSize, setErrorLargeSize] = useState<boolean>(false);

  const openAvatarSelection = () => {
    setSelectedTab("avatar-select");
  }

  const closeAvatarSelection = () => {
    setSelectedTab(null);
  }

  const openQrCodeView = () => {
    setSelectedTab("wallet-details");
  }

  const closeQrCodeview = () => {
    setSelectedTab("wallet-details");
    setIsClipped(null);
  }

  const closeModal = () => {
    setIsClipped(null);
    props.onClose();
  }

  const disconnect = () => {
    keplr.disconnect();
    leap.disconnect();
    fin.disconnect();
    compass.disconnect();
    setProfileDetail(undefined);
    localStorage.removeItem("profile-detail");
    closeModal();
  }

  const updateProfilePhoto = async (photoUrl: string, idx?: number) => {

    const walletAddress = localStorage.getItem("wallet_address");

    const previousPhotos = JSON.parse(localStorage.getItem("previous-photos")!) ?? []

    if (walletAddress) {
      setProcessLoading({ status: true, idx });

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API}/api/users/update-profile-detail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            photoUrl: photoUrl,
            appType: 999
          })
        });
        if (response.status === 200) {
          const data = await response.json();

          localStorage.setItem(
            "previous-photos",
            JSON.stringify([photoUrl, ...previousPhotos])
          );

          localStorage.setItem("profile-detail", JSON.stringify(data.user));

          setPhotoUrlInput("");

          setProfileDetail({
            walletAddress,
            photoUrl: photoUrl,
            appType: 999
          });

          closeAvatarSelection();

          setErrorLargeSize(false);
        }

        if (response.status === 413) {
          setErrorLargeSize(true);
        }
      }
      catch (error) {
        console.error(error);
      }
    }
    setProcessLoading({ status: false, idx: -1 });
  }

  useOutsideHandler(avatarSelectRef, closeAvatarSelection);
  useOutsideHandler(qrCodeViewRef, closeQrCodeview);

  let clientType = "INJECTIVE" 
    useEffect(() => {
        if (typeof window !== "undefined") {
            clientType = localStorage.getItem("selectedClientType") as ClientEnum;
          }
    }, [])
    //@ts-ignore
  let scanDomain = ClientTransactionUrlByName[clientType]?.accountUrl

  return (
    <Modal title="Profile" modalSize='lg' showModal={props.showModal} onClose={closeModal}>
      <div className='flex h-[644px]'>
        <div className='pt-10 pr-24 shrink-0 px-8 border-r border-white/10 h-full relative'>
          <h2 className='text-[#F7F7FF] text-2xl font-medium'>Profile</h2>
          <div className="mt-6 space-y-6">
            <Button active={selectedTab === "avatar-select"} onClick={() => { setSelectedTab("avatar-select"); }}>Set an avatar</Button>
            <Button active={selectedTab === "wallet-details"} onClick={() => { setSelectedTab("wallet-details"); }}>Wallet details</Button>
          </div>
          <button className='flex items-center justify-center absolute bottom-10' onClick={disconnect}>
            <span className="text-[#ED0E00] text-base font-medium mr-2">Log out</span>
            <ExitIcon className="text-[#ED0E00]" />
          </button>
        </div>
        <div className={`flex-1 flex flex-col items-center justify-center text-center rounded-3xl relative`}>
          {selectedTab !== null && (
            <button className="absolute left-8 top-8" onClick={() => { setSelectedTab(null); }}>
              <ArrowLeftIcon className="text-white" />
            </button>
          )}
          {selectedTab === null && (
            <div className="px-28">
              <div className="space-y-8">
                <div onClick={openAvatarSelection} className="secondary-gradient w-[148px] h-[148px] p-0.5 rounded-lg gap-2 mx-auto cursor-pointer">
                  <img
                    alt="user-profile-image"
                    src={profileDetail?.photoUrl ?? profilePhotos[0]}
                    className='w-full h-full rounded-md bg-raisin-black'
                  />
                </div>
                <Text size='3xl' textColor='text-white'>{name}</Text>
              </div>
              <div className='flex gap-4 mt-6'>
                <Text size='xl'>{address.slice(12)}...{address.slice(-5)}</Text>
                {isClipped === "WALLET" ?
                  <Text size='xs' textColor="text-[#37D489]">Copied!</Text>
                  :
                  <button className='w-6 h-6 active:scale-90' onClick={() => { setIsClipped("WALLET"); navigator.clipboard.writeText(address); }}>
                    <img
                      alt="copy-to-clipboard"
                      src='/images/copy-to-clipboard.svg'
                      className='w-full h-full'
                    />
                  </button>
                }
              </div>
              <div className="flex flex-row w-full items-end justify-between mt-10">
                <div>
                  <Text size='sm' textColor='text-dark-silver'>Balance</Text>
                  <Text size='lg' className='mt-2'>${totalDollarBalance.toFixed(2)}</Text>
                </div>
                <NumericFormat
                  value={props.balance.ausd}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  displayType="text"
                  renderText={(value) =>
                    <Text size='lg' className='mt-2 flex gap-2 items-center'>
                      <img alt="ausd" className="w-5 h-5" src="/images/token-images/ausd-blue.svg" />
                      <CounterUp from={"0"} to={value} duration={0.5} />
                      AUSD
                    </Text>
                  }
                />
                <NumericFormat
                  value={props.balance.base}
                  thousandsGroupStyle="thousand"
                  thousandSeparator=","
                  fixedDecimalScale
                  decimalScale={2}
                  displayType="text"
                  renderText={(value) =>
                    <Text size='lg' className='mt-2 flex gap-2 items-center ml-6'>
                      {baseCoin && <img alt={baseCoin.name} className="w-5 h-5" src={baseCoin.image} />}
                      <CounterUp from={"0"} to={value} duration={0.5} />
                      INJ
                    </Text>
                  }
                />
              </div>
            </div>
          )}
          {selectedTab === "avatar-select" && (
            <div className='px-16 text-start'>
              <Text size='lg' textColor="text-dark-silver" className="mb-6">Select an avatar</Text>
              <ProfilePhotoSlider processLoading={processLoading} updateProfilePhoto={updateProfilePhoto} slider={profilePhotos} />
              <div className="mt-6 pt-6 border-t-2 border-white/10">
                <Text size='lg' textColor="text-dark-silver" className="mb-6">Uplod an Avatar</Text>
                <div className="flex gap-6">
                  <div className="w-[148px]">
                    <ImageUpload type={2} processLoading={processLoading.status} onImageUpload={(e) => { updateProfilePhoto(e); }} />
                  </div>
                  <div className="flex-1">
                    <div className="relative bg-[#211021] w-full px-4 py-3 rounded-lg flex items-center">
                      <Text size='base' className="mr-auto" textColor="text-white">Upload with URL:</Text>
                      <input value={photoUrlInput} onChange={(e) => { setPhotoUrlInput(e.target.value); }} className="focus:outline-none text-white bg-transparent flex-1 ml-3" />
                    </div>
                    <GradientButton onClick={() => { updateProfilePhoto(photoUrlInput); }} className="w-[200px] h-10 ml-auto mt-10" rounded="rounded-lg">
                      {processLoading.status ?
                        <Loading width={20} height={20} />
                        :
                        <Text>Save</Text>
                      }
                    </GradientButton>
                  </div>
                </div>
                {errorLargeSize &&
                  <motion.div
                    onClick={() => { setErrorLargeSize(false); }}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='text-orange-600 p-2 bg-orange-200 rounded text-sm w-full cursor-pointer mt-4'>
                    Payload too Large (max. 75kb)
                  </motion.div>
                }
              </div>
            </div>
          )}
          {selectedTab === "wallet-details" && (
            <div className='px-8 w-full'>
              <div className="flex items-center mb-16 mt-12">
                <div >
                  <Text size='sm' className="text-start mb-3" textColor='text-dark-silver'>Selected chain</Text>
                  <Button
                    startIcon={<img alt={clientType} src={
                      //@ts-ignore
                      BaseCoinByClient[clientType].image} className='w-6 h-6' />}
                  >
                    {capitalizeFirstLetter(clientType.toLocaleLowerCase())}
                  </Button>
                </div>
                <div className="ml-14">
                  <Text size='sm' className="text-start mb-3" textColor='text-dark-silver'>Selected wallet</Text>
                  <Button
                    startIcon={<img alt={walletType} src={WalletImagesByName[walletType!].image} className='w-6 h-6' />}
                  >
                    {capitalizeFirstLetter(walletType?.toLocaleLowerCase() ?? "")}
                  </Button>
                </div>
                <a href={`${scanDomain}${address}`} target='_blank' rel="noreferrer" className='ml-auto underline flex text-white'>
                  Scan
                  <img alt='link' src="/images/external-link.svg" className='w-full h-full object-contain ml-1.5' />
                </a>
              </div>
              <Text size='lg' textColor='text-white' className="mb-3">{name}</Text>
              <div className='w-[309px] h-[309px] lg:w-[309px] lg:h-[309px] bg-white rounded-lg p-3 mx-auto'>
                <QRCode className='w-full h-full' value={address} />
              </div>
              <div className='flex gap-4 mt-6 justify-center'>
                <Text size='xl'>{address.slice(12)}...{address.slice(-5)}</Text>
                {isClipped === "WALLET" ?
                  <Text size='xs' textColor="text-[#37D489]">Copied!</Text>
                  :
                  <button className='w-6 h-6 active:scale-90' onClick={() => { setIsClipped("WALLET"); navigator.clipboard.writeText(address); }}>
                    <img
                      alt="copy-to-clipboard"
                      src='/images/copy-to-clipboard.svg'
                      className='w-full h-full'
                    />
                  </button>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal >
  )
}

export default AccountModal;

export const WalletIconMap: Record<WalletType, string> = {
  [WalletType.KEPLR]: '/images/wallet-images/keplr-icon.svg',
  [WalletType.LEAP]: '/images/wallet-images/leap-icon.png',
  [WalletType.FIN]: '/images/wallet-images/fin-icon.png',
  [WalletType.COMPASS]: '/images/wallet-images/compass-icon.png',
  [WalletType.NOT_SELECTED]: ''
}

const profilePhotos = [
  "/images/profile-images/profile-i-1.jpg",
  "/images/profile-images/profile-i-2.jpg",
  "/images/profile-images/profile-i-3.jpg",
  "/images/profile-images/profile-i-4.jpg",
  "/images/profile-images/profile-i-5.jpg"
]