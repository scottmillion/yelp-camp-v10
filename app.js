// APP IMPORTS
const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  seedDB = require('./seeds'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  User = require("./models/user");

// ROUTES IMPORTS
const
  commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

// DELETE DATABASE AND LOAD SEED DATA
seedDB();

// APP CONFIG
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PASS USER INFO TO EVERY VIEW PAGE
app.use((req, res, next) => {
  // whatever you put in res.locals is available on every view template.
  res.locals.currentUser = req.user;
  next();
});

// REQUIRING ROUTES
app.use(indexRoutes);
//refactor: all campground routes start with /campgrounds
app.use("/campgrounds", campgroundRoutes);
//refactor: all comment routes start with /campgrounds/:id/comments
app.use("/campgrounds/:id/comments", commentRoutes);

// MONGOOSE MONGO CONFIG
mongoose.connect('mongodb://localhost:27017/yelp-camp-v10', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to DB!'))
  .catch(error => console.log(error.message));

// =====================
// SERVER
// =====================

app.listen(3000, (req, res) => {
  console.log("Server running on 3000, sir!");
});