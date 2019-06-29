const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

// Use of templating engines - HUOM! Pug on expressin mukana automaattisesti. Ei tartte erikseen "requirata"
// app.engine('hbs', expressHbs({
//     layoutsDir: 'views/layouts/', 
//     defaultLayout: 'main-layout', 
//     extname: 'hbs'}));
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
// app.set('view engine', 'pug');
// Sets the views directory to '/views'
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({ extended: true }));
// Handles static middleware ('public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// Tässä liitetään req.user:iin Mongoose model jolloin voidaan kutsua kaikki propertyjä ja funktioita
app.use((req, res, next) => {
    User.findById("5d15138d4106f22c2c0ef009")
        .then(user => {
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error page
app.use(errorController.get404);

mongoose.connect(
    'mongodb+srv://pasi:2Karre3Ilmari@cluster0-leh6j.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true }
).then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: "Pasi",
                email: "pasi.juurakko@gmail.com",
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })

    app.listen(3000);

    console.log(' --- Server Started ---');
    console.log(' +++ Connected to Mongoose DB +++');
}).catch(err => {
    console.log(err)
});