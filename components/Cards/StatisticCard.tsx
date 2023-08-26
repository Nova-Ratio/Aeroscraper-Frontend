import React, { FC } from 'react'
import Text from '@/components/Texts/Text';
import { InfoIcon } from '@/components/Icons/Icons';
import Tooltip, { PLACEMENT_CLASSES } from '@/components/Tooltip/Tooltip';
import { isEmpty } from 'lodash';

type Props = {
    title?: string;
    description?: string;
    descriptionColor?: string;
    tooltip?: string;
    tooltipPlacement?: keyof typeof PLACEMENT_CLASSES
    className?: string;
}

const StatisticCard: FC<Props> = ({ title, description, descriptionColor, tooltip, className, tooltipPlacement }) => {
    return (
        <div className={`${className} relative flex flex-col p-2 bg-english-violet rounded-lg`}>
            <Text size="base">{title}</Text>
            <Text size="base" textColor={descriptionColor}>{description}</Text>
            <div className='absolute right-1 top-1'>
                <Tooltip placement={tooltipPlacement} active={!isEmpty(tooltip)} title={<Text size='base'>{tooltip}</Text>} width='w-[191px]'>
                    <InfoIcon className='text-white w-4 h-4' />
                </Tooltip>
            </div>
        </div>
    )
}

export default StatisticCard