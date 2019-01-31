var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOvrride = require("method-override");
	User  = require("./models/user"),
	seedDB = require("./seeds");

// requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser : true});
mongoose.connect("mongodb://prakhar308:guddu3443@ds117545.mlab.com:17545/yelp_camp",
				{useNewUrlParser : true});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOvrride("_method"));
app.use(flash());
//seedDB();

//Passport config
app.use(require("express-session")({
	secret : "Logan Last man standing",
	resave : false,
	saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//call this function on every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(authRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(3000,function(){
	console.log("The YelpCamp server has started");
});	