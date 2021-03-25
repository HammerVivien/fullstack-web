# Yu-Gi-Oh Pakli Készítő

Egy weboldal ahol létrehozhatunk és megoszthatunk yu-gi-oh kártyapaklikat.

## Funkcionális követelmény

- Felhasználók készíthetnek paklikat
  - Ehhez kereshetnek kártyákat mindenféle feltétel alapján
- A paklikat meg lehet osztani, vagy privátra állítani
- Felhasználók hozzáadhatnak paklikat a kedvencekhez.
- Vendégek megnézhetik a paklikat és kártyákat, újat létrehozni nem tudnak
- Az admin létrehozhat új kártyákat

## Nem funkcionális követelmény
 - Felhasználóbarát
 - Biztonságos, gyors működés

## Szerepkörök
 - Vendég: Hozzáfér a paklikhoz, újat létrehozni nem tud
 - Felhasználó: Vendég szerepkörén túl létre tud hozni új paklit, sajátját szerkeszteni, és másokét hozzáadhatja a kedvencekhez
 - Admin: Felhasználó szerepkörén túl hozzá tud adni új kártyákat.

## Végpontok

 - `GET /card` Kilistázza az összes kártyát
 - `GET /card/:id` Visszaad 1 kártyát
 - `GET /deck` Kilistázza a megosztott paklikat
 - `POST /deck` Létrehoz egy új paklit