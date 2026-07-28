import {Router } from "express";
import { user } from "../db/db";
// import { User } from "../db/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { configDotenv } from "dotenv";
const router = Router();
//configDotenv();

router.post("/signUp",async(req,res) => {
    try{
        const {email,username,password} = req.body;
        const existingUser = await user.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message : "User with this email id exists!"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);

        user.create({
            email,
            username,
            password : hashedPassword
        });

        return res.status(200).json({
            message : "User SignedUp Successfully!"
        })
    }

    catch(error){
        return res.status(500).json({
            message : "BackEnd Crashed or Server Error!"
        })
    }
});

router.post("/signIn",async(req,res) => {
    try{
        const {email,password} = req.body;
        const currentUser = await user.findOne({email});
        if(!currentUser){
            return res.status(401).json({
                message : "User with this email id not found!"
            });
        }

        const match = await bcrypt.compare(
            password,
            currentUser.password as string
        );

        if(!match){
            return res.status(401).json({
                message : "Wrong Password!"
            });
        }

        const token = jwt.sign(
            {id : currentUser._id},
            process.env.JWT_USER_PASSWORD as string
        );

        return res.status(200).json({
            message : "You are Signed In!",
            token,
        });
    }
    catch(error){
        return res.status(500).json({
            message : "BackEnd Crashed or Server Error!"
        })
    }
})

export default router;