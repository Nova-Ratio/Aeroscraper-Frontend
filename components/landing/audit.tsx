import Link from "next/link";
import { MedalIcon } from "../Icons/Icons";
import Text from "../Texts/Text";
import Image from "next/image";

export default function Audit() {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">Audits</h2>
      <div className="gap-6 mt-10 md:grid grid-cols-3 w-full hidden">
        <div className=" w-full gradientBorderBlue  flex flex-col gap-6 p-4 md:p-6 items-center bg-white h-fit text-white text-center">
          <div className="flex items-center gap-6">
            <Image
              src={"/images/audit.png"}
              width={64}
              height={64}
              alt="audit"
            />
            <h3 className="tertiary-gradient-text auditCard-text md:text-2xl text-base">
              Audit is complete!
            </h3>
          </div>
          <p className="text-xs md:text-base">
            Aeroscraper has been officially audited, <br /> and all errors have
            been corrected.
          </p>
          <Link
            className=" text-[#5C5CFF] underline text-xs"
            href={"https://beosin.com/audits/Aeroscraper_202402020919.pdf"}
            target="_blank"
          >
            https://beosin.com/audits/Aeroscraper_202402020919.pdf
          </Link>
        </div>
      </div>
    </div>
  );
}
