"use client";

import { QuoteRequestForm } from "@/components/quote-request-form";
import type { QuoteRequestConfig } from "@/lib/quote-request-types";

export function QuoteRequestShell({
  config,
  eyebrow,
  clientCode
}: {
  config: QuoteRequestConfig;
  eyebrow?: string;
  clientCode?: string;
}) {
  return (
    <main className="page-shell">
      <section className="quote-panel" aria-labelledby="page-title">
        <header className="quote-header">
          <img className="quote-logo" src="/images/handyguy-service-logo-800.webp" alt="HandyGuy Service" width="300" height="34" />
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h1 id="page-title">Request a Quote</h1>
          </div>
        </header>

        <QuoteRequestForm config={config} clientCode={clientCode} />
      </section>
    </main>
  );
}
