const express=require("express");
const {protect,roles}=require("../middlewares/protect")
const googleSchema=require("../models/googleSign");
const { getUsers, registerUser, loginUser, forgotpassword, resetPassword, dashboard, logout, profile, getUser, findById, updateUser, changePassword, getFromBody}=require("../controllers/auth")
const {register,view,update, deleteLyrics } = require("../controllers/auth")
const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const keys = require("../config/keys");
const uploader=require("../utils/multer")
const cloudinary=require("../utils/cloudinary")
const fs=require("fs");
const User = require("../models/User");
const jwt=require("jsonwebtoken");
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    const options = {
        expires: new Date(Date.now() + (1 * 24 * 60 * 60)),
        httpOnly: true,
    }
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token: token,
        message: "logged in successfully"
    })
}
passport.use(new GoogleStrategy({
    clientID:keys.googleClientId,
    clientSecret:keys.googleClientSecret,
    callbackURL:"/api/v1/auth/google/callback"
},async(accessToken,refreshToken,profile,done)=>{
    const user=await User.findOne({googleId:profile.id});
    if(!user){
        new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: `${profile.name.familyName}`,
            profile: profile.photos[0].value,
            role: 'client'
        }).save().then(user => done(null, user)).catch(err => console.log(err))
    }
    else{
        done(null,user);
    }
}))
const router=express.Router()
passport.serializeUser(function (user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user.id);
});
passport.deserializeUser((id,done)=>{
    User.findById(id).then(user=>{
        done(null,user)
    })
})

router.get("/google",passport.authenticate('google',{
    scope: ['profile','email']
}))
router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/google"}),async(req,res)=>{
    res.send("we are there")
})
router.get("/current_user",(req,res)=>{
    res.send(req.user);
})
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/forgotpassword").post(forgotpassword)
router.route("/resetPassword/:resetToken").put(resetPassword);
router.route("/dashboard").get(dashboard)
router.route("/logout").get(logout)
// router.route(upload.single(req.file),"/profile").put(protect,profile)
router.route("/profile").put(protect,profile)
router.route("/").get(protect, getUser)
// router.route("/:user").get(findById)
router.get("/:user", findById);
router.route("/update").put(protect,updateUser)
router.route("/getByBody").post(getFromBody)
router.route("/updatepassword").put(protect,changePassword)
module.exports = router;