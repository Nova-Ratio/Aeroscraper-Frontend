// Import necessary components
import { Suspense, useEffect, useState } from "react";
import FaqItem from "./FaqItem";
import Loading from "../Loading/Loading";
import { faqData } from "@/data/faqData";
import { useSearchParams } from "next/navigation";

const Faq = () => {
  // Use state to manage scroll behavior (avoids potential client-side rendering issues)
  const [shouldScrollToFaq, setShouldScrollToFaq] = useState(false);

  // Get search parameters using useSearchParams
  const searchParams = useSearchParams();

  // Handle scroll behavior on mount and search parameter change
  useEffect(() => {
    const scroll = searchParams.get("scroll");

    if (scroll && scroll === "FAQ") {
      setShouldScrollToFaq(true);
    }
  }, [searchParams]);

  // Perform scroll logic in a separate effect to avoid client-side rendering issues
  useEffect(() => {
    if (shouldScrollToFaq) {
      const faqElement = document.getElementById("faq-section");

      if (faqElement) {
        faqElement.scrollIntoView({ behavior: "smooth", inline: "center" });
        setShouldScrollToFaq(false); // Reset scroll state after execution
      }
    }
  }, [shouldScrollToFaq]);

  return (
    <Suspense fallback={<Loading />}>
      <div id="faq-section" className="w-full mt-12">
        <h2 className="text-4xl font-semibold text-white mb-4">FAQ</h2>
        <div className="divide divide-white/10">
          {faqData.map((item, index) => (
            <FaqItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </Suspense>
  );
};

export default Faq;
