const ProofMetrics = () => {
  return (
    <section className="w-full py-10 sm:py-24 select-none">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <span className="text-3xl sm:text-5xl font-semibold tracking-[-1px] text-[#171717] dark:text-white font-sans">
              14ms
            </span>
            <span className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Measured IndexedDB read
            </span>
            <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              Direct on-device storage access. Reads occur in-memory without remote API wait or network overhead.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-3xl sm:text-5xl font-semibold tracking-[-1px] text-[#171717] dark:text-white font-sans">
              100%
            </span>
            <span className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Local-first architecture
            </span>
            <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              Every keystroke writes directly to local storage first. Internet connection is purely optional.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-3xl sm:text-5xl font-semibold tracking-[-1px] text-[#171717] dark:text-white font-sans">
              0
            </span>
            <span className="text-sm font-medium text-[#171717] dark:text-[#ededed]">
              Proprietary database walls
            </span>
            <p className="text-xs sm:text-sm text-[#60646c] dark:text-[#a0a4ab] leading-relaxed">
              Formatted in standard GitHub Flavored Markdown. Ready to open in any editor forever.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofMetrics;
