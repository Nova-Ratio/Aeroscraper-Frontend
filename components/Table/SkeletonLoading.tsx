import React, { FC } from 'react';

type Props = {
  height: string,
  width?: string,
  color?: "bg-zaffre" | "bg-indigo",
  noPadding?: boolean,
  noMargin?:boolean,
}
const SkeletonLoading: FC<Props> = ({ height, width = "w-full", color = "bg-dark-silver", noPadding,noMargin }) => {
  return (
    <div className={`${noPadding ? "" : "p-4"} rounded-md animate-pulse`}>
      <div className={`${color} ${noMargin ? "mb-0":"mb-2"} rounded w-full ${height} ${width}`}></div>
    </div>
  );
};

export default SkeletonLoading;