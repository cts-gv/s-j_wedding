// Supabase Edge Function: sends a bilingual confirmation email via Resend
// whenever a new row is added to save_the_date_responses.
// Triggered by a Database Webhook (INSERT). See SETUP.md.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET")!;
const FROM = Deno.env.get("FROM_EMAIL") ?? "Sunshine & Jose <hello@sunshineandjose.party>";
const REPLY_TO = Deno.env.get("REPLY_TO_EMAIL"); // optional: your personal email

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const copy = {
  en: {
    subject: "We got your response! · Save the Date, September 18, 2027",
    hi: (n: string) => `Hi ${n},`,
    body1: "Thank you for letting us know. We've received your details and can't wait to celebrate with you.",
    date: "September 18, 2027",
    body2: "Your official invitation will be sent to this email address, so keep an eye on your inbox (and your spam folder, just in case).",
    sign: "With love,",
  },
  es: {
    subject: "¡Recibimos tu respuesta! · Reserva la fecha, 18 de septiembre de 2027",
    hi: (n: string) => `Hola ${n},`,
    body1: "Gracias por avisarnos. Recibimos tus datos y no podemos esperar para celebrar contigo.",
    date: "18 de septiembre de 2027",
    body2: "Tu invitación oficial llegará a este correo, así que revisa tu bandeja de entrada (y la carpeta de spam, por si acaso).",
    sign: "Con cariño,",
  },
} as const;

Deno.serve(async (req) => {
  // Only accept calls that carry our shared secret (set in the webhook headers)
  if (req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  if (payload.type !== "INSERT" || !payload.record?.email) {
    return new Response("Ignored", { status: 200 });
  }

  const { names, email, lang } = payload.record as { names: string; email: string; lang?: string };
  const c = copy[lang === "es" ? "es" : "en"];
  const firstName = esc((names ?? "").trim().split(/\s+/)[0] || "friend");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f7f3ec;">
  <div style="max-width:520px;margin:0 auto;padding:40px 28px;font-family:Georgia,'Times New Roman',serif;color:#241f18;line-height:1.6;">
    <p style="font-size:18px;margin:0 0 16px;">${c.hi(firstName)}</p>
    <p style="margin:0 0 16px;">${c.body1}</p>
    <p style="font-size:22px;margin:24px 0;text-align:center;letter-spacing:.5px;">${c.date}</p>
    <p style="margin:0 0 24px;">${c.body2}</p>
    <p style="margin:0;">${c.sign}<br>Sunshine &amp; Jose</p>
  </div>
</body></html>`;

  const text = `${c.hi(firstName)}\n\n${c.body1}\n\n${c.date}\n\n${c.body2}\n\n${c.sign}\nSunshine & Jose`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [email],
      subject: c.subject,
      html,
      text,
      ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return new Response("Email failed", { status: 502 });
  }
  return new Response("Sent", { status: 200 });
});
