import { FC, useEffect, useMemo, useRef, useState } from "react";
import Text from "../Texts/Text";
import { Modal } from "../Modal/Modal";
import { checkPoint } from "@/hooks/usePointer";
import { useAppContext } from "@/contexts/AppProvider";

interface Props {
  showModal: boolean;
  userId: string;
  onClose: () => void;
  refresh: Function;
  loading: boolean;
  setLoading: Function;
}

const ReferralModal: FC<Props> = ({
  showModal,
  userId,
  onClose,
  refresh,
  loading,
  setLoading,
}: Props) => {
  const avatarSelectRef = useRef<HTMLDivElement>(null);
  const qrCodeViewRef = useRef<HTMLDivElement>(null);

  const { userInfo } = useAppContext();
  const [isClipped, setIsClipped] = useState<string | null>(null);
  const closeModal = () => {
    setIsClipped(null);
    onClose();
  };
  const ref_url = `${process.env.NEXT_PUBLIC_WEBSITE_DOMAIN}?ref=${userId}`;
  async function createUser() {
    try {
      if (!userInfo.address || userId) {
        return;
      }
      setLoading(true);
      let res = await checkPoint(userInfo.address);
      console.log(res);
      refresh();
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    if (showModal) {
      createUser();
    }
  }, [showModal]);
  return (
    <Modal
      title="Profile"
      modalSize="xs"
      className=""
      showModal={showModal}
      onClose={closeModal}
    >
      <div className="flex  flex-col h-full w-full  main-gradient p-0.5">
        <div className="bg-licorice w-full h-full rounded-3xl text-white p-4 md:p-8 flex flex-col justify-center gap-6">
          <Text size="2xl">Create Referral </Text>
          <Text size="base" className="text-gray-300">
            Anyone who opens a trove using this referral link will get 100
            points and so will you.
          </Text>
          <div className="w-full bg-cetacean-dark-blue border backdrop-blur-[37px] border-blue-700/40 rounded-xl md:rounded-2xl px-3 pt-4 pb-3 md:px-4 md:py-4 flex flex-col gap-4">
            <div className="flex items-end justify-between w-full">
              <div className="w-full flex-col flex" >
                <Text size="sm" weight="mb-2">
                  Referral Link
                </Text>
                <div className="flex items-center gap-4 w-full">
                  <div className="bg-[#111130] py-3 px-4  rounded-md w-full">
                    {loading ? (
                      <Text size="sm">Creating...</Text>
                    ) : (
                      <Text size="sm">{ref_url}</Text>
                    )}
                  </div>
                  {isClipped === "ref" ? (
                    <Text size="xs" textColor="text-[#37D489]">
                      Copied!
                    </Text>
                  ) : (
                    <button
                      className="w-6 h-6 active:scale-90 shrink-0  min-w-[50px]"
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
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReferralModal;
