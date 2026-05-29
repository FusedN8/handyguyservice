(function () {
  const endpoint = "https://formsubmit.co/ajax/handyguyserviceinfo@gmail.com";
  const maxUploadBytes = 10 * 1024 * 1024;
  const successMessage = "Thanks. Your request has been received and will be reviewed shortly.";
  const fallbackMessage = "The upload service is temporarily unavailable. Please send the description and pictures by email instead.";
  const params = new URLSearchParams(window.location.search);
  const clientCode = params.get("client") || "";
  const displayName = (params.get("name") || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  document.querySelectorAll("[data-client-greeting]").forEach((greeting) => {
    greeting.textContent = displayName ? `Hello ${displayName}` : "Hello";
    greeting.hidden = false;
  });

  document.querySelectorAll("[data-tally-client-src]").forEach((iframe) => {
    const src = new URL(iframe.getAttribute("data-tally-client-src"));
    if (clientCode) {
      src.searchParams.set("client", clientCode);
    }
    iframe.setAttribute("data-tally-src", src.toString());
  });

  document.querySelectorAll("[data-quote-form]").forEach((form) => {
    const fileInput = form.querySelector("[data-file-input]");
    const fileSummary = form.querySelector("[data-file-summary]");
    const message = form.querySelector("[data-form-message]");
    const submitText = form.querySelector("[data-submit-text]");
    const clientField = form.querySelector("[data-client-code]");

    if (clientField && clientCode) {
      clientField.value = clientCode;
    }

    fileInput?.addEventListener("change", () => {
      const count = fileInput.files ? fileInput.files.length : 0;
      fileSummary.textContent = count === 0 ? "No pictures selected" : `${count} picture${count === 1 ? "" : "s"} selected`;
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      message.className = "form-message";
      message.textContent = "";

      const files = Array.from(fileInput?.files || []);
      const totalUploadBytes = files.reduce((total, file) => total + file.size, 0);

      if (totalUploadBytes > maxUploadBytes) {
        message.className = "form-message error";
        message.textContent = "Please upload pictures totaling less than 10 MB.";
        return;
      }

      form.classList.add("is-loading");
      form.querySelector("button[type='submit']").disabled = true;
      submitText.textContent = "Submitting";

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.message || fallbackMessage);
        }

        form.reset();
        if (clientField && clientCode) {
          clientField.value = clientCode;
        }
        fileSummary.textContent = "No pictures selected";
        message.className = "form-message success";
        message.textContent = payload.message || successMessage;
      } catch (error) {
        const description = form.querySelector("[name='description']")?.value || "";
        const client = form.querySelector("[name='client']")?.value || "";
        const subject = encodeURIComponent("Quote request photos - HandyGuy Service");
        const bodyLines = [
          client ? `Client: ${client}` : "",
          description ? `Project details: ${description}` : "",
          "",
          "Please attach your pictures to this email before sending."
        ].filter(Boolean);
        const mailto = `mailto:handyguyserviceinfo@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

        message.className = "form-message error";
        message.innerHTML = `${fallbackMessage} <a href="${mailto}">Email photos instead</a>.`;
      } finally {
        form.classList.remove("is-loading");
        form.querySelector("button[type='submit']").disabled = false;
        submitText.textContent = "Submit Request";
      }
    });
  });
})();
