import React, { FC } from 'react'
import Text from '@/components/Texts/Text';
import { camelCaseToTitleCase } from '@/utils/stringUtils';
import { motion } from 'framer-motion';

interface Reward {
  type: string;
  value: number;
}

interface Condition {
  type: string;
  value: string;
  operator: string;
}

interface DescriptionContent {
  type: string;
  attrs?: {
    level: number;
    indent: number;
  };
  content: {
    text: string;
    type: string;
  }[];
}

interface Description {
  type: string;
  content: any;
}

export interface ZealyMission {
  name: string;
  content: any[];
  recurrence: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  reward: Reward[];
  position: number;
  published: boolean;
  communityId: string;
  submissionType: string;
  condition: Condition[];
  validationData: {
    enabled: boolean;
  };
  autoValidate: boolean;
  id: string;
  categoryId: string;
  conditionOperator: string;
  claimCounter: number;
  retryAfter: number;
  description: Description;
  tasks: any[];
  v2: boolean;
  claimLimit: number;
  archived: boolean;
  currentXP?: number;
}

const MissionCard: FC<{ mission: ZealyMission }> = ({ mission }) => {
  return (
    <div className={`
    "w-full border ${mission.reward[0].value == (mission.currentXP ?? 0) ? "border-green-500/50 bg-green-800/10" : "border-white/10 bg-cetacean-dark-blue"} rounded-2xl px-4 pt-4 pb-4 items-end justify-between mt-6"
    `}>
      <div className='w-full flex justify-between gap-6 items-center'>
        <Text size="base" weight="font-bold">{mission.name}</Text>
        <div
          className={`px-8 py-2 m-1 text-base font-medium text-white relative cursor-pointer rounded-md hover:text-red-500 duration-700 whitespace-nowrap text-center`}
        >
          <p>{camelCaseToTitleCase(mission.recurrence)}</p>
          <div className="absolute bottom-0 h-[40px] border-2 rounded-md border-red-500 left-0 right-0" />
        </div>
      </div>
      <div className='mt-2'>
        <Text size="base" weight="font-regular" textColor='text-gray-400' className='line-clamp-2'>{mission.description.content.find((i: any) => i.type === "paragraph").content.find((item: any) => item.type === "text").text}</Text>
      </div>
      <div className='flex mt-4'>
        <div>
          <Text size="sm" weight="font-regular" textColor='text-gray-400' className='mb-1'>Points</Text>
          <Text size="xl" textColor='text-gradient' weight='font-semibold'>
            {mission.reward[0].value}
            &nbsp;{mission.reward[0].type}
          </Text>
        </div>
        <div className='ml-6 flex-1'>
          <Text size="sm" weight="font-regular" textColor='text-gray-400' className='mb-1'>Progress</Text>
          <div className='flex gap-2 items-center'>
            <div className='border border-white/10 w-full h-7 rounded-md relative' >
              <motion.div
              layout
                style={{ width: `${((mission.currentXP ?? 0) / mission.reward[0].value) * 100}%` }}
                className='tertiary-gradient w-full h-7 rounded-md absolute left-0 top-0' />
            </div>

            <Text size="lg" weight="font-regular" className='min-w-[40px]'>{mission.currentXP}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionCard;