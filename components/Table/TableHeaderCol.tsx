import { FunctionComponent } from "react";

interface TableHeaderCol {
  col: number,
  text?: string,
  textCenter?: boolean,
}

export const TableHeaderCol: FunctionComponent<TableHeaderCol> = (props: TableHeaderCol) => {
  return (
    <div className={`col-span-${props.col} p-4 py-[13px] w-full ${props.textCenter ? "text-center" : ""}`}>
      <span className={`${props.textCenter ? "text-center" : ""} text-dark-silver text-base lg:text-lg font-medium`}>
        {props.text}
      </span>
    </div>
  )
}
