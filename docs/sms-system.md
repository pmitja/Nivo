# SMS sistem

SMS sistem je ena glavnih funkcij platforme.

Uporaba:

- obvestilo obrtniku o novem povpraševanju
- SMS za Google oceno
- SMS kampanje kasneje

## Osnovni flow

1. Stranka izpolni kontaktni obrazec.
2. Sistem shrani lead v bazo.
3. Sistem pošlje SMS obrtniku.
4. Sistem pošlje potrditveni SMS stranki.
5. Sistem pošlje potrditveno e-pošto stranki.
6. Lead se prikaže v dashboardu.

## SMS obrtniku

> Novo povprasevanje: Marko, Ljubljana, menjava strehe. Odprite Obrtio za vec informacij.

## SMS stranki

> Hvala za povprasevanje. Streharstvo Novak se vam javi v najkrajsem moznem casu.

Besedilo je fiksno in ni nastavljivo po podjetju.

## E-pošta stranki

Stranka po oddaji poleg SMS-a prejme še e-poštno potrdilo.

## SMS za Google oceno

> Hvala za zaupanje. Prosimo ocenite naso storitev: [povezava]

## Kodiranje in dolžina

SMS s šumniki se kodira v UCS-2, kjer je en segment dolg samo 70 znakov. Zato vsa SMS besedila pred pošiljanjem pretvorimo v GSM-7 (č → c, š → s, ž → z) in jih omejimo na **160 znakov**, kar je en segment.

Pretvorbo in omejitev opravi `src/lib/sms-copy.ts`. Nova SMS besedila vedno dodaj tam.

## SMS kampanje

SMS kampanje so za akcije, popuste, sezonske ponudbe, promocije in referral kampanje.

Marketinški SMS se lahko pošlje samo kontaktom z `marketing_consent = true`.

## Soglasja

Ločimo servisno komunikacijo in marketinško komunikacijo.

Servisna komunikacija: e-poštno potrdilo povpraševanja, obvestilo o terminu, zahteva za oceno po opravljeni storitvi.

Marketinška komunikacija: akcije, popusti, sezonske ponudbe, množični SMS-i. Za to je potreben ločen marketing consent.

## Checkboxi na obrazcu

Obvezen checkbox:

```txt
Strinjam se z obdelavo podatkov za namen obravnave povpraševanja.
```

Neobvezen checkbox, privzeto prazen:

```txt
Želim prejemati obvestila o akcijah, novostih in posebnih ponudbah.
```

Ne nastavljaj marketinškega checkboxa privzeto na true.

## Baza

Za kontakte shrani:

```sql
marketing_consent BOOLEAN
marketing_consent_at TIMESTAMP
marketing_consent_source TEXT
opt_out BOOLEAN
```

Za kampanje pošiljaj samo:

```sql
WHERE marketing_consent = true
AND opt_out = false
```

## SMS log

Vsak SMS mora biti shranjen v `sms_messages`.

## Provider

Uporabljamo seven.io. SMS ob novem povpraševanju prejmeta obrtnik in stranka.

Okoljske spremenljivke:

```txt
SEVEN_API_KEY          # API ključ (app.seven.io → Developer)
SEVEN_SIGNING_SECRET   # signing key za preverjanje webhookov (isto mesto)
SEVEN_SMS_FROM         # pošiljatelj, npr. Obrtio (neobvezno)
SEVEN_WEBHOOK_URL      # URL, kot je registriran pri seven.io (neobvezno)
```

Pošiljanje: `POST https://gateway.seven.io/api/sms` z glavo `X-Api-Key`, telo `{ to, text, from, foreign_id }`. `foreign_id` je naš `sms_messages.id`, da sporočilo najdemo tudi v dnevniku seven.io.

Odgovor vrne kodo `success` (`100` = sprejeto) ter `messages[0].id` in `messages[0].price`. ID shranimo v `sms_messages.provider_message_id`, ceno v `sms_messages.cost`.

Status dostave: seven.io pošlje `dlr` webhook na `/api/webhooks/seven`. Webhook registriraš v seven.io (tip dogodka `dlr`, metoda `JSON`). Payload je `{ data: { msg_id, status }, webhook_event: "dlr" }`.

Statuse mapiramo: `DELIVERED` → `delivered`, `NOTDELIVERED` / `EXPIRED` / `REJECTED` / `FAILED` → `failed`. Vmesne statuse (`TRANSMITTED`, `ACCEPTED`, `BUFFERED`) ignoriramo.

Webhook je podpisan. Preverimo `X-Signature` = HMAC-SHA256 (hex) niza `timestamp \n nonce \n POST \n URL \n MD5(telo)` s signing key-em. Zavrnemo podpise, starejše od 5 minut.

Pošiljatelj: alfanumerični `Obrtio` je pri seven.io nastavljiv prek `from`. Za Slovenijo je treba pošiljatelja pri seven.io predhodno registrirati, sicer se uporabi privzeta številka računa.
