import React, { FC } from 'react'
import Text from '@/components/Texts/Text';
import { InfoIcon } from '@/components/Icons/Icons';
import Tooltip from '@/components/Tooltip/Tooltip';

type Props = {
    title?: string;
    description?: string;
    tooltip?: string;
    className?: string;
}

const StatisticCard: FC<Props> = ({ title, description, tooltip, className }) => {
    return (
        <div className={`${className} relative flex flex-col p-2 bg-english-violet rounded-lg`}>
            <Text size="base">{title}</Text>
            <Text size="base">{description}</Text>
            <div className='absolute right-1 top-1'>
                <Tooltip title={<Text size='base'>{tooltip}</Text>} width='w-[191px]'>
                    <InfoIcon className='text-white'/>
                </Tooltip>
            </div>
        </div>
    )
}

export default StatisticCard