import { useWallet } from "@/contexts/WalletProvider";
import useOutsideHandler from "@/hooks/useOutsideHandler";
import { useCompass } from "@/services/compass";
import { useFin } from "@/services/fin";
import { useKeplr } from "@/services/keplr";
import { useLeap } from "@/services/leap";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FC, useRef, useState } from "react";
import { Modal } from "../Modal/Modal";
import TooltipWrapper from "./TooltipWrapper";
import QRCode from 'react-qr-code';
import { WalletType } from "@/enums/WalletType";
import { NumericFormat } from "react-number-format";
import { CounterUp } from "../CounterUp";
import Text from '../Texts/Text';
import ImageUpload from "./ImageUpload";
import Loading from "../Loading/Loading";
import GradientButton from "../Buttons/GradientButton";

interface Props {
    showModal: boolean,
    onClose: () => void
}

const AccountModal: FC<Props> = (props: Props) => {


    const avatarSelectRef = useRef<HTMLDivElement>(null);
    const qrCodeViewRef = useRef<HTMLDivElement>(null);

    const keplr = useKeplr();
    const leap = useLeap();
    const fin = useFin();
    const compass = useCompass();

    const { walletType, name, balanceByDenom, address, profileDetail, setProfileDetail } = useWallet();

    const [avatarSelectionOpen, setAvatarSelectionOpen] = useState(false);
    const [qrCodeViewOpen, setQrCodeViewOpen] = useState(false);
    const [isClipped, setIsClipped] = useState<"QR" | "WALLET" | null>(null);

    const [photoUrlInput, setPhotoUrlInput] = useState<string>("");
    const [processLoading, setProcessLoading] = useState<{ status: boolean, idx?: number }>({ status: false, idx: -1 });

    const openAvatarSelection = () => {
        setAvatarSelectionOpen(true);
    }

    const closeAvatarSelection = () => {
        setAvatarSelectionOpen(false);
    }

    const openQrCodeView = () => {
        setQrCodeViewOpen(true);
    }

    const closeQrCodeview = () => {
        setQrCodeViewOpen(false);
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
console.log(process.env.PROFILE_API);

    const updateProfilePhoto = async (photoUrl: string, idx?: number) => {

        const walletAddress = localStorage.getItem("wallet_address");

        if (walletAddress) {
            setProcessLoading({ status: true, idx });

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API}/api/users/update-profile-detail`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress,
                        photoUrl: photoUrl
                    })
                });
                if (response.status === 200) {
                    const data = await response.json();

                    localStorage.setItem("profile-detail", JSON.stringify(data.user));

                    setPhotoUrlInput("");

                    setProfileDetail({
                        walletAddress,
                        photoUrl: photoUrl,
                        appType: 999
                    });

                    closeAvatarSelection();
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

    return (
        <Modal layoutId="profile" title="Profile" showModal={props.showModal} onClose={closeModal}>
            <div>
                <div className="flex items-center gap-14 mb-4">
                    <div onClick={openAvatarSelection} className="secondary-gradient w-[148px] h-[148px] p-0.5 rounded-lg flex justify-between items-center gap-2 cursor-pointer">
                        <img
                            alt="user-profile-image"
                            src={profileDetail?.photoUrl ?? profilePhotos[0]}
                            className='w-full h-full rounded-md bg-raisin-black'
                        />
                    </div>
                    <Text size='3xl' textColor='text-white'>{name}</Text>
                </div>
                <div className='col-span-6 lg:col-span-4 row-span-s flex flex-col gap-3 w-full '>
                    <div className="bg-raisin-black px-6 py-4 rounded-lg">
                        <Text size='2xl' textColor='text-dark-silver'>Balance</Text>
                        <Text size='2xl' className='mt-4'>$0</Text>
                        <div className='flex items-center justify-between'>
                            <NumericFormat
                                value={balanceByDenom["ausd"]?.amount ?? 0}
                                thousandsGroupStyle="thousand"
                                thousandSeparator=","
                                fixedDecimalScale
                                decimalScale={2}
                                displayType="text"
                                renderText={(value) =>
                                    <Text size='3xl' className='mt-2 flex gap-2'>
                                        <CounterUp from={"0"} to={value} duration={0.5} /> AUSD
                                    </Text>
                                }
                            />

                            <Link href='/wallet' onClick={closeModal}>
                                <Text textColor='text-dark-silver' className='underline'>View all assets</Text>
                            </Link>
                        </div>
                    </div>
                    <div className="bg-raisin-black px-6 py-4 rounded-lg">
                        <div className='flex items-center justify-between'>
                            <Text size='2xl' textColor='text-dark-silver'>Wallet</Text>
                            <div className='flex items-center gap-6'>
                                <TooltipWrapper title='Mintscan'>
                                    <a href={`${address}`} target='_blank' rel="noreferrer" className='w-6 h-6'>
                                        <img alt='link' src="/images/external-link.svg" className='w-full h-full object-contain' />
                                    </a>
                                </TooltipWrapper>
                                <TooltipWrapper title='QR Code'>
                                    <button className='w-6 h-6' onClick={openQrCodeView}>
                                        <img alt='scan' src="/images/scan.svg" className='w-full h-full object-contain' />
                                    </button>
                                </TooltipWrapper>
                                <TooltipWrapper title='Log Out'>
                                    <button className='w-6 h-6' onClick={disconnect}>
                                        <img alt='exit' src="/images/exit.svg" className='w-full h-full object-contain' />
                                    </button>
                                </TooltipWrapper>
                            </div>
                        </div>
                        <div className='flex flex-col lg:flex-row items-start lg:items-center gap-5 mt-6'>
                            {walletType && <img alt={`walletType-${walletType}`} className='w-16 h-16 object-contain' src={WalletIconMap[walletType]} />}
                            <div className='w-full flex flex-col justify-between'>
                                <Text size='2xl'>SEI</Text>
                                <div className='w-full flex items-center gap-2'>
                                    <Text size='xl' responsive className='lg:w-[352px] truncate'>{address}</Text>
                                    {isClipped === "WALLET" ?
                                        <Text size='base' textColor="text-[#37D489]">Copied!</Text>
                                        :
                                        <button className='w-6 h-6' onClick={() => { setIsClipped("WALLET"); navigator.clipboard.writeText(address); }}>
                                            <img
                                                alt="copy-to-clipboard"
                                                src='/images/copy-to-clipboard.svg'
                                                className='w-full h-full'
                                            />
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {
                        qrCodeViewOpen &&
                        <motion.div
                            ref={qrCodeViewRef}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 20 }}
                            exit={{ scale: 0, y: -80, x: 100 }}
                            transition={{ bounce: true }}
                            className='absolute w-[352px] top-1/2 right-0'
                        >
                            <div className='relative w-full h-full flex flex-col gap-6 items-center bg-english-violet rounded-lg p-6'>
                                <div className='w-[182px] h-[182px] lg:w-[132px] lg:h-[132px] bg-white rounded-lg p-3'>
                                    <QRCode className='w-full h-full' value={address} />
                                </div>
                                <div className='w-full max-w-[305px] flex justify-between items-center gap-2 rounded-lg px-2 py-1 bg-[#74517A]'>
                                    <Text textColor='text-white' size="lg" className='w-[228px] truncate'>{address}</Text>
                                    {isClipped === "QR" ?
                                        <Text size='base' textColor="text-[#37D489]">Copied!</Text>
                                        :
                                        <button className='w-6 h-6' onClick={() => { setIsClipped("QR"); navigator.clipboard.writeText(address); }}>
                                            <img
                                                alt="copy-to-clipboard"
                                                src='/images/copy-to-clipboard.svg'
                                                className='w-full h-full'
                                            />
                                        </button>
                                    }
                                </div>
                                <button onClick={closeQrCodeview}>
                                    <img alt="close-qr-view" src="/images/close.svg" className='absolute top-5 right-5' />
                                </button>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {
                        avatarSelectionOpen &&
                        <motion.div
                            ref={qrCodeViewRef}
                            initial={{ opacity: 0, translateY: "0%" }}
                            animate={{ opacity: 1, translateY: "-60%" }}
                            exit={{ scale: 0, y: -80, x: 100 }}
                            transition={{ bounce: true }}
                            className='absolute w-full top-1/2 right-0'
                        >
                            <div className='relative w-full h-full flex flex-col gap-6 items-center bg-english-violet rounded-lg p-6'>
                                <Text size='xl' className="mr-auto">Select Avatar</Text>
                                <div className='grid grid-cols-6 gap-4'>
                                    {
                                        profilePhotos.map((photoURL, idx) => (
                                            <div
                                                key={photoURL}
                                                className={`relative cursor-pointer hover:opacity-80 transition secondary-gradient flex items-center rounded-md justify-center p-0.5 ${profileDetail?.photoUrl === photoURL ? "opacity-50 cursor-not-allowed" : ""}`}
                                                onClick={() => { updateProfilePhoto(photoURL, idx); }}
                                            >
                                                <img alt={`profile_photo`} className='w-20 h-20 rounded bg-[#6F6F73]' src={photoURL} />
                                                {(processLoading.status && processLoading.idx == idx) && <Loading height={48} width={48} className="absolute" />}
                                            </div>
                                        ))
                                    }
                                </div>
                                <Text size='xl' className="mr-auto">Uplod an Avatar</Text>
                                <div className="relative bg-[#74517A] w-full px-2 py-2.5 rounded flex items-center">
                                    <Text size='base' className="mr-auto">Upload with URL:</Text>
                                    <input value={photoUrlInput} onChange={(e) => { setPhotoUrlInput(e.target.value); }} placeholder="https://" className="focus:outline-none text-white bg-transparent flex-1 ml-3" />
                                    {photoUrlInput.includes("http") &&
                                        <GradientButton onClick={() => { updateProfilePhoto(photoUrlInput); }} className="w-[121px] h-0 absolute right-0" rounded="rounded-lg">
                                            {processLoading.status ?
                                                <Loading width={20} height={20} />
                                                :
                                                <Text>Save</Text>
                                            }
                                        </GradientButton>
                                    }
                                </div>
                                <Text size='sm' className="mx-auto" >or</Text>
                                <ImageUpload processLoading={processLoading.status} onImageUpload={(e) => { updateProfilePhoto(e); }} />
                                <button onClick={closeAvatarSelection}>
                                    <img alt="close-qr-view" src="/images/close.svg" className='absolute top-5 right-5' />
                                </button>
                            </div>
                        </motion.div>
                    }
                </AnimatePresence>
            </div>
        </Modal>
    )
}

export default AccountModal;

export const WalletIconMap: Record<WalletType, string> = {
    [WalletType.KEPLR]: '/images/keplr-icon.svg',
    [WalletType.LEAP]: '/images/leap-icon.png',
    [WalletType.FIN]: '/images/fin-icon.png',
    [WalletType.COMPASS]: '/images/compass-icon.png',
    [WalletType.NOT_SELECTED]: ''
}

const profilePhotos = [
    "/images/profile-images/profile-i-1.jpg",
    "/images/profile-images/profile-i-2.jpg",
    "/images/profile-images/profile-i-3.jpg",
    "/images/profile-images/profile-i-4.jpg",
    "/images/profile-images/profile-i-5.jpg",
    "/images/profile-images/profile-i-6.jpg",
]