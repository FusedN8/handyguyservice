import { NextResponse } from "next/server";
import type { QuoteRequestMode } from "@/lib/quote-request-types";

const validModes = new Set<QuoteRequestMode>(["new_client", "existing_client"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = formData.get("mode");
  const description = String(formData.get("description") ?? "").trim();

  if (!validModes.has(mode as QuoteRequestMode)) {
    return NextResponse.json({ message: "Invalid request type." }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json({ message: "Project description is required." }, { status: 400 });
  }

  if (mode === "new_client") {
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const zipCode = String(formData.get("zipCode") ?? "").trim();

    if (!name || !phone || !zipCode) {
      return NextResponse.json({ message: "Name, phone number, and ZIP code are required." }, { status: 400 });
    }
  }

  const files = formData.getAll("attachment").filter((item) => item instanceof File);

  const requestRecord = {
    id: crypto.randomUUID(),
    mode,
    description,
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    zipCode: String(formData.get("zipCode") ?? "").trim(),
    client: String(formData.get("client") ?? "").trim(),
    photoCount: files.length,
    submittedAt: new Date().toISOString(),
    aiReviewStatus: "queued",
    adminStatus: "new"
  };

  // Future integration point: persist requestRecord, upload files, queue AI triage,
  // then surface the request in an admin dashboard.
  return NextResponse.json({
    message: "Thanks. Your request has been received and will be reviewed shortly.",
    request: requestRecord
  });
}
