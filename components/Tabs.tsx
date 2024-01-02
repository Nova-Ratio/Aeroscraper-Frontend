
import { camelCaseToTitleCase } from '@/utils/stringUtils';
import { motion } from 'framer-motion';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { ShapeIcon } from './Icons/Icons';
import SkeletonLoading from './Table/SkeletonLoading';

interface TabsProps<T> {
  tabs: T[];
  selectedTab: T;
  onTabSelected?: (tab: any) => void;
  dots?: T[];
  loading?: boolean;
}

const Tabs: FC<TabsProps<string>> = ({ tabs, selectedTab, onTabSelected, loading, dots }) => {

  if (loading) {
    return <nav>
      <ul className='flex flex-auto border border-white/10 items-center rounded-lg'>
        {tabs.map((tab) => {
          return <li
            key={tab}
            className={`m-0.5 text-base font-medium text-white relative cursor-pointer rounded-md hover:text-red-500 duration-700 flex-1 whitespace-nowrap text-center`}
          >
            <SkeletonLoading height={'h-12'} noPadding noMargin />
          </li>
        })}
      </ul>
    </nav>
  }

  return (
    <nav>
      <ul className='grid grid-cols-6 gap-2 py-4 left-0 bottom-0 fixed shadow shadow-white/10 w-full bg-chinese-black md:hidden z-[999]'>
        {tabs.map((tab) => (
          <motion.li
            key={tab}
            onClick={() => onTabSelected && onTabSelected(tab)}
            className={`m-1 text-[8px] font-medium text-white relative cursor-pointer rounded-md hover:text-red-500 duration-700 flex-1 whitespace-nowrap text-center`}
          >
            {camelCaseToTitleCase(tab)}
            {dots?.includes(tab) && <div className='h-2 w-2 absolute bg-red-500 right-3 -top-2.5 md:top-2 animate-pulse rounded-full' />}
            {tab === selectedTab && <ShapeIcon className='w-12 h-12 absolute -bottom-12' />}
          </motion.li>
        ))}
      </ul>
      <ul className='flex-auto gap-2 border border-white/10 rounded-lg md:flex hidden'>
        {tabs.map((tab) => (
          <motion.li
            key={tab}
            onClick={() => onTabSelected && onTabSelected(tab)}
            className={`px-6 py-3 m-1 text-base font-medium text-white relative cursor-pointer rounded-md hover:text-red-500 duration-700 flex-1 whitespace-nowrap text-center`}
          >
            {camelCaseToTitleCase(tab)}
            {dots?.includes(tab) && <div className='h-2 w-2 absolute bg-red-500 right-3 top-2 animate-pulse rounded-full' />}
            {tab === selectedTab && <motion.div layoutId={"gliding"} className="absolute bottom-0 h-[48px] border rounded-md border-red-500 left-0 right-0" />}
          </motion.li>
        ))}
      </ul>
    </nav>
  );
};

export default Tabs;
