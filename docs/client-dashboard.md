# Client Dashboard

Client Dashboard je namenjen obrtnikom. Mora biti zelo enostaven, pregleden in brez tehničnih izrazov. Client User vidi samo podatke svojega podjetja.

## Navigacija

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

## Pregled

Prikaži nova povpraševanja, neodgovorjena povpraševanja, poslane SMS-e, zahteve za Google ocene, aktivne kampanje, obisk spletne strani, konverzije obrazcev in priporočena opravila.

## Povpraševanja

Povpraševanje vsebuje ime, telefon, email, lokacijo, storitev, sporočilo, datum, status in SMS status. AI povzetki so označeni kot »Pride kmalu«.

Statusi: Novo, Kontaktirano, Ponudba poslana, Dogovorjeno, Zaključeno, Izgubljeno.

Akcije: Pokliči stranko, Pošlji SMS, Spremeni status, Dodaj opombo, Pošlji zahtevo za Google oceno. AI priprava ponudbe pride kmalu.

## Stranke / CRM

Kontakt vsebuje ime, priimek, telefon, email, naslov, kraj, opombe, vir, marketing consent, datum soglasja, zgodovino povpraševanj, zgodovino SMS-ov in status.

Statusi: Nov kontakt, Potencialna stranka, Stranka, Pretekla stranka, Neaktiven.

Za marketinške SMS kampanje se lahko uporabljajo samo kontakti z `marketing_consent = true`.

## SMS

SMS modul omogoča pregled SMS zgodovine, SMS obvestilo obrtniku ob novem povpraševanju, SMS za Google oceno in kasneje SMS kampanje. Stranka po oddaji povpraševanja prejme e-poštno potrdilo.

Primer SMS obrtniku:

> Novo povpraševanje: Marko, Ljubljana, menjava strehe. Odprite dashboard za več informacij.

Primer e-poštnega potrdila stranki:

> Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.

Primer SMS za Google oceno:

> Hvala za zaupanje. Veseli bomo vaše Google ocene: [povezava]

## Google ocene

Stranka vidi Google review link, število poslanih zahtev, zadnje poslane zahteve, kontakte za pošiljanje in gumb za pošiljanje zahteve za oceno.

Če Google review link ni nastavljen:

> Google review povezava še ni nastavljena. Pošljite nam povezavo ali nas kontaktirajte, da jo uredimo za vas.

## Kampanje

Za MVP naj stranka vidi aktivne kampanje, pripravljene kampanje, rezultate, možnost oddaje zahteve za novo kampanjo in možnost potrditve pripravljene kampanje.

## Spletna stran

Payload CMS zaenkrat ne uporabljamo. Stranka spletne strani ne ureja sama; za vsebino in tehnično delovanje v celoti skrbi ekipa Nivo.

Modul omogoča, da stranka ekipi Nivo preprosto sporoči novo željo ali podatek, izvedbo pa v celoti prevzame ekipa.

Opis:

> Napišite, kaj želite spremeniti na spletni strani. Naša ekipa bo spremembo uredila in vas obvestila, ko bo objavljena.

Stranka lahko odda naslov zahtevka, opis, priloge in prioriteto.

## Analitika

Prikaži obiske spletne strani, oddana povpraševanja, delež obiskovalcev, ki so poslali povpraševanje, poslane SMS-e, poslane zahteve za Google oceno in trend zadnjih 30 dni.

## Podpora

Kategorije: splošno vprašanje, tehnična težava, sprememba spletne strani, pomoč pri kampanji, pomoč pri Google ocenah, pomoč pri oglaševanju.

## Nastavitve

Stranka lahko ureja podatke podjetja, kontaktno osebo, email, telefon, naslov, Google review link, obvestila, SMS nastavitve in uporabnike ekipe.

Stranka ne sme urejati cene paketa, aktivnih storitev, sistemskih nastavitev, billing statusa ali drugih podjetij.
