import { SITE_URL } from "@/lib/seo";

const link = (path: string) => `${SITE_URL}${path}`;

export function llmsText(): string {
  return `# Obrtio

> Obrtio je slovenska SaaS platforma za obrtnike in lokalna izvajalska podjetja. Pripravimo profesionalno spletno stran in sistem za povpraševanja, SMS obvestila, Google ocene, kampanje in pregled strank.

Obrtio je namenjen krovcem, električarjem, vodovodarjem, HVAC podjetjem, gradbincem, fasaderjem, solarnim monterjem in drugim lokalnim izvajalcem v Sloveniji.

Osnovni paket stane 99 EUR na mesec ali 950 EUR za 12 mesecev. Ni začetnih stroškov ali vezave; postavitev spletne strani je vključena v naročnino. Obrtio ne ponuja brezplačne spletne strani v trajno last, ponuja pa brezplačen 20-minutni posvet.

## Glavne strani

- [Spletna stran in sistem za obrtnike](${link("/")}): pregled storitve in koristi
- [Spletna stran za obrtnike](${link("/spletna-stran-za-obrtnike")}): podrobnosti o izdelavi in upravljanju strani
- [Storitve](${link("/storitve")}): vse vključene in dodatne storitve
- [Cenik](${link("/cenik")}): cena, vključene funkcije in pogoji
- [Kako deluje](${link("/kako-deluje")}): postopek od posveta do objave
- [Brezplačen posvet](${link("/kontakt")}): kontakt in rezervacija posveta
- [Imenik izvajalcev](${link("/izvajalci")}): izvajalci po panogah in krajih
- [Celoten opis za jezikovne modele](${link("/llms-full.txt")}): razširjene informacije o ponudbi

## Pomembna dejstva

- Ciljni trg: Slovenija
- Jezik storitve in podpore: slovenščina
- Cena: 99 EUR/mesec ali 950 EUR/12 mesecev
- Začetni stroški: brez začetnih stroškov
- Vezava: brez vezave, prekinitev kadarkoli
- Čas postavitve: praviloma 7–10 dni po brezplačnem posvetu
- Kontakt: info@obrtio.si, 031 285 143
`;
}

export function llmsFullText(): string {
  return `# Obrtio — celoten opis storitve

## Kaj je Obrtio

Obrtio je slovenska SaaS in marketinška platforma za obrtnike ter lokalna izvajalska podjetja. Ključna obljuba je: »Vi opravljate delo. Mi poskrbimo za stranke.« Naročniku ni treba samostojno urejati spletne strani; za vsebino, slike, posodobitve, gostovanje in tehnično vzdrževanje skrbi ekipa Obrtio.

## Komu je storitev namenjena

Storitev je namenjena predvsem krovcem, električarjem, vodovodarjem, monterjem ogrevanja in klimatskih naprav, gradbenim podjetjem, fasaderjem, monterjem sončnih elektrarn, keramičarjem, mizarjem, slikopleskarjem in drugim lokalnim izvajalcem v Sloveniji.

## Osnovni paket

Cena osnovnega paketa je 99 EUR na mesec ali 950 EUR za 12 mesecev. Paket je brez vezave in brez začetnih stroškov. Postavitev je vključena v naročnino. Če naročnik prekine naročnino, se spletna stran in pripadajoči sistem deaktivirata.

Paket vključuje:

- profesionalno spletno stran do 5 podstrani
- pripravo vsebine ter popolno skrb ekipe Obrtio
- gostovanje in tehnično vzdrževanje
- kontaktne obrazce za povpraševanja
- SMS obvestilo izvajalcu ob novem povpraševanju
- e-poštno potrdilo stranki
- sistem za zbiranje Google ocen
- marketinške in referral kampanje
- osnovno analitiko in pregled rezultatov
- podporo

## Brezplačna spletna stran in brezplačen posvet

Obrtio ne ponuja brezplačne spletne strani v trajno last. Spletna stran nima ločenega začetnega stroška, ker je njena postavitev vključena v mesečno oziroma letno naročnino. Prvi 20-minutni posvet je brezplačen. Na posvetu ekipa preveri panogo, območje delovanja in primerno strukturo spletne strani.

## Dodatne storitve

- ureditev Google Business Profila: 500 EUR enkratno
- SEO: 500 EUR enkratno
- oglaševanje na Google Ads, Facebook Ads, Instagram Ads in TikTok Ads: po ponudbi
- izdelava slikovnih oglasov je vključljiva; video produkcija ni vključena

## AI funkcije

AI dodatek je označen kot »Pride kmalu«. Predvidene funkcije vključujejo čiščenje sporočil strank, povzetke in osnutke ponudb. Sistem ponudb ne bo pošiljal brez potrditve uporabnika.

## Postopek

1. Brezplačen 20-minutni posvet o podjetju, panogi in ciljih.
2. Ekipa Obrtio praviloma v 7–10 dneh pripravi spletno stran, obrazce, SMS obvestila in zbiranje ocen.
3. Izvajalec prejema povpraševanja in upravlja rezultate v svojem uporabniškem pregledu.

## Relevantne strani

- Glavna stran: ${link("/")}
- Spletna stran za obrtnike: ${link("/spletna-stran-za-obrtnike")}
- Storitve: ${link("/storitve")}
- Cenik: ${link("/cenik")}
- Kako deluje: ${link("/kako-deluje")}
- Kontakt in brezplačen posvet: ${link("/kontakt")}
- Imenik izvajalcev: ${link("/izvajalci")}
- Sitemap: ${link("/sitemap.xml")}

## Kontakt

- Podjetje: MIPA, Mitja Pak s.p.
- Blagovna znamka: Obrtio
- E-pošta: info@obrtio.si
- Telefon: 031 285 143
- Območje storitve: Slovenija
`;
}
