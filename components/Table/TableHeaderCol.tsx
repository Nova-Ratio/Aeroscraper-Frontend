import { FunctionComponent } from "react";

interface TableHeaderCol {
  col: number,
  text?: string,
  textCenter?: boolean,
  textEnd?: boolean,
}

const mockSpan = ["col-span-3"]
export const TableHeaderCol: FunctionComponent<TableHeaderCol> = (props: TableHeaderCol) => {
  return (
    <div className={`col-span-${props.col} p-4 py-[13px] w-full ${props.textCenter ? "text-center" : ""}  ${props.textEnd ? "text-end" : ""}`}>
      <span className={`${props.textCenter ? "text-center" : ""} text-dark-silver text-base lg:text-lg font-medium`}>
        {props.text}
      </span>
    </div>
  )
}
