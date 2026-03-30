const campaignAccessKey = "cole-chase-campaign-access";
const campaignPassword = "cole2026";
const gateForm = document.querySelector("#campaign-gate-form");
const gateFeedback = document.querySelector("#campaign-gate-feedback");

const normalizePassword = (value) => String(value || "").replace(/\s+/g, "").toLowerCase();

const unlockCampaignSite = () => {
  document.body.classList.remove("is-locked");
};

const lockCampaignSite = () => {
  document.body.classList.add("is-locked");
};

if (localStorage.getItem(campaignAccessKey) === "granted") {
  unlockCampaignSite();
} else {
  lockCampaignSite();
}

if (gateForm && gateFeedback) {
  gateForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(gateForm);
    const password = normalizePassword(formData.get("password"));

    if (password !== campaignPassword) {
      gateFeedback.textContent = "Incorrect password. Campaign team access only.";
      return;
    }

    localStorage.setItem(campaignAccessKey, "granted");
    gateFeedback.textContent = "";
    gateForm.reset();
    unlockCampaignSite();
  });
}

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const postForm = async (payload) => {
  const response = await fetch("/api/forms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  let result = null;
  try {
    result = await response.json();
  } catch (_error) {
    result = null;
  }

  if (!response.ok) {
    throw new Error(result?.error || "Unable to send form right now.");
  }

  return result;
};

document.querySelectorAll("[data-newsletter-form]").forEach((newsletterForm) => {
  const newsletterFeedback = newsletterForm.nextElementSibling;
  if (!newsletterFeedback) return;

  newsletterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(newsletterForm);
    const email = String(formData.get("email") || "").trim();
    const zip = String(formData.get("zip") || "").trim();

    if (!email) {
      newsletterFeedback.textContent = "Enter an email address first.";
      return;
    }

    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }
    newsletterFeedback.textContent = "Sending...";

    try {
      await postForm({
        formType: "newsletter",
        email,
        zip
      });
      newsletterForm.reset();
      newsletterFeedback.textContent = "Thanks. Your signup was sent to the campaign.";
    } catch (error) {
      newsletterFeedback.textContent =
        error instanceof Error ? error.message : "Unable to send form right now.";
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
});

const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");

if (contactForm && contactFeedback) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const interest = String(formData.get("interest") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email) {
      contactFeedback.textContent = "Name and email are required.";
      return;
    }

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }
    contactFeedback.textContent = "Sending...";

    try {
      await postForm({
        formType: "contact",
        name,
        email,
        phone,
        interest,
        message
      });
      contactForm.reset();
      contactFeedback.textContent = "Thanks. Your message was sent to the campaign.";
    } catch (error) {
      contactFeedback.textContent =
        error instanceof Error ? error.message : "Unable to send form right now.";
    } finally {
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
    }
  });
}
