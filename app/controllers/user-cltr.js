const User = require('../models/user-model')
const bcryptjs = require('bcryptjs')
const HR = require('../models/HR')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const Candidate = require('../models/candidate-model')



const userCltr = {}

userCltr.register = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body
    try {
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password, salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Something went wrong" })
    }
}


userCltr.checkEmail = async (req, res) => {
    const email = req.query.email
    try {
        const user = await User.findOne({ email }) // Added await
        if (user) {
            res.json({ 'is_registered_email': true })
        } else {
            res.json({ 'is_registered_email': false })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Something went wrong' })
    }
}

userCltr.login = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const body = req.body
        const user = await User.findOne({ email: body.email })
        if (user) {
            const isAuth = await bcryptjs.compare(body.password, user.password)
            if (isAuth) {
                const tokenData = {
                    id: user._id,
                    role: user.role
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' })
                return res.json({ token: token })
            }
            return res.status(400).json({ errors: 'Invalid email/password' })
        }
        return res.status(404).json({ errors: 'Invalid email/password' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ errors: "Something went wrong" })
    }
}

userCltr.get = async(req,res)=>{
    try{
        const user = User.find()
        res.json(user)
    }
    catch(err){
        console.log(err)
    }
}

userCltr.forgotPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body; // Only email is needed
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'No user found registered with this email' });
      }
  
      // Send OTP email and get the OTP
      const otp = await sendOTPEmail(email,user.username);
  
      // Store the OTP in the user's record with an expiration time (e.g., 10 minutes)
      user.resetPasswordToken = otp;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  userCltr.resetPassword=async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, otp, newPassword } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if OTP is valid and not expired
      if (user.resetPasswordToken !== otp || user.resetPasswordExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      // Hash the new password and save it
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetOTP = undefined; // Clear the OTP fields
      user.otpExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.log(error)
      res.status(500).json({ message: 'Server error' });
    }
  };




userCltr.getProfile = async(req,res)=>{
    const userId = req.user.id
    try{
        const user = await User.findById(userId)
        res.json(user)
    }
    catch(error){
       console.log(error)
    }
}
userCltr.updateProfile = async(req,res)=>{
    const userId = req.user.id
    const body = req.body
    try{
        const user = await User.findByIdAndUpdate(userId,body,{new:true})
        if(!user){
            return res.status(404).json({error:'user not found'})
        }
        res.json(user)
    }
    catch(error){
       console.log(error)
    }

}
module.exports = userCltr
