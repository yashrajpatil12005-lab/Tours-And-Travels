// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Form Submission to Google Apps Script
const form = document.getElementById("safariForm");
const statusDiv = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("🚀 Form submission started!");

    // Show loading state
    const submitBtn = form.querySelector(".submit-btn");
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Collect data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log("📦 Payload:", data);

    // ✅ Replace with your actual Google Apps Script Web App URL
    const SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbzqm9_H4u7fNcSA55mZXGfsS8qT0Yi3oIOU2Neqfym1PxDBvuhyNbQhSsTQUCjn1IfU/exec";
    console.log("🔗 Target URL:", SCRIPT_URL);

    // Script URL is configured.

    try {
      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data),
        // Important: Using text/plain avoids CORS preflight OPTIONS request which GAS doesn't handle
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      });

      console.log("📡 Response Status:", response.status);

      const textResult = await response.text();
      console.log("📄 Raw Response:", textResult);

      let result;
      try {
        result = JSON.parse(textResult);
      } catch (err) {
        console.warn(
          "⚠️ Could not parse JSON. Response might be an HTML error page from Google."
        );
        throw new Error(
          "Server returned non-JSON response: " + textResult.substring(0, 100)
        );
      }

      console.log("✅ Parsed Result:", result);

      if (result.result === "success") {
        statusDiv.innerText = "Thank you! Form submitted successfully.";
        statusDiv.style.color = "#2ecc71";
        form.reset();
      } else {
        console.error("❌ Server returned logic error:", result);
        statusDiv.innerText = "Something went wrong. Please try again.";
        statusDiv.style.color = "#e74c3c";
      }
    } catch (error) {
      console.error("Error!", error.message);
      statusDiv.innerText = "Error submitting form. Please try WhatsApp.";
      statusDiv.style.color = "#e74c3c";
    } finally {
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

