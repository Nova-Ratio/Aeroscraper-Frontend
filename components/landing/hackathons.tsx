import Link from "next/link";
import { MedalIcon } from "../Icons/Icons";
import Text from "../Texts/Text";

export default function Hackathons() {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">
        Hackathons
      </h2>
      <div className="gap-6 mt-10 md:grid grid-cols-3 w-full hidden">
        <Link
          target={"_blank"}
          className="border w-full gradientBorderBlue p-4 md:p-6 rounded-lg flex flex-col items-center gap-6 backdrop-blur-2xl"
          href={
            "https://twitter.com/Injective_/status/1745933949132488934?s=20"
          }
        >
          <div className="flex gap-4 items-center">
            <MedalIcon className="text-[#F8B810]" />
            <Text size="3xl">1st</Text>
          </div>
          <div className="flex gap-4 w-full justify-center">
            <div className="flex items-center gap-2">
              <img
                alt="token"
                src="/images/token-images/inj.svg"
                className="w-6 h-6"
              />
              <Text size="base" weight="font-medium">
                Injective
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <img
                alt="token"
                src="/images/google_cloud.png"
                className="w-6 h-6"
              />
              <Text size="base" weight="font-medium">
                Google Cloud
              </Text>
            </div>
          </div>
          <Text size="lg" className="">
            Injective Illuminate Hackathon
          </Text>
        </Link>
        <Link
          target={"_blank"}
          className="border w-full gradientBorderBlue p-4 md:p-6 rounded-lg flex flex-col items-center gap-6 backdrop-blur-2xl mr-auto"
          href={"https://x.com/SeiNetwork/status/1705128171534717322?s=20"}
        >
          <div className="flex gap-4 items-center">
            <MedalIcon className="text-[#E4462D]" />
            <Text size="xl">2nd</Text>
          </div>
          <div className="flex gap-4 w-full justify-center">
            <div className="flex items-center gap-2">
              <img
                alt="token"
                src="/images/token-images/sei.png"
                className="w-6 h-6"
              />
              <Text size="base" weight="font-medium">
                SEI
              </Text>
            </div>
          </div>
          <Text size="lg" className="">
            Code Sei Hackathon
          </Text>
        </Link>
      </div>
    </div>
  );
}
