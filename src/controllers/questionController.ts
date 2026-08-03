import { Request,Response } from "express";
import { question, user } from "../db/db";

export const addQuestion  = async(req: Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const {
            title,
            platform,
            problemLink,
            difficulty,
            topic,
            subtopic,
            notes,
            intuition
        } = req.body;
        if(!title || !platform || !problemLink || !difficulty || !topic){
            return res.status(400).json({
                message : "Please Provide all the necessary fields"
            });
        }
        const duplicateQuestion = await question.findOne({
            userId,
            title,
            platform
        });
        if(duplicateQuestion){
            return res.status(400).json({
                message : "Question Already Exists"
            });
        }
        const Question = await question.create({
            userId,
            title,
            platform,
            problemLink,
            difficulty,
            topic,
            subtopic,
            notes,
            intuition
        });
        return res.status(200).json({
            message : "Question added Successfully!",
            data : Question
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error and BackeEnd Failure"
        });
    }
};

export const allQuestions = async(req : Request, res : Response) => {
    try{
        const userId = (req as any).userId;
        const Questions = await question.find({userId});
        return res.status(200).json({
            message : "Your Questions are as followed",
            count : Questions.length,
            data : Questions
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error and Backend Failure!"
        })
    }
}

