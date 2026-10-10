import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { faqs } from "../content";

function FaqItem({ item, index, isOpen, onToggle, baseId }) {
  const panelId = `${baseId}-panel-${index}`;
  const buttonId = `${baseId}-button-${index}`;

  return (
    <div
      className={`rounded-2xl border transition duration-300 ${
        isOpen ? "border-gold/40 bg-panel shadow-[0_12px_40px_rgba(0,0,0,0.25)]" : "border-white/10 bg-ink-soft hover:border-gold/25"
      }`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-4 text-start sm:px-6 sm:py-5"
        >
          <span className="flex-1 text-base font-extrabold leading-snug text-cream sm:text-lg">
            {item.question}
          </span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-gold transition duration-300 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-relaxed text-cream/75 sm:px-6 sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-ink py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold text-gold">שאלות נפוצות</p>
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
