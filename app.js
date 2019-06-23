const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
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

app.use((req, res, next) => {
    User.findById("5ce2b99a80ea8671b3690a8c")
        .then(user => {
            // !!!!!!!!!!!!!!!!!!!!!!!!!!
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// 404 Error page
app.use(errorController.get404);

mongoConnect(() => {
    // if (5ce2b99a80ea8671b3690a8c)
    app.listen(3000);
});



