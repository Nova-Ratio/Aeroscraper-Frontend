import Link from "next/link";
import Text from "../Texts/Text";

export default function Partners() {
  return (
    <div>
      <h2 className="text-4xl font-semibold text-white mb-4 mt-14">
        Our Partners
      </h2>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Chains
      </Text>
      <div className="flex gap-4">
        <Link
          className="flex gap-6"
          href={"https://injective.com/"}
          target="_blank"
        >
          <img
            alt={"injective"}
            src={"/images/token-images/injective.svg"}
            className="px-4 w-[148px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link
          className="flex gap-6"
          href={"https://www.sei.io/"}
          target="_blank"
        >
          <img
            alt={"sei"}
            src={"/images/token-images/sei.svg"}
            className="px-4 w-[148px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
        <Link
          className="flex gap-6"
          href={"https://xion.bonusblock.io/"}
          target="_blank"
        >
          <img
            alt={"sei"}
            src={"/images/token-images/xion.svg"}
            className="px-4 w-[120px] h-[70px] mt-4 border border-white/10 rounded-md"
          />
        </Link>
      </div>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Security
      </Text>
      <Link className="flex gap-6" href={"https://beosin.com/"}>
        <img
          alt={"beosin security"}
          src={"/images/beosin.svg"}
          className="px-4 w-[148px] h-[60px] mt-4 border border-white/10 rounded-md"
        />
      </Link>
      <Text size="base" className="mt-8" textColor="text-white/60">
        Oracle
      </Text>
      <Link className="flex gap-6" href={"https://pyth.network/"}>
        <img
          alt={"pyth"}
          src={"/images/pyth2.svg"}
          className="px-8 w-[148px] h-[60px] mt-4 border border-white/10 rounded-md"
        />
      </Link>
    </div>
  );
}
