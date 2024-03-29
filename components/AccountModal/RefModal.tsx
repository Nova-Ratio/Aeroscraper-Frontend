import useOutsideHandler from "@/hooks/useOutsideHandler";
import { motion } from "framer-motion";
import { FC, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { NumericFormat } from "react-number-format";
import { CounterUp } from "../CounterUp";
import Text from "../Texts/Text";
import ImageUpload from "./ImageUpload";
import Loading from "../Loading/Loading";
import GradientButton from "../Buttons/GradientButton";
import ProfilePhotoSlider from "./ProfilePhotosSlider";
import { AUSD_PRICE } from "@/utils/contractUtils";
import { Modal } from "../Modal/Modal";
import Button from "../Buttons/Button";
import { ArrowLeftIcon, ExitIcon } from "../Icons/Icons";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { isNil } from "lodash";
import useChainAdapter from "@/hooks/useChainAdapter";
import { TransactionDomainByChainName } from "@/constants/chainConstants";
import { ChainName } from "@/enums/Chain";
import { useProfile } from "@/contexts/ProfileProvider";
import { WalletType } from "@/enums/WalletType";
import { DefaultAssetByChainName } from "@/constants/assetConstants";
import OutlinedButton from "../Buttons/OutlinedButton";

interface Props {
  showModal: boolean;
  userId: string;
  onClose: () => void;
}

const ReferralModal: FC<Props> = (props: Props) => {
  const avatarSelectRef = useRef<HTMLDivElement>(null);
  const qrCodeViewRef = useRef<HTMLDivElement>(null);

  const {
    selectedChainName,
    username,
    address,
    baseCoin,
    walletInfo,
    chainInfo,
    disconnect,
    disconnectMetamask,
  } = useChainAdapter();
  const [isClipped, setIsClipped] = useState<string | null>(null);
  const closeModal = () => {
    setIsClipped(null);
    props.onClose();
  };
  const ref_url = `https://inj-dev.aeroscraper-frontend.pages.dev?ref=${props.userId}`;
  return (
    <Modal
      title="Profile"
      modalSize="sm"
      className=""
      showModal={props.showModal}
      onClose={closeModal}
    >
      <div className="flex  flex-col h-full w-full  main-gradient p-1  ">
        <div className="bg-licorice w-full h-full rounded-3xl text-white p-6 flex flex-col justify-center gap-6">
          <Text size="2xl">Create Referral </Text>
          <Text size="lg" className="text-gray-300">
            Create referral dummy text. Lorem ipsum dolor sit amet consectetur.
            Sed in cursus sollicitudin ut urna at.
          </Text>
          <div className="border border-[#073DC8] py-4 px-6 flex flex-col gap-1 rounded-3xl">
            <Text size="sm" className="text-white pl-2">
              Referral Link
            </Text>
            <div className="flex gap-3 items-center">
              <div className="bg-[#111130] py-3 px-6 w-fit  rounded-3xl">
                <Text size="lg"> {ref_url}</Text>
              </div>
              {isClipped === "ref" ? (
                <Text size="xs" textColor="text-[#37D489]">
                  Copied!
                </Text>
              ) : (
                <button
                  className="w-6 h-6 active:scale-90"
                  onClick={() => {
                    setIsClipped("ref");
                    navigator.clipboard.writeText(ref_url ?? "");
                  }}
                >
                  <img
                    alt="copy-to-clipboard"
                    src="/images/copy-to-clipboard.svg"
                    className="w-full h-full"
                  />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <div className='flex justify-center gap-4 mt-6'>
                <Text size='xl'>{address?.slice(0, 24)}...{address?.slice(-6)}</Text>
                {isClipped === "WALLET" ?
                  <Text size='xs' textColor="text-[#37D489]">Copied!</Text>
                  :
                  <button className='w-6 h-6 active:scale-90' onClick={() => { setIsClipped("WALLET"); navigator.clipboard.writeText(address ?? ''); }}>
                    <img
                      alt="copy-to-clipboard"
                      src='/images/copy-to-clipboard.svg'
                      className='w-full h-full'
                    />
                  </button>
                }
              </div> */}
      </div>
    </Modal>
  );
};

export default ReferralModal;
