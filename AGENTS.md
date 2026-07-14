# AGENTS.md — Glavni projektni brief

## Projekt

Gradimo SaaS + marketing platformo za slovenske obrtnike in gradbena podjetja.

Ciljne stranke:

- krovci
- električarji
- vodovodarji
- HVAC podjetja
- gradbinci
- fasaderji
- solarni monterji
- drugi lokalni izvajalci

Ključna obljuba:

> Vi opravljate delo. Mi poskrbimo za stranke.

Platforma mora izgledati kot sodoben SaaS produkt za rast obrtnikov, ne kot marketinška agencija.

## Vizualni stil

Inspiracija: Stripe, Linear, Attio.

UI mora biti premium, čist, pregleden, enostaven za obrtnike, mobile responsive, brez nepotrebnega žargona in v slovenščini.

## Poslovni model

### Osnovni paket

Cena: 99 €/mesec ali 950 € za 12 mesecev.

Vključuje:

- profesionalna spletna stran do 5 podstrani
- popolna skrb ekipe Obrtio za vsebino in delovanje spletne strani
- gostovanje
- vzdrževanje
- kontaktni obrazci
- SMS obvestilo obrtniku
- e-poštno potrdilo stranki
- sistem za zbiranje Google ocen
- marketinške kampanje
- referral kampanje
- analitika
- podpora

Brez vezave. Če stranka odpove, se spletna stran odstrani ali deaktivira, sistem se deaktivira in dashboard dostop se omeji ali zapre.

### AI dodatek

Status: pride kmalu.

Prihodnje AI funkcije:

- AI očisti sporočilo stranke
- AI naredi povzetek
- AI pripravi osnutek ponudbe
- AI skrajša administracijo

AI ne sme avtomatsko pošiljati ponudb brez potrditve uporabnika. Dokler funkcija ni pripravljena, jo v UI prikazujemo kot »Pride kmalu«.

### Dodatne storitve

- Google Business Profil: 500 € enkratno
- SEO: 500 € enkratno
- Oglaševanje: po ponudbi

Oglaševalske platforme: Google Ads, Facebook Ads, Instagram Ads, TikTok Ads. Izdelujemo slikovne oglase. Video produkcija ni vključena.

## Tehnična odločitev

Uporabimo:

- Neon PostgreSQL za bazo
- Railway za hosting
- Next.js za aplikacijo
- Drizzle ORM ali Prisma
- Tailwind CSS za UI

Payload CMS zaenkrat ne uporabljamo. Stranka spletne strani ne ureja sama; za vsebino, slike, posodobitve, gostovanje in tehnično vzdrževanje v celoti skrbi interna ekipa.

## Uporabniške vloge

### Super Admin

Interna ekipa / lastnik platforme. Upravlja stranke, podjetja, storitve, zahtevke, plačila, kampanje in nastavitve.

**Super Admin ne vidi povpraševanj, SMS-ov, ocen in CRM kontaktov naročnikov.** To so podatki strank naših strank in pripadajo obrtniku. Super Admin vidi samo agregatne števce (koliko povpraševanj, koliko SMS-ov, koliko ocen), da lahko preveri, ali sistem pri stranki deluje — nikoli imen, telefonskih številk ali vsebine sporočil.

Izjema so povpraševanja, oddana na obrtio.si (brezplačni posveti) — ta pripadajo Obrtiu in jih Super Admin vidi v celoti.

### Client User

Obrtnik oziroma podjetje. Vidi samo svoje podatke.

## Multi-tenant pravilo

Vsi glavni zapisi morajo imeti `company_id`. Client User nikoli ne sme videti podatkov drugih podjetij.

Super Admin vidi vse, kar zadeva poslovanje s stranko (podjetje, storitve, plačila, zahtevki, podpora), ne pa podatkov, ki jih je stranka pridobila prek platforme (povpraševanja, SMS-i, ocene, CRM kontakti). Za te ima na voljo samo števce.

## Navigacija — Client Dashboard

- Pregled
- Povpraševanja
- Stranke
- SMS
- Google ocene
- Kampanje
- Spletna stran
- Analitika
- Podpora
- Nastavitve

## Navigacija — Super Admin

- Pregled
- Stranke
- Povpraševanja (samo posveti z obrtio.si)
- SMS statistika (samo števci)
- Google ocene (samo števci)
- Kampanje
- Zahtevki
- Storitve
- Plačila
- Nastavitve

## MVP prioriteta

Najprej zgraditi:

1. Auth
2. Super Admin dodajanje strank
3. Client dashboard overview
4. Povpraševanja
5. SMS obvestilo obrtniku
6. E-poštno potrdilo stranki
7. Google review request SMS
8. Zahtevki za spremembe spletne strani
9. Osnovni CRM za stranke
10. Osnovna analitika

Kasneje dodati AI dodatek, SMS kampanje, referral kampanje, billing, napredno analitiko, integracije in več uporabnikov na podjetje.

## Ton komunikacije

Vsa vsebina mora biti v slovenščini. Ton naj bo jasen, samozavesten, prijazen, profesionalen in brez agencijskega nakladanja.

Uporabljaj izraze: povpraševanja, stranke, ocene, sporočila, akcije, ponudbe, spletna stran, rezultati.

Ne uporabljaj izrazov: lead nurturing, funnel, growth hacking, performance marketing jargon, CRM automation jargon.
