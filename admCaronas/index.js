import express from "express";
import bodyParser from "body-parser";
import session from 'express-session';
import { loginAuth } from "./middleware.js";
import { getUsers, deleteUser, getUserById, updateUser } from "./handleData.js";

//express
const app = express();
app.use(express.static('admCaronas/public'))

//__dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* express-session */
app.use(session({
    secret: "IAsi93#@*SAdsa-JoA#@*(", cookie: { maxAge: 3000000 },
    resave: false,
    saveUninitialized: false
}))

/* Routes */

//login
app.post('/login', (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const users = [
        { name: 'user1', password: '1234' },
        { name: 'user2', password: '4321' },//Get from database
        { name: 'user3', password: '2413' }
    ]

    for (let i in users) {
        if (name === users[i].name && password == users[i].password) {
            req.session.user = {
                name: name,
            }
            res.redirect('/users');
            break
        } else if (i >= users.length - 1) {
            res.redirect('/')
        }
    }
})

//All users
app.get('/users', loginAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/usersTable.html')
})

app.get('/getusers', loginAuth, async (req, res) => {
    res.json(await getUsers());
})

//individual user data
app.get('/user/:id', loginAuth, (req, res) => {
    res.sendFile(__dirname + '/public/pages/user.html')
})

app.get('/getuser/:id', loginAuth, async (req, res) => {
    res.json(await getUserById(req.params.id))
})

app.put('/updateUser/:id', loginAuth, async (req, res) => {
    console.log(req.body)
    await updateUser(req.body, res)
    res.status(200).send('Ok')
})

app.delete('/user/:id', loginAuth, (req, res) => {
    const userId = req.params.id
    deleteUser(userId, res)
})

//server port
app.listen(3000, () => console.log('servidor rodando na porta 3000'))