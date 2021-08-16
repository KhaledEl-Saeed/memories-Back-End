import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';




export const signin = async (req,res) => {
    const { email, password } = req.body;

    try {
        const exsitingUser = await User.findOne({ email });

        if(!exsitingUser) return res.status(404).json({ message: "User doesn't exist" });

        const isPasswordCorrect = bcrypt.compareSync(password, exsitingUser.password); 

        if(!isPasswordCorrect)  return res.status(400).json({message: "invalid credentials"});
        if(!password)  return res.status(400).json({message: "invalid credentials"});

        const token = jwt.sign({ email: exsitingUser.email, id: exsitingUser._id }, 'test', { expiresIn: "1h" });

        res.status(200).json({result: exsitingUser, token});
    } catch (error) {
        res.status(500).json({message:'something went wrong'});
        console.log(error);
    }
};

export const signup = async (req,res) => {
    const { email, password, confirmPassword, firstName, lastName} = req.body;
    
    try {
        const exsitingUser = await User.findOne({ email });

        if(exsitingUser) return res.status(400).json({ message: "User already exists" });
    
        if(password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

        

        const hash = bcrypt.hashSync(password, 12);
        
        //const hashedPassword = await bcrypt.hash(password, 12);

        console.log(`req.body: ${JSON.stringify(req.body)}`)
        const result = await User.create({email, password:hash, name: `${firstName} ${lastName}` });
    
        const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });
    
        res.status(200).json({ result, token });
        
    } catch (error) {
        res.status(500).json({message:'something went wrong'});
        console.log(error)
    }
};

