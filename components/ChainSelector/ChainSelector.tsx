"use client"

import React, { FC, useEffect, useState } from "react";
import Dropdown from "@/components/Dropdown/Dropdown";
import BorderedContainer from "@/components/Containers/BorderedContainer";
import { CheckIcon } from "@/components/Icons/Icons";
import { appChainURLs } from "@/constants/chainConstants";
import Image from "next/image";
import Text from "../Texts/Text";
import Tooltip from "../Tooltip/Tooltip";
import { groupBy } from "lodash";
import { ChainNavigator } from "@/enums/Chain";
import { useAppContext } from "@/contexts/AppProvider";

const chainsGroupByEnv = groupBy(appChainURLs, 'env');

const ChainSelector: FC = () => {
    const { chainInfo } = useAppContext();
    const [selectedChain, setSelectedChain] = useState<ChainNavigator>();

    useEffect(() => {
        const chain = appChainURLs.find(chain => chain.isSelected);
        setSelectedChain(chain);
    }, [])

    return (
        <Dropdown
            toggleButton={
                <Tooltip
                    containerClassName="text-white whitespace-nowrap"
                    width="w-fit"
                    title={`${selectedChain?.chainName}-${selectedChain?.env}`}
                >
                    <BorderedContainer
                        containerClassName="md:w-12 md:h-12 w-8 h-8 p-[1.5px]"
                        className="w-full h-full flex justify-center items-center"
                    >
                        <div className="md:hidden block">
                            <Image
                                alt={chainInfo.name}
                                width={16}
                                height={16}
                                src={chainInfo.logo}
                            />
                        </div>
                        <div className="md:block hidden">
                            <Image
                                alt={chainInfo.name}
                                width={20}
                                height={20}
                                src={chainInfo.logo}
                            />
                        </div>
                    </BorderedContainer>
                </Tooltip>
            }
        >
            <BorderedContainer
                containerClassName="w-[220px] notification-dropdown-gradient p-[1.5px] right-4"
                className="relative p-0 scrollbar-hidden"
            >
                <div className="flex flex-col gap-4 p-4">
                    {
                        Object.entries(chainsGroupByEnv).map(([env, envChains], idx, arr) => {
                            return (
                                <div key={idx}>
                                    <div className="flex flex-col gap-4">
                                        <Text size="xl" className="font-bold">
                                            {env}
                                        </Text>
                                        {
                                            envChains.map((chain, idx) => (
                                                <a key={idx} href={chain.url} className="flex items-center gap-3 hover:opacity-60 transition-all">
                                                    <div className="w-6 h-6 flex items-center justify-center">
                                                        {
                                                            chain.url === selectedChain?.url ?
                                                                <CheckIcon width="20" height="20" />
                                                                :
                                                                <Image
                                                                    alt={chain.chainName}
                                                                    width={24}
                                                                    height={24}
                                                                    src={chain.image}
                                                                    className="shrink-0"
                                                                />
                                                        }
                                                    </div>
                                                    <Text size="lg">
                                                        {chain.chainName}
                                                    </Text>
                                                </a>
                                            ))
                                        }
                                    </div>
                                    {
                                        idx !== arr.length - 1 &&
                                        <span className='w-full h-[1px] bg-white' />
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </BorderedContainer>
        </Dropdown>
    );
};

export default ChainSelector;