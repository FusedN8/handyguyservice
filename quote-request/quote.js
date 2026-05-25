(function () {
  const endpoint = "https://formsubmit.co/ajax/handyguyserviceinfo@gmail.com";
  const maxUploadBytes = 10 * 1024 * 1024;
  const successMessage = "Thank you. Your request has been received and will be reviewed shortly.";
  const params = new URLSearchParams(window.location.search);
  const clientCode = params.get("client") || "";

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
          throw new Error(payload.message || "Unable to submit request.");
        }

        form.reset();
        if (clientField && clientCode) {
          clientField.value = clientCode;
        }
        fileSummary.textContent = "No pictures selected";
        message.className = "form-message success";
        message.textContent = payload.message || successMessage;
      } catch (error) {
        message.className = "form-message error";
        message.textContent = error instanceof Error ? error.message : "Unable to submit request.";
      } finally {
        form.classList.remove("is-loading");
        form.querySelector("button[type='submit']").disabled = false;
        submitText.textContent = "Submit Request";
      }
    });
  });
})();
