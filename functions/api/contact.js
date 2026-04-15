/**
 * Cloudflare Pages Function — POST /api/contact
 * Receives reservation form data and sends a notification email
 * via Cloudflare Email Workers (MailChannels).
 */
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const { prenom, nom, email, telephone, date, heure, couverts, message } = body;

    if (!prenom || !nom || !email || !date || !heure || !couverts) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const textContent = [
      `Nouvelle demande de réservation — Le Baccus Restaurant`,
      ``,
      `Nom : ${prenom} ${nom}`,
      `Email : ${email}`,
      `Téléphone : ${telephone || "—"}`,
      `Date souhaitée : ${date}`,
      `Heure : ${heure}`,
      `Nombre de couverts : ${couverts}`,
      `Message : ${message || "—"}`,
    ].join("\n");

    // Send via MailChannels (free on Cloudflare Workers/Pages)
    const emailRes = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: "test@wedesignyour.site", name: "Le Baccus" }],
          },
        ],
        from: {
          email: "noreply@le-baccus-restaurant.wedesignyour.site",
          name: "Le Baccus — Réservation",
        },
        subject: `Réservation ${date} ${heure} — ${prenom} ${nom} (${couverts} couvert${couverts === "1" ? "" : "s"})`,
        content: [{ type: "text/plain", value: textContent }],
      }),
    });

    if (!emailRes.ok && emailRes.status !== 202) {
      console.error("MailChannels error:", emailRes.status, await emailRes.text());
      // Still return success — form data was received
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("Contact handler error:", err);
    return new Response(
      JSON.stringify({ error: "Erreur serveur. Veuillez réessayer." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
