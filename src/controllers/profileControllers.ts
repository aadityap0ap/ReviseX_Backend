import { Request,Response } from "express";
import { user } from "../db/db";

export const getProfile = async(req : Request, res: Response) => {
    try{
        const userId = (req as any).userId;
        const currentUser = await user.findById(userId);
        if(!currentUser){
            return res.status(404).json({
                message : "User with this userid doesnot found!"
            });
        }
        return res.status(200).json({
            message : "User Details are!",
            currentUser
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
};