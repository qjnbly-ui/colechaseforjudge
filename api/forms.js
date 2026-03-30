const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "cole.p.chase@gmail.com";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json"
    }
  });

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const requiredEnv = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.CAMPAIGN_TO_EMAIL || DEFAULT_TO_EMAIL;

  if (!apiKey || !from) {
    return {
      error:
        "Email service is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in Vercel."
    };
  }

  return { apiKey, from, to };
};

const renderNewsletterHtml = ({ email, zip }) => `
  <h1>New campaign signup</h1>
  <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  <p><strong>ZIP:</strong> ${escapeHtml(zip || "Not provided")}</p>
`;

const renderContactHtml = ({ name, email, phone, interest, message }) => `
  <h1>New campaign contact</h1>
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
  <p><strong>Topic:</strong> ${escapeHtml(interest || "General contact")}</p>
  <p><strong>Message:</strong></p>
  <p>${escapeHtml(message || "No message provided.").replaceAll("\n", "<br />")}</p>
`;

const buildEmailPayload = (data, to, from) => {
  if (data.formType === "newsletter") {
    if (!data.email) {
      return { error: "Email is required." };
    }

    return {
      payload: {
        from,
        to: [to],
        subject: `Campaign signup: ${data.email}`,
        replyTo: data.email,
        html: renderNewsletterHtml(data)
      }
    };
  }

  if (data.formType === "contact") {
    if (!data.name || !data.email) {
      return { error: "Name and email are required." };
    }

    return {
      payload: {
        from,
        to: [to],
        subject: `Campaign contact: ${data.interest || "General contact"}`,
        replyTo: data.email,
        html: renderContactHtml(data)
      }
    };
  }

  return { error: "Unsupported form submission." };
};

export async function POST(request) {
  const env = requiredEnv();
  if ("error" in env) {
    return json({ error: env.error }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch (_error) {
    return json({ error: "Invalid request body." }, 400);
  }

  if (data.website) {
    return json({ ok: true });
  }

  const built = buildEmailPayload(data, env.to, env.from);
  if ("error" in built) {
    return json({ error: built.error }, 400);
  }

  const resendResponse = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(built.payload)
  });

  const resendResult = await resendResponse.json().catch(() => null);

  if (!resendResponse.ok) {
    const message = resendResult?.message || "Resend could not accept the message.";
    return json({ error: message }, resendResponse.status);
  }

  return json({ ok: true, id: resendResult?.id || null });
}
