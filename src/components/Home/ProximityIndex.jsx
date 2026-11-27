import { HOME_SITE } from "../../data/homeContent";

const ProximityIndex = () => {
  return (
    <section className="w-full py-16 sm:py-24 lg:py-32">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-6">
            <h2
              data-split="lines"
              className="t-display-l text-[#141416] dark:text-[#f4f4f2] max-w-[20ch]"
            >
              Nearest to your hands. Zero distance between thought and disk.
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {HOME_SITE.specs.map((item, idx) => (
            <div
              key={item.label}
              data-reveal="up"
              data-delay={String(idx * 0.06)}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline py-7 sm:py-9 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-2xl transition-colors duration-300 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            >
              <div className="md:col-span-3">
                <span className="t-display-xl tabular-nums text-[#141416] dark:text-[#f4f4f2] block">
                  {item.metric}
                </span>
              </div>

              <div className="md:col-span-4">
                <span className="text-base sm:text-lg font-medium text-[#141416] dark:text-[#f4f4f2]">
                  {item.label}
                </span>
              </div>

              <div className="md:col-span-5">
                <p className="text-sm sm:text-base text-[#565961] dark:text-[#a1a4ab] leading-relaxed max-w-[44ch]">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProximityIndex;
