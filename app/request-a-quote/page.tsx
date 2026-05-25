import { QuoteRequestShell } from "@/components/quote-request-shell";
import { quoteRequestForms } from "@/lib/quote-request-types";

export default function RequestAQuotePage() {
  return <QuoteRequestShell config={quoteRequestForms.new_client} />;
}
