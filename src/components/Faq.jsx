import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { faqs } from "../content";

function FaqItem({ item, index, isOpen, onToggle, baseId }) {
  const panelId = `${baseId}-panel-${index}`;
  const buttonId = `${baseId}-button-${index}`;

  return (
    <div
      className={`glass-card overflow-hidden transition duration-300 ${
        isOpen ? "border-gold/40 shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_0_1px_rgba(245,197,24,0.12)]" : "hover:border-gold/25"
      }`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-4 text-start transition hover:bg-white/[0.02] sm:px-6 sm:py-5"
        >
          <span className="flex-1 text-base font-extrabold leading-snug text-cream sm:text-lg">
            {item.question}
          </span>
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              isOpen ? "border-gold/50 bg-gold/15" : "border-white/15 bg-white/5"
            }`}
          >
            <ChevronDown
              className={`h-4 w-4 text-gold transition duration-300 ${isOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-cream/78 sm:px-6 sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative overflow-hidden bg-ink py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold/35 to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="section-kicker">שאלות נפוצות</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">
            כל מה שרציתם לדעת
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-cream/70">
            תשובות קצרות וברורות לפני שמזמינים נסיעה.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => (
            <FaqItem
              key={item.question}
              item={item}
              index={index}
              baseId={baseId}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
