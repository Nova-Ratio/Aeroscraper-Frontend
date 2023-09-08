import React, { FC, useEffect, useMemo, useState } from 'react'
import { PageData } from '../_types/types';
import Dropdown from '@/components/Dropdown/Dropdown';
import BorderedContainer from '@/components/Containers/BorderedContainer';
import Text from '@/components/Texts/Text';
import { RedDotIcon } from '@/components/Icons/Icons';
import { INotification, useNotification } from '@/contexts/NotificationProvider';
import Link from 'next/link';

type Props = {
    pageData: PageData;
}

type ItemProps = {
    text: string;
    hasDivider?: boolean;
    isRead?: boolean;
    directLink?: string;
}

const NotificationItem: FC<ItemProps> = ({ text, isRead, directLink, hasDivider = true }) => {
    if (directLink) {
        return <Link className={`border-0 border-dark-silver border-opacity-40 ${hasDivider ? "border-b" : "border-b-0"} pb-2 flex`} href={`https://sei.explorers.guru/transaction/${directLink}`}>
            <Text size='base'>{text}</Text>
            {isRead === false && <RedDotIcon className=' ml-auto' />}
        </Link>
    }

    return (
        <div className={`border-0 border-dark-silver border-opacity-40 ${hasDivider ? "border-b" : "border-b-0"} pb-2 flex`}>
            <Text size='base'>{text}</Text>
            {isRead === false && <RedDotIcon className=' ml-auto' />}
        </div>
    )
}

const NotificationDropdown: FC<Props> = ({ pageData }) => {
    const isTroveOpened = useMemo(() => pageData.collateralAmount > 0, [pageData]);
    const listenNotification = useNotification();
    const [notifications, setNotifications] = useState<INotification[]>([]);

    useEffect(() => {
        let parsedNotifications: INotification[];

        try {
            parsedNotifications = JSON.parse(localStorage.getItem("notifications") ?? "");
            setNotifications(parsedNotifications);
        } catch (error) { }
    }, [listenNotification.notification]);

    const allReadNotifications = () => {
        try {
            localStorage.setItem("notifications", JSON.stringify(notifications.map(item => {
                return { ...item, isRead: true };
            })));
        } catch (error) { }
    }

    return (
        <Dropdown
            onOpen={allReadNotifications}
            toggleButton={
                <BorderedContainer
                    containerClassName='w-8 h-8 active:scale-95 transition-all'
                    className='w-full h-full flex justify-center items-center'
                >
                    <img alt="bell" src="/images/bell.svg" />
                    {notifications.some(i => !i.isRead) && <RedDotIcon className='absolute -top-1.5 -right-2' />}
                </BorderedContainer>
            }
        >
            <BorderedContainer containerClassName='w-[406px] h-[226px]' className='relative flex flex-col gap-2 p-4 overflow-auto scrollbar-hidden backdrop-blur-[25px]'>
                <div className='absolute inset-10 top-20 bg-white -z-10 blur-3xl opacity-[0.15]' />
                <Text>Notifications</Text>
                {notifications.map((item, index) => {
                    return <NotificationItem key={index} text={item.message ?? ""} isRead={item.isRead} />
                })}
                <NotificationItem text={`Your trove is ${isTroveOpened ? "open" : "close"}.`} />
                <NotificationItem text={`You have ${Number(pageData.rewardAmount > 0) > 0 ? pageData.rewardAmount > 0 : "no"} reward in the Stability Pool.`} hasDivider={false} />
            </BorderedContainer>
        </Dropdown>
    )
}

export default NotificationDropdown