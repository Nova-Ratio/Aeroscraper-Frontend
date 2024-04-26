import Link from "next/link";
import { MedalIcon } from "../Icons/Icons";
import Text from "../Texts/Text";
import Image from "next/image";
const data = [
  {
    title: "Audit is complete!",
    description:
      "Aeroscraper has been officially audited, and all errors have been corrected.",
    link: "https://beosin.com/audits/Aeroscraper_202402020919.pdf",
    link_desc: "https://beosin.com/audits/Aeroscraper_202402020919.pdf",
    img: "/images/audit.png",
  },
  {
    title: "Audit is complete!",
    description:
      "IronNode's security team conducted an extensive review of the Aeroscraper protocol.",
    link: "/documents/aeroscraper_iron-node_security_audit_report_v1.pdf",
    link_desc: "Aeroscraper_IronNode_Security_Audit_Report_v1.pdf",
    img: "/images/audit2.png",
  }
  
];

export default function Audit() {
  return (
    <div className="hidden md:block">
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">Audits</h2>
      <div className="gap-6 mt-10 md:grid grid-cols-3 w-full hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className=" w-full gradientBorderBlue  flex flex-col gap-6 p-4 md:p-6 items-center bg-white h-fit text-white text-center"
          >
            <div className="flex items-center gap-6">
              <Image
                src={item.img}
                width={64}
                height={64}
                alt="audit"
              />
              <h3 className="tertiary-gradient-text auditCard-text md:text-2xl text-base">
                {item.title}
              </h3>
            </div>
            <p className="text-xs md:text-base">{item.description}</p>
            <Link
              className=" text-[#5C5CFF] underline text-xs"
              href={item.link}
              target="_blank"
            >
              {item.link_desc}
            </Link>
          </div>
        ))}  
        
      </div>
    </div>
  );
}
