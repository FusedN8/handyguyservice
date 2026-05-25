(function () {
  const maxUploadBytes = 10 * 1024 * 1024;
  const params = new URLSearchParams(window.location.search);
  const clientCode = params.get("client") || "";

  document.querySelectorAll("[data-quote-form]").forEach((form) => {
    const fileInput = form.querySelector("[data-file-input]");
    const fileSummary = form.querySelector("[data-file-summary]");
    const message = form.querySelector("[data-form-message]");
    const submitText = form.querySelector("[data-submit-text]");
    const clientField = form.querySelector("[data-client-code]");
    const nextField = form.querySelector("[data-next-url]");

    if (clientField && clientCode) {
      clientField.value = clientCode;
    }

    if (nextField) {
      nextField.value = `${window.location.origin}/quote-thank-you/`;
    }

    fileInput?.addEventListener("change", () => {
      const count = fileInput.files ? fileInput.files.length : 0;
      fileSummary.textContent = count === 0 ? "No pictures selected" : `${count} picture${count === 1 ? "" : "s"} selected`;
    });

    form.addEventListener("submit", async (event) => {
      message.className = "form-message";
      message.textContent = "";

      const files = Array.from(fileInput?.files || []);
      const totalUploadBytes = files.reduce((total, file) => total + file.size, 0);

      if (totalUploadBytes > maxUploadBytes) {
        event.preventDefault();
        message.className = "form-message error";
        message.textContent = "Please upload pictures totaling less than 10 MB.";
        return;
      }

      form.classList.add("is-loading");
      form.querySelector("button[type='submit']").disabled = true;
      submitText.textContent = "Submitting";
    });
  });
})();
