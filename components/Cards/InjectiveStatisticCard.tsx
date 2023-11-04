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
    <div className={`${className} flex flex-col gap-1`}>
      <div className="flex gap-1">
        <Text size="sm" textColor="text-isabelline">{title}</Text>
        <Tooltip placement={tooltipPlacement} active={!isEmpty(tooltip)} containerClassName="-mt-0.5" title={<Text size='base'>{tooltip}</Text>} width='w-[191px]'>
          <InfoIcon className='text-white w-4 h-4' />
        </Tooltip>
      </div>
      <Text size="sm" dynamicTextColor={descriptionColor}>{description}</Text>
    </div>
  )
}

export default StatisticCard