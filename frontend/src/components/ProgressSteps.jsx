const steps = [
  { key: "cart", label: "Cart" },
  { key: "information", label: "Information" },
  { key: "review", label: "Review & Pay" },
];

const ProgressSteps = ({ step1, step2, step3 }) => {
  const activeIndex = step3 ? 2 : step2 ? 1 : step1 ? 0 : -1;

  return (
    <nav className="flex items-center justify-center gap-0 text-[12px] tracking-[0.06em] select-none">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        return (
          <span key={s.key} className="flex items-center">
            {i > 0 && (
              <svg
                className="mx-2 text-[#BDBDBD]"
                width="7"
                height="12"
                viewBox="0 0 7 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M1 1l5 5-5 5" />
              </svg>
            )}
            <span
              className={`transition-colors duration-200 ${
                active
                  ? "text-[#212A2C] font-semibold"
                  : done
                  ? "text-[#212A2C]"
                  : "text-[#BDBDBD]"
              }`}
            >
              {s.label}
            </span>
          </span>
        );
      })}
    </nav>
  );
};

export default ProgressSteps;
