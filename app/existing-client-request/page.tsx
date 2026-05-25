import { QuoteRequestShell } from "@/components/quote-request-shell";
import { quoteRequestForms } from "@/lib/quote-request-types";

export default async function ExistingClientRequestPage({
  searchParams
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client } = await searchParams;

  return <QuoteRequestShell config={quoteRequestForms.existing_client} clientCode={client?.trim()} />;
}
