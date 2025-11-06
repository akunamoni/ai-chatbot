import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) => jwt.sign(
    {id : user._id , email: user.email},
    process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
)

export const register = async (req,res) =>{
try {
    const {name, email, password} = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email }})
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
}

}

export const login = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password) return res.status(400).json({error:"enter email and password"});

        const user = await User.findOne({email});
        if(!user) return res.status(400).json({error:"invalid credentials"});

        const match = await user.matchPassword(password);
        if(!match) return res.status(400).json({ error : "invalid password"});

        const token = signToken(user);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });

    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}