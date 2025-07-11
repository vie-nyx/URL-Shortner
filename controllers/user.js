const{v4: uuidv4} = require('uuid');
const {setUser} = require('../service/auth');
const User = require("../models/user")

async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

    try {
        await User.create({ name, email, password });
        return res.redirect("/");
    } catch (err) {
        if (err.code === 11000) {
            console.warn("Duplicate email signup attempt:", email);
            return res.status(409).send("Email already registered. Please try logging in.");
        }

        console.error("Signup error:", err);
        return res.status(500).send("An error occurred during signup. Please try again.");
    }
}


async function handleUserLogin(req,res){
    const {email,password} = req.body;
    const user = await User.findOne({email,password});
    if(!user) return res.render('login',{
        error:"Invalid username or password!"
    });
    const sessionId = uuidv4();
    setUser(sessionId,user);
    res.cookie('uid',sessionId);
    return res.redirect("/");
}
module.exports={
    handleUserSignup,handleUserLogin,
};