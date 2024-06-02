const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (_id) => {
const token = jwt.sign({_id}, process.env.SECRET_KEY,{expiresIn: "7d"});
return token;
}
const loginUser = async(req, res) => {
    const {email, password} = req.body;
try {   
    const user = await User.login(email, password);
    const token = generateToken(user._id);
    res.status(200).json({email, token});
} catch(err) {
 return  res.status(400).json({err: err.message});
}
}

const signUpUser = async (req,res) => {
const {email, password} = req.body;
try {   
    const user = await User.signUp(email, password);
    const token = generateToken(user._id);
    res.status(200).json({email, token});
} catch(err) 
{
 return  res.status(400).json({err: err.message});
}

};



module.exports = {loginUser, signUpUser};