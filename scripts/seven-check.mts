/**
 * Preveri, ali sta SEVEN_API_KEY in SEVEN_SIGNING_SECRET pravilna, brez pošiljanja SMS-a.
 *
 * Zagon:  npm run seven:check
 *
 * Skripta ne izpiše nobene skrivnosti — samo odgovore seven.io.
 * SMS se ne pošlje: uporabimo neveljavno številko, ki jo seven zavrne pred pošiljanjem.
 */
import { createHash, createHmac, randomBytes } from "node:crypto";

const apiKey = process.env.SEVEN_API_KEY;
const secret = process.env.SEVEN_SIGNING_SECRET;

if (!apiKey) {
  console.error("✗ SEVEN_API_KEY ni nastavljen.");
  process.exit(1);
}

function signingHeaders(url: string, method: string, body: string): Record<string, string> {
  if (!secret) return {};

  const timestamp = String(Math.floor(Date.now() / 1000));
  const nonce = randomBytes(16).toString("hex");
  const stringToSign = [timestamp, nonce, method, url, createHash("md5").update(body).digest("hex")].join("\n");

  return {
    "X-Signature": createHmac("sha256", secret).update(stringToSign).digest("hex"),
    "X-Timestamp": timestamp,
    "X-Nonce": nonce,
  };
}

function explain(status: number, body: string) {
  if (body.includes("901")) return "✗ Podpis ni veljaven — SEVEN_SIGNING_SECRET ni pravi.";
  if (body.includes('"900"') || body.trim() === '"900"') return "✗ API ključ ni veljaven — SEVEN_API_KEY ni pravi.";
  if (body.includes("902")) return "✗ API ključ nima pravice pošiljati SMS.";
  if (body.includes("903")) return "✗ IP naslov ni na seznamu dovoljenih.";
  if (body.includes('"202"') || body.includes("202")) return "✓ Ključ in podpis sta v redu (številka je bila namenoma neveljavna).";
  if (status === 200) return "✓ Ključ in podpis sta v redu.";
  return `? Nepričakovan odgovor (HTTP ${status}).`;
}

const balanceUrl = "https://gateway.seven.io/api/balance";
const balance = await fetch(balanceUrl, {
  headers: { Accept: "application/json", "X-Api-Key": apiKey, ...signingHeaders(balanceUrl, "GET", "") },
});
const balanceBody = await balance.text();
console.log(`\n1) Dobroimetje  HTTP ${balance.status}  ${balanceBody.trim().slice(0, 60)}`);
console.log(`   ${explain(balance.status, balanceBody)}`);

const smsUrl = "https://gateway.seven.io/api/sms";
const smsBody = JSON.stringify({ to: "+000", text: "Preverjanje nastavitev." });
const sms = await fetch(smsUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Api-Key": apiKey,
    ...signingHeaders(smsUrl, "POST", smsBody),
  },
  body: smsBody,
});
const smsResponseBody = await sms.text();
console.log(`\n2) Pošiljanje   HTTP ${sms.status}  ${smsResponseBody.replace(/\s+/g, " ").trim().slice(0, 90)}`);
console.log(`   ${explain(sms.status, smsResponseBody)}`);

if (smsResponseBody.includes('"debug":"true"') || smsResponseBody.includes('"debug": "true"')) {
  console.log("\n⚠ Ključ je v DEBUG načinu — SMS-i se ne pošljejo v resnici. Za produkcijo uporabi pravi ključ.");
}

console.log(`\nPodpisovanje: ${secret ? "vklopljeno (SEVEN_SIGNING_SECRET je nastavljen)" : "izklopljeno (SEVEN_SIGNING_SECRET ni nastavljen)"}\n`);
process.exit(0);
