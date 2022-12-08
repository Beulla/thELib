const express=require("express");
const cors=require('cors');
const session=require("express-session");
const cookieSession=require("cookie-session");
const app=express();
const passport=require("passport")
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,()=>console.log(`server running on port ${PORT}`));

app.use(cors())
app.use(passport.initialize());
app.use(cookieSession({
    maxAge:30*24*60*60*1000,
    keys:[keys.COOKIE_KEY]
}))
app.use(passport.initialize());
app.use(passport.session())
const cookieParser=require("cookie-parser");
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(cookieParser());
app.use(express.json());
const connectDb=require("./utils/dbConn");
var bookRoutes=require("./routes/bookRoutes")
app.use(errorHandler);
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, OPTIONS");
    next();
});
app.use("/",bookRoutes)