if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
// const Campground = require('./models/campground');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
// const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
// const {CampgroundSchema,reviewSchema} = require('./schemas')
// const Review = require('./models/review')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users');

const MongoStore = require('connect-mongo');

const dbUrl = process.env.db_url || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl)
.then(()=>{
    console.log('Connection open')
})
.catch(err=>{
    console.log('Error!')
    console.log(err)
});

app.engine('ejs',ejsMate)




app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

const secret = process.env.SECRET || 'niubi';

const sessionConfig = {
    name:'session',
    secret,
    resave:false,
    
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        // secure: true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    
    },
    store: MongoStore.create({
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 3600 // time period in seconds
      })
}


app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
})

app.get('/fake',async(req,res)=>{
    const user = new User({email:'asdsadasd',username:'asdasdas'});
    const newuser = await User.register(user,'chicken');
    res.send(newuser);
})

app.use('/',usersRoutes)
app.use('/campgrounds',campgroundsRoutes);
app.use('/campgrounds/:id/review',reviewsRoutes);


app.get('/',(req,res)=>{
    res.render('home')
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next)=>{
    const {statuesCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong'
    res.status(statuesCode).render('error',{err});
    
})
const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Serving on port ${port}`)
})