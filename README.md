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
 - `GET /card/search?params` Kilistázza a kártyákat keresési feltételnek megfelelően
 - `GET /card/:id` Visszaad 1 kártyát
 - `GET /deck` Kilistázza a megosztott paklit
 - `GET /deck/:id` Visszaad 1 paklit (Csak akkor ha saját vagy meg van osztva)
 - `POST /user/login` Belép egy felhasználó
 - `POST /user/register` Regisztrál egy felhasználót

### Authorizált

Felhasználó:
 - `POST /deck` Létrehoz egy új paklit
 - `DELETE /deck/:id` Töröl egy paklit
 - `PUT /deck/:id` Módosít egy paklit
 - `POST /deck/favorite/:id` Hozzáad egy paklit a kedvencekhez
 - `POST /deck/unfavorite/:id` Levesz egy paklit a kedvencekből

Admin:
 - `POST /card` létrehoz egy kártyát
 - `DELETE /card/:id` töröl egy kártyát
 - `PUT /card/:id` Módosít egy kártyát
 - Felhasználó végpontjai