# verboCaronas
1. Create a `.env` file at the root of the project and add the following variables:

-For the API_KEY variable, write the you api key from google directions api.

-For the DATABASE variable, write the name of your database.

-For the USER variable, write the name of your database user.

-For the PASSWORD variable, write the password of your database.

```env
API_KEY = "YOUR_API_KEY"
USER = "root"
USER = "1234"
DATABASE = "caronas"
```

2. In the first line of the `user.js` and `usersTable.js`, files found in `public/js/` folder, change the value of the url variable to the `url` of your server. Example: http://localhost:3000

```js
const url = "PUT YOUR URL HERE"
```

3. Open two terminals and run 
```js
node site.mjs
```
in a terminal and
```js
node bot.mjs
```
in another  terminal
