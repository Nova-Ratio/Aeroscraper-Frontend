import { FC, ReactElement } from "react";

interface TableProps {
  listData: any[],
  header?: ReactElement,
  renderItem: (e: any, i: number) => ReactElement,
  className?: string,
  bodyCss?: string
}

interface refProps {
  reload: () => void
}

export const Table: FC<TableProps> = (props: TableProps) => {
  return (
    <div className="w-full">
      <div className="block">
        {props.header}
      </div>
      <div className={props.bodyCss ?? "space-y-1"}>
        {props.listData.map((e: any, i: number, idx: any) => {
          return <div key={i}>
            {props.renderItem(e, i)}
          </div>
        })}
      </div>
    </div>
  );
}
