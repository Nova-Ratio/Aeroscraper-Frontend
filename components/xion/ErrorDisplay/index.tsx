import { useContext } from "react";
import {
  AbstraxionContext,
  AbstraxionContextProps,
} from "../AbstraxionContext";
import { Button } from "@burnt-labs/ui";

export const ErrorDisplay = ({
  message,
  onClose,
}: {
  message?: string;
  onClose: VoidFunction;
}) => {
  const { setAbstraxionError } = useContext(
    AbstraxionContext,
  ) as AbstraxionContextProps;

  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
        Uh oh.
      </h1>
      <h2 className="tracking-tight text-white">
        Something went wrong.
      </h2>
      {message && (
        <p className="tracking-tight text-zinc-400 ">
          {message}
        </p>
      )}
      <Button
        structure="outlined"
        fullWidth={true}
        onClick={() => {
          onClose();
          setAbstraxionError("");
        }}
      >
        Dismiss
      </Button>
    </div>
  );
};
