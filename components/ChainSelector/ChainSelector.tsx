import React, { FC } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import { CheckIcon } from "@/components/Icons/Icons";
import { appChainURLs } from "@/constants/chainConstants";
import Image from "next/image";
import Text from "../Texts/Text";
import useChainAdapter from "@/hooks/useChainAdapter";

const ChainSelector: FC = () => {
    const { chainInfo } = useChainAdapter();

    return (
        <Dropdown
            toggleButton={
                <BorderedContainer
                    containerClassName="md:w-12 md:h-12 w-6 h-6 p-[1.5px]"
                    className="w-full h-full flex justify-center items-center"
                >
                    <div className="md:hidden block">
                        <Image
                            alt={chainInfo.name}
                            width={12}
                            height={12}
                            src={chainInfo.logo}
                        />
                    </div>
                    <div className="md:block hidden">
                        <Image
                            alt={chainInfo.name}
                            width={24}
                            height={24}
                            src={chainInfo.logo}
                        />
                    </div>
                </BorderedContainer>
            }
        >
            <BorderedContainer
                containerClassName="w-[155px] notification-dropdown-gradient p-[1.5px]"
                className="relative p-4 overflow-auto scrollbar-hidden"
            >
                <div className="flex flex-col gap-4">
                    {
                        appChainURLs.map((chain, idx) => {
                            return (
                                <>
                                    <a href={chain.url} className="flex items-center gap-3 hover:opacity-60 transition-all">
                                        <div className="w-6 h-6 flex items-center justify-center">
                                            {
                                                chain.url.includes(window.location.host) ?
                                                    <CheckIcon width="20" height="20" />
                                                    :
                                                    <Image
                                                        alt={chain.chainName}
                                                        width={24}
                                                        height={24}
                                                        src={chain.image}
                                                    />
                                            }
                                        </div>
                                        <Text size="lg">
                                            {chain.chainName}
                                        </Text>
                                    </a>
                                    {
                                        idx !== appChainURLs.length - 1 &&
                                        <span className='w-full h-[1px] bg-white' />
                                    }
                                </>
                            )
                        })
                    }
                </div>
            </BorderedContainer>
        </Dropdown>
    );
};

export default ChainSelector;