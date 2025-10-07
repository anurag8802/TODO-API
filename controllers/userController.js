import User from '../modals/User.js';
import bcrypt, { hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async(req,res)=> {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({message: 'Please fill all fields'});
    }

    const userExists = await User.findOne({email});
    if(userExists) {
        return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password,10);
    const user = await User.create({name, email, password: hashedPassword});

    res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
    });
};

export const loginUser = async(req,res)=>{
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({message: 'Please fill all fields'});
    }

    const user = await User.findOne({ email });
    if(user && await bcrypt.compare(password, user.password)){
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }
};
 
