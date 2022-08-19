const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash')
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config();
const Product = require('./models/product');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const User = require('./models/user')
const { isLoggedIn } = require('./middleware');
const Cart = require('./models/cart');
const MongoStore = require('connect-mongo')(session);

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Database Connected ✔'))
    .catch((e) => {
        console.log(e)
    });

// view engine setup
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
const sessionConfig = {
    secret:'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 + 7,
        maxAge: 1000 * 60 * 60 * 24 + 7 
    }

}

app.use(session(sessionConfig));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.session = req.session;
    next();
})

// app.get('/fakeUser', async(req, res) => {
//     const user = new User({ email: 'isaa@gmail.com', username: 'isaa' });
//     const newUser = await User.register(user, 'isaaa');
//     res.send(newUser)
// })

app.get('/', catchAsync(async (req, res) => {
    const products = await Product.find();
    res.render('index', {products})
}))



app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', catchAsync(async (req,res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to MeowPlay!');
            res.redirect('/');
        })
    } catch(e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}));

app.get('/login', async (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/');
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
});

app.get('/cart', (req, res) => {
    if(!req.session.cart) {
        return res.render('cart', { products: null})
    }
    let cart = new Cart(req.session.cart);
    res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
})


app.get('/checkout', (req, res) => {
    req.flash('success', 'Thank you for shopping with us!')
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        // req.flash('success', 'Thanks for shopping with us!')
        return res.redirect('/')
    })
})

app.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if(!product) {
        req.flash('error', 'Cannot find that product!')
        return res.redirect('/')
    }
    res.render('show', { product })
}))

app.get('/add-to-cart/:id', function (req, res, next) {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart: { items: {} })
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/')
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/')
    })
})


app.get('/remove/:id', function (req, res, next) {
    const productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart')
})


// app.get('*', (req, res, next) => {
//     res.locals.cart = req.session.cart;
//     next();
// })


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(process.env.PORT || 3000, () => {
    console.log(`Backend Server on Port ${process.env.PORT} ✓`);
})