# Super Admin Dashboard

Super Admin je interna ekipa oziroma lastnik platforme. Upravlja podjetja, uporabnike, storitve, kampanje, zahtevke in plačila.

## Kaj Super Admin NE vidi

Povpraševanja, SMS-i, Google ocene in CRM kontakti naročnikov so podatki strank naših strank. Pripadajo obrtniku in jih Super Admin ne vidi — ne v seznamih, ne v profilu podjetja.

Na voljo so samo agregatni števci (koliko povpraševanj, koliko SMS-ov, koliko dostavljenih in neuspelih, koliko ocen), da lahko ekipa preveri, ali sistem pri stranki deluje. Nikoli imena, telefonske številke, e-pošte ali vsebine sporočil.

Izjema: brezplačni posveti, oddani na obrtio.si, so Obrtiova lastna povpraševanja in jih Super Admin vidi v celoti.

## Pregled

Prikazuj: aktivne stranke, nove stranke ta mesec, MRR, število poslanih SMS-ov, število novih povpraševanj, odprte zahtevke, aktivne kampanje, zapadla plačila in zadnje posvete z obrtio.si.

## Stranke / Companies

Super Admin lahko doda novo stranko, uredi stranko, deaktivira stranko, pregleda profil, odpre dashboard kot stranka, doda storitev, spremeni paket in nastavi Google review link. AI dodatek je zaenkrat označen kot »Pride kmalu«.

### Dodajanje nove stranke

Polja: ime podjetja, kontaktna oseba, email, telefon, dejavnost, lokacija, domena, status spletne strani, paket, Google review link, Google Business Profile status, SEO status, oglaševanje status, interni zapiski.

Statusi stranke: Aktivna, V pripravi, Čaka na vsebino, Čaka na plačilo, Začasno ustavljena, Odpovedana.

## Profil stranke

Prikaži osnovne podatke, kontaktne podatke, paket, dodatke, aktivne storitve, domeno, status spletne strani, Google review link, zahtevke, interne zapiske in zgodovino aktivnosti. Za povpraševanja, SMS-e, CRM kontakte in ocene prikaži samo števce, brez vsebine.

Akcije: Uredi podjetje, Deaktiviraj podjetje, Dodaj opombo, Odpri dashboard kot stranka, Pošlji obvestilo, Dodaj storitev, Označi storitev kot zaključeno.

## Zahtevki za spremembe spletne strani

Stranka ne ureja spletne strani direktno. Odda zahtevek, Super Admin oziroma ekipa pa spremembo uredi ročno.

Statusi: Novo, V obdelavi, Čaka na dodatne informacije, Čaka na potrditev, Urejeno, Zaprto.

Zahtevek vsebuje podjetje, naslov, opis, priloge, prioriteto, status, komentarje, datum oddaje, datum zaključka in odgovorno osebo.

## Povpraševanja

Super Admin vidi vsa povpraševanja vseh strank.

V istem pregledu vidi tudi brezplačne posvete, oddane na `obrtio.si/kontakt`. Posvet se neposredno shrani v bazo kot novo povpraševanje, obiskovalec pa samodejno prejme potrditveno e-pošto.

Povpraševanje vsebuje ime, telefon, email, lokacijo, storitev, sporočilo, podjetje, status, datum, vir in SMS status. AI povzetki pridejo kasneje.

Statusi: Novo, Kontaktirano, Ponudba poslana, Dogovorjeno, Zaključeno, Izgubljeno.

## SMS log

Super Admin vidi vse poslane SMS-e z vsebino, statusom, ponudnikom, ceno in napakami.

## Kampanje

Super Admin pripravlja in upravlja SMS, referral, Google Ads, Facebook Ads, Instagram Ads in TikTok Ads kampanje.

Marketinški SMS se lahko pošlje samo kontaktom, ki imajo `marketing_consent = true`.

## Storitve

Storitve: Osnovni paket, Google Business Profil, SEO, Oglaševanje, Dodatne spremembe spletne strani, Kampanje, Referral sistem. AI dodatek je označen kot »Pride kmalu«.

Za vsako storitev shrani ime, podjetje, ceno, tip plačila, status, datum začetka, datum zaključka in opombe.
