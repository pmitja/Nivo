# SMS sistem

SMS sistem je ena glavnih funkcij platforme.

Uporaba:

- obvestilo obrtniku o novem povpraševanju
- avtomatski SMS odgovor stranki
- SMS za Google oceno
- SMS kampanje kasneje

## Osnovni flow

1. Stranka izpolni kontaktni obrazec.
2. Sistem shrani lead v bazo.
3. Sistem pošlje SMS obrtniku.
4. Sistem pošlje avtomatski SMS stranki.
5. Lead se prikaže v dashboardu.

## SMS obrtniku

> Novo povpraševanje: Marko, Ljubljana, menjava strehe. Odprite dashboard za več informacij.

## SMS stranki

> Hvala za povpraševanje. Prejeli smo vaše sporočilo in se vam javimo v najkrajšem možnem času.

## SMS za Google oceno

> Hvala za zaupanje. Veseli bomo vaše Google ocene: [povezava]

## SMS kampanje

SMS kampanje so za akcije, popuste, sezonske ponudbe, promocije in referral kampanje.

Marketinški SMS se lahko pošlje samo kontaktom z `marketing_consent = true`.

## Soglasja

Ločimo servisno komunikacijo in marketinško komunikacijo.

Servisna komunikacija: potrditev povpraševanja, obvestilo o terminu, zahteva za oceno po opravljeni storitvi.

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

Za MVP lahko uporabimo Twilio, Infobip, MessageBird ali slovenski SMS provider.

Pričakovan strošek za Slovenijo: približno 0,03 € do 0,08 € na SMS.
