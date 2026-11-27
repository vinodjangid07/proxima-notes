import { Link } from "react-router-dom";
import { HOME_SITE } from "../../data/homeContent";

const FinalCTA = () => {
  return (
    <section className="w-full py-24 sm:py-36 lg:py-44">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h2
              data-split="lines"
              className="t-display-hero text-[#141416] dark:text-[#f4f4f2] max-w-[14ch]"
            >
              {HOME_SITE.finalCta.heading}
            </h2>
          </div>

          <div
            data-reveal="up"
            className="lg:col-span-4 flex flex-col items-start gap-6"
          >
            <p className="text-base sm:text-[17px] text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[36ch]">
              {HOME_SITE.finalCta.body}
            </p>

            <Link
              to="/notes"
              data-fill
              data-magnetic="0.18"
              className="flood-btn flood-btn--solid group h-11 px-6 inline-flex items-center gap-2.5 rounded-lg text-sm font-medium"
            >
              <span className="flood-btn__fill" aria-hidden="true" />
              <span>{HOME_SITE.finalCta.cta}</span>
              <span className="arrow-nudge" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
