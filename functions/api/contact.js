export async function onRequestPost({ request, env }) {
  const headers = { "Content-Type": "application/json" };
  const json = (status, body) => new Response(JSON.stringify(body), { status, headers });

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json(503, { error: "The contact form is not configured yet. Please try again later." });
  }

  let data;
  try { data = await request.json(); }
  catch { return json(400, { error: "Invalid form submission." }); }

  // Honeypot: silently accept automated submissions without sending mail.
  if (data.website) return json(200, { ok: true });

  const name = String(data.name || "").trim().slice(0, 100);
  const company = String(data.company || "").trim().slice(0, 120);
  const email = String(data.email || "").trim().slice(0, 254);
  const phone = String(data.phone || "").trim().slice(0, 40);
  const service = String(data.service || "").trim().slice(0, 120);
  const message = String(data.message || "").trim().slice(0, 4000);
  const marketingEmail = data.marketing_email === "yes";
  const submittedAt = new Date().toISOString();

  if (!name || !email || !service || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Please complete the required fields with a valid email address." });
  }

  const text = [
    "New FS Nexus website enquiry",
    "",
    `Name: ${name}`,
    `Company: ${company || "Not provided"}`,
    `Email: ${email}`,
    `Telephone: ${phone || "Not provided"}`,
    `Service: ${service}`,
    "",
    "Project details:",
    message,
    "",
    `FS Nexus email marketing consent: ${marketingEmail ? "YES" : "NO"}`,
    `Enquiry submitted (UTC): ${submittedAt}`
  ].join("\n");

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `FS Nexus website enquiry — ${name}`,
      text
    })
  });

  if (!sent.ok) {
    return json(502, { error: "We couldn't send your enquiry just now. Please try again later." });
  }
  return json(200, { ok: true });
}
