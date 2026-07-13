import { sendTestEmail, emailConfigured } from "@/lib/radar/notify";

async function main() {
  console.log("Email configuré :", emailConfigured());
  const res = await sendTestEmail();
  console.log("✓ Email de test envoyé à", res.to);
}

main().catch((e) => { console.error("✗", e instanceof Error ? e.message : e); process.exit(1); });
