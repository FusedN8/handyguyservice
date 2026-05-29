"use client";

import { FormEvent, useRef, useState } from "react";
import type { QuoteRequestConfig } from "@/lib/quote-request-types";

type SubmitState = "idle" | "loading" | "success" | "error";

const successMessage = "Thanks. Your request has been received and will be reviewed shortly.";
const fallbackMessage = "The upload service is temporarily unavailable. Please send the description and pictures by email instead.";
const formSubmitEndpoint = "https://formsubmit.co/ajax/handyguyserviceinfo@gmail.com";
const maxUploadBytes = 10 * 1024 * 1024;

export function QuoteRequestForm({ config, clientCode = "" }: { config: QuoteRequestConfig; clientCode?: string }) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [fileSummary, setFileSummary] = useState("No pictures selected");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("loading");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    formData.set("mode", config.mode);
    if (config.mode === "existing_client" && clientCode) {
      formData.set("client", clientCode);
    }
    formData.set("_subject", config.mode === "new_client" ? "New quote request - HandyGuy Service" : "Existing client request - HandyGuy Service");
    formData.set("_template", "table");
    formData.set("_captcha", "false");

    const files = formData.getAll("attachment").filter((item) => item instanceof File);
    const totalUploadBytes = files.reduce((total, file) => total + file.size, 0);

    if (totalUploadBytes > maxUploadBytes) {
      setSubmitState("error");
      setMessage("Please upload pictures totaling less than 10 MB.");
      return;
    }

    try {
      const response = await fetch(formSubmitEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message ?? "Unable to submit request.");
      }

      setSubmitState("success");
      setMessage(payload.message ?? successMessage);
      formRef.current?.reset();
      setFileSummary("No pictures selected");
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : fallbackMessage);
    }
  }

  return (
    <form ref={formRef} className="quote-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="hidden" name="mode" value={config.mode} />

      <label className="field-group" htmlFor={`${config.mode}-description`}>
        <span>Tell Us About Your Project</span>
        <textarea
          id={`${config.mode}-description`}
          name="description"
          placeholder="Briefly describe what you need done."
          rows={7}
          required
        />
      </label>

      <label className="upload-box" htmlFor={`${config.mode}-photos`}>
        <input
          id={`${config.mode}-photos`}
          name="attachment"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            const count = event.currentTarget.files?.length ?? 0;
            setFileSummary(count === 0 ? "No pictures selected" : `${count} picture${count === 1 ? "" : "s"} selected`);
          }}
        />
        <span className="upload-title">Upload Photos (Recommended for Faster Quotes)</span>
        <span className="upload-helper">The more details and photos you provide, the more accurate your quote will be.</span>
        <span className="upload-meta">{fileSummary}</span>
      </label>

      {config.showContactFields ? (
        <div className="contact-grid">
          <label className="field-group" htmlFor="name">
            <span>Name</span>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </label>

          <label className="field-group" htmlFor="phone">
            <span>Phone number</span>
            <input id="phone" name="phone" type="tel" autoComplete="tel" required />
          </label>

          <label className="field-group zip-field" htmlFor="zipCode">
            <span>ZIP code</span>
            <input id="zipCode" name="zipCode" type="text" inputMode="numeric" autoComplete="postal-code" required />
          </label>
        </div>
      ) : null}

      <button className="submit-button" type="submit" disabled={submitState === "loading"}>
        {submitState === "loading" ? <span className="loading-dot" aria-hidden="true" /> : null}
        <span>{submitState === "loading" ? "Submitting" : "Submit Request"}</span>
      </button>

      <div className={`form-message ${submitState}`} role="status" aria-live="polite">
        {message}
      </div>
    </form>
  );
}
