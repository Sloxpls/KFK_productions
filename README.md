# Överblick

Det här projektet består av tre huvudsakliga delar som körs i separata Docker-containrar:

1. **PostgreSQL-databas**  
   - Hanterar lagring av all data: låtar, mediafiler, användarinformation m.m.  
   - Databasens användare, lösenord och databasnamn sätts via miljövariabler i `docker-compose.yml`.

2. **Flask-baserad backend**  
   - Tillhandahåller API-slutpunkter för att hantera uppladdning av filer, inloggning, spårhantering, sociala länkar och annan logik.  
   - Använder `Flask-SQLAlchemy` för kommunikation med databasen.  
   - Returnerar JSON-svar till frontenden och tar emot förfrågningar från webbläsaren (via exempelvis `fetch`).

3. **Nginx-baserad frontend**  
   - Serverar statiska filer (HTML, CSS och JavaScript).  
   - Innehåller flera JS-filer som ansvarar för olika delar av funktionaliteten:  
     - `visualizer.js` för ljudvisualisering  
     - `upload.js` för uppladdning av musikfiler och bilder  
     - `songs.js` för att visa och redigera låtlistor  
     - `media.js` för att hantera Media Library  
     - `login.js` för inloggning  
     - `laboratory.js` för experimentella funktioner (t.ex. visning av låttexter)  
   - Skickar vidare API-anrop (t.ex. `/api/...`) till Flask-backenden via `proxy_pass` i sin konfiguration.

## Flöde

1. Användaren besöker webbgränssnittet som serveras av Nginx.  
2. Webbläsaren laddar frontenden (HTML/JS/CSS) och anropar backenden via API:et (t.ex. för att logga in, hämta låtinformation eller ladda upp filer).  
3. Flask-backenden tar emot anropen, kommunicerar med databasen (PostgreSQL) och skickar tillbaka JSON-svar.  
4. Frontenden uppdaterar därefter gränssnittet (visar låtlistor, bekräftar uppladdning, hanterar inloggningsflödet osv.).

## Drift & Utveckling

- Projektet startas vanligtvis via `docker-compose.yml`, vilket skapar och kör samtliga containrar:
  1. `database` (Postgres)  
  2. `backend` (Flask)  
  3. `frontend` (Nginx)  
- Vid kodändringar i backend (Flask) eller frontend (Nginx + statiska filer) behöver containrarna byggas om för att ändringarna ska slå igenom, om man inte använder volymer för direktuppdatering i utvecklingsläge.  
- I en produktionssättning kan samma Docker Compose-konfiguration användas, men med exempelvis inaktiverad debug och mer låsta miljöinställningar.

Sammanfattningsvis utgör **Nginx-frontenden** användargränssnittet och skickar anrop till **Flask-backenden**, som i sin tur hanterar logik och databasoperationer i **Postgres**. På så sätt får vi en komplett lösning som separerar ansvar och underlättar både utveckling och drift.
