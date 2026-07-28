import { Request, Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { user } from "../db/db";

export const signup = async (req: Request, res: Response) => {
    try {
        const { email, username, password } = req.body;

        const existingUser = await user.findOne({email});

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await user.create({
            email,
            username,
            password: hashedPassword
        });

        res.status(200).json({
            message : "You are signed Up!"
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

export const signin = async (req: Request, res: Response) => {
    try{
        const {email,password} = req.body;
        const existingUser = await user.findOne({email});
        if(!existingUser){
            return res.status(401).json({
                message : "User With this Email does not exist!"
            });
        }

        const match = await bcrypt.compare(
            password,
            existingUser.password as string
        )

        if(!match){
            return res.status(401).json({
                message : "Wrong Password!"
            });
        }

        const token  = jwt.sign(
            {id : existingUser._id},
            process.env.JWT_USER_PASSWORD as string
        );

        return res.status(200).json({
            message : "You are Signed In",
            token
        })
    }catch(err){
        res.status(500).json(err);
    }
}