//requiring packages
var Joi = require ('joi');
const User=require("../models/users");
const crypto=require("crypto");
const keys=require("../config/keys")
const gravatar=require("gravatar");
const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20");
const ErrorResponse=require("../utils/errorResponse")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const notifier=require("node-notifier");
const path=require("path")
const cloudinary=require("../utils/cloudinary.js");
const {postNotification}=require("../controllers/notifications.controllers")
// passport.use(new GoogleStrategy({
//     clientID:keys.googleClientId,
//     clientSecret:keys.googleClientSecret,
//     callbackURL:"/auth/google/callback"
// }),
// (accessToken)=>{

// }
// )
//@desc registering user
//@route /api/auth/register
exports.registerUser = async (req, res, next) => {
    const {
        email, password
    } = req.body
    if ( !email || !password ) {
        return next(new ErrorResponse("please fill in all fields", 203))
    }
    if(password.length<4){
        return next(new ErrorResponse("Input a strong password", 203))
    }
    if (!email.match(/^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/)) {
        return next(new ErrorResponse("invalid Email", 203))
    }
    try {
        //avoiding duplicate email
        let user = await User.findOne({
            email
        })
        if (user){
            return next(new ErrorResponse("Email already used", 203))
        }
        const profile = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        })
        user = new User({
            email,
            password,
            profile,
            
        })
        const code = Math.floor(1000 + Math.random() * 9000);
      await user.save();
    //   await sendEmail({
    //       to:email,
    //       subject:"verify your email",
    //       html:`${code}`
    //   })
      await sendTokenResponse(user,200,res)
      await sendVerificationCode(user);
      
}
    catch (error) {
        return next(new ErrorResponse(error.message,203));
    }
}
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email});
    if (!user) {
        return next(new ErrorResponse("invalid credentials",203))
    }
    if(!user.password){
        return next(new ErrorResponse("Please use signin with google"))
    }
    const isMatch = await user.matchPasswords(password);
  
    if (!isMatch) {
        return next(new ErrorResponse("invalid credentials",203));
    }
    // req.session.user = user;
    const options = {
        expires: new Date(Date.now() + (1 * 24 * 60 * 60)),
        httpOnly: true,
    }
    await sendTokenResponse(user, 200, res);
}
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    const options = {
        expires: new Date(Date.now() + (1 * 24 * 60 * 60)),
        httpOnly: true,
    }
    res.status(statusCode).cookie('token', token, options).json({success:true,token:token})
}
const sendVerificationCode=async(user)=>{
    const code=Math.floor(1000 + Math.random() * 9000);
    const verificationToken=user.getResetPasswordToken();
    const verifyUrl=`http://localhost:3000/verify/${verificationToken}`;
    const message=`
    <h1>You have registered with theLib</h1>
    <p>Please go to this link to continue with theLib</p>
    <a href=${verifyUrl} clicktracking=off>${verifyUrl}</a>`
    await sendEmail({to:user.email,text:messasge,subject:"comfirm your E-mail"});
}
exports.forgotpassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        if(!email){
            return next(new ErrorResponse("fill in all fields", 203))
        }
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("You did not login with this E-mail", 203))
        }
        const resetToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `http://localhost:3000/auth/resetPassword/${resetToken}`;
        const message = `
        <h1>You have requested a password Reset</h1>
        <p>Please go to this link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `
        try {
            await sendEmail({
                to: user.email,
                subject: "password reset request",
                text: message
            })
            res.status(200).json({ success: true, data: "email sent" })
        } catch (error) {
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            return next(new ErrorResponse("Email could not be sent", 500))
        }
    } catch (error) {
        return next(new ErrorResponse("Email could not be sent", 500))
    }
}
exports.resetPassword = async (req, res, next) => {
    const {password,comfirmpassword}=req.body;
    if(!password || !comfirmpassword){
        return next(new ErrorResponse("fill in all fields",203))
    }
    if(password!=comfirmpassword){
        return next(new ErrorResponse("Passwordss do not match", 203))
    }
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");
    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordTokenExpire: { $gt: Date.now() }
        })
        if (!user) {
            return next(new ErrorResponse("invalid reset token", 404))
        }
            user.password = password,
            user.resetPasswordToken = undefined,
            user.resetPasswordTokenExpire = undefined
            await user.save();
            res.status(201).json({ success: true, data: "password updated succesfully" })
        
    } catch (error) {
        next(error)
    }
}
exports.dashboard = async (req, res, next) => {
    if (!req.session.user) {
        return res.json({ success: false, error: "unauthorized" }).status(401)
 
    }
    
    res.json({ success: true, message: "ready to go" }).status(200)
}
exports.logout = async (req, res, next) => {
    req.session.user = undefined;
    res.cookie('token', 'none', {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 1000)
    });
    res.json({ success: true, message: "logged out succesfully" });
}
exports.profile = async (req, res, next) => {
    const user = req.user.id;
    if (!user) return next(new ErrorResponse("user not found",404));
    try{
        if (!req.files) return next(new ErrorResponse("Please upload a photo", 203));
        const file = req.files.file;
        //make sure that uploaded file is an image
        if (!file.mimetype.startsWith("image")) return next(new ErrorResponse("Please upload an image", 203));
        //checking photo size
        if (file.size > keys.MAX_FILE_SIZE) return next(new ErrorResponse("Image too large", 203));
        //customizing image name to avoid overwriting
        file.name = `photo_${user}${path.parse(file.name).ext}`;
        //moving file
        const result = await cloudinary.uploader.upload(file.tempFilePath)
        res.json({ success: true, message: "profile updated" })
        await User.findByIdAndUpdate(user, { profile: result.secure_url });
    }
    catch(error){
        console.log(error)
    }
    // file.mv(`${keys.UPLOAD_PATH}/${file.name}`, async err => {
    //     if (err) {
    
    //         next(new ErrorResponse("Problem with image upload", 400))   
    //     }
    //     //saving images
    //     await User.findByIdAndUpdate(user, { profile: file.name });
    //     return res.json({ success: true, message: "Image uploaded succesfully" })
    // });
}
exports.getUser=async(req,res,next)=>{
    try {
        console.log(req.user)
        const id=req.user.id;
        const user = await User.findById(id).select("-password");
        res.send(user)
    } catch (error) {
        console.log(error);
    }
    
}
exports.findById=async(req,res,next)=>{
    
    
    try {
        const user=await User.findOne({_id: req.params.user});
        
        if(!user){
            return next(new ErrorResponse("No user",404))
        }
        res.send(user)
    } catch (error) {
        console.log(error)
    }
}
exports.updateUser=async(req,res,next)=>{
       const {username,bio,display}=req.body;
       if(!username || !display){
              return next(new ErrorResponse("Please fill in all fields",203));
       }
       const user=await User.findById(req.user.id);
       if(user.username===username && user.displayName==display && !bio){
              return next(new ErrorResponse("no field updated",203))
       }
       if(bio){
              if(bio.length<12){
                     return next(new ErrorResponse("Please provide a valid bio", 203))
              }
              if(bio.length>200){
                     return next(new ErrorResponse("Provide a short bio because little is needed"))
              }
              const updateWithBio=await User.findByIdAndUpdate(req.user.id,{bio:bio,displayName:display,username})
              res.json({success:true,message:"updated successfully"})
       }
       else{
              const update=await User.findByIdAndUpdate(req.user.id,{username,displayName:display});
              return res.send(update);
       }
}
exports.changePassword=async(req,res,next)=>{
       const {currentPassword,newPassword,comfirmPassword}=req.body;
       try {
              if(!currentPassword || !newPassword || !comfirmPassword){
              return next(new ErrorResponse("Please fill in all fields",203));
       }
       const salt=await bcrypt.genSalt(10);
       const hash=await bcrypt.hash(currentPassword,salt);
       const user=await User.findById(req.user.id).select("+password");
       // if(hash!=user.password){
       //        return next(new ErrorResponse("Please provide your correct current password",203));
       // }
       if(newPassword!=comfirmPassword){
              return next(new ErrorResponse("Passwords do not match",203));
       }
       user.password=newPassword;
       user.save();
       res.send("password updated")
       } catch (error) {
              console.log(error);
       }
       
}
exports.getFromBody=async(req,res,next)=>{
 const {userId}=req.body;
    try {
        const user=await User.findOne({_id: userId})
        if(!user){
            return next(new ErrorResponse("No user",404))
        }
        res.send(user)
    } catch (error) {
        console.log(error)
    }      
}