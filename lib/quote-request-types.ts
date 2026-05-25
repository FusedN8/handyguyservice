export type QuoteRequestMode = "new_client" | "existing_client";

export type QuoteRequestConfig = {
  mode: QuoteRequestMode;
  label: string;
  showContactFields: boolean;
};

export const quoteRequestForms: Record<QuoteRequestMode, QuoteRequestConfig> = {
  new_client: {
    mode: "new_client",
    label: "New client",
    showContactFields: true
  },
  existing_client: {
    mode: "existing_client",
    label: "Existing client",
    showContactFields: false
  }
};
