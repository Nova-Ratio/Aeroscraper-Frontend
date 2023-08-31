import React, { FC, useMemo } from 'react'
import { PageData } from '../_types/types';
import Dropdown from '@/components/Dropdown/Dropdown';
import BorderedContainer from '@/components/Containers/BorderedContainer';
import Text from '@/components/Texts/Text';

type Props = {
    pageData: PageData;
}

type ItemProps = {
    text: string;
    hasDivider?: boolean;
}

const NotificationItem: FC<ItemProps> = ({ text, hasDivider = true }) => {
    return (
        <div className={`border-0 border-dark-silver border-opacity-40 ${hasDivider ? "border-b" : "border-b-0"} pb-2`}>
            <Text size='base'>{text}</Text>
        </div>
    )
}

const NotificationDropdown: FC<Props> = ({ pageData }) => {
    const isTroveOpened = useMemo(() => pageData.collateralAmount > 0, [pageData]);

    return (
        <Dropdown
            toggleButton={
                <BorderedContainer
                    containerClassName='w-8 h-8 active:scale-95 transition-all'
                    className='w-full h-full flex justify-center items-center'
                >
                    <img alt="bell" src="/images/bell.svg" />
                </BorderedContainer>
            }
        >
            <BorderedContainer containerClassName='w-[406px] h-[226px]' className='flex flex-col gap-2 p-4 overflow-auto scrollbar-hidden'>
                <Text>Notifications</Text>
                <NotificationItem text={`Your trove is ${isTroveOpened ? "open" : "close"}.`} />
                <NotificationItem text={`You have ${Number(pageData.rewardAmount > 0) > 0 ? pageData.rewardAmount > 0 : "no"} reward in the Stability Pool.`} hasDivider={false} />
            </BorderedContainer>
        </Dropdown>
    )
}

export default NotificationDropdown