# NightClub booking API

`reservations.cjs` extends the supplied NightClub API. The website needs this extension for private booking lists and prevention of double bookings.

Copy `reservations.cjs` to the API directory, then insert the following after `app.use(jsonServer.bodyParser)` and before the auth rewrite rules in its `server.js`:

```js
app.use(require("./reservations.cjs")(
  router.db,
  require("jsonwebtoken"),
  require("json-server-auth/dist/constants").JWT_SECRET_KEY
));
```

Restart the API with `npm start`. It uses the existing API authentication secret and dependencies. Existing data is not migrated or removed. Old reservations without a `userId` still block their table/date, but are not assigned to a user by guessing from an email address.

Reservations are owned by the verified token subject. GET returns only the current user's reservations; DELETE checks ownership; POST validates input and returns HTTP 409 when the table is booked on that Copenhagen calendar date. Each reservation covers the entire evening. The synchronous check and insert protects concurrent requests within the single-process local JSON API; a multi-process production deployment would require a database uniqueness constraint.

Run logic checks from the website directory:

```sh
node --test api-extension/reservations.test.cjs
```
