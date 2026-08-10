import { Request,Response } from "express";
import { question, revisionHistory } from "../db/db";
import { REVISION_INTERVALS } from "../utils/revisonIntervals";
import {updateUserStreak} from "../services/streakServices";

export const reviseQuestion = async(req:Request,res:Response) => {
    try{
    const userId = (req as any).userId;
    const questionId = req.params.id;

    const existingQuestion = await question.findOne({
        _id : questionId,
        userId
    });

    if(!existingQuestion){
        return res.status(404).json({
            message : "Question Not found!"
        });
    }

   let currentLevel = existingQuestion.revisionLevel;
    
    if(currentLevel < REVISION_INTERVALS.length- 1 ){
        currentLevel++;
    }

    const today = new Date();
    const nextRevision = new Date(today);
    nextRevision.setDate(
        nextRevision.getDate() + REVISION_INTERVALS[currentLevel]
    );

    existingQuestion.revisionLevel = currentLevel;
    existingQuestion.lastRevisionDate = today;
    existingQuestion.nextRevisionDate = nextRevision;

    if(currentLevel === REVISION_INTERVALS.length - 1){
        existingQuestion.status = "Mastered";
    }
    else{
        existingQuestion.status = "Revising";
    }

    await existingQuestion.save();

    const history = await revisionHistory.create({
        userId,
        questionId : existingQuestion._id,
        revisonLevel : currentLevel,
        completedAt : today
    });

    const streak =  await updateUserStreak(userId);

    return res.status(200).json({
        message : "Revison Done Successfully!",
        data : existingQuestion,
        history
    });
}
catch(error){
    return res.status(500).json({
        message : "Internal Server Error || BackEnd Crashed!"
    });
}
}


export const getTodaysRevision = async(req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const today = new Date();
        // Find all questions that are due
        // for revision today or are overdue
        const revisions = await question.find({
            userId,
            nextRevisionDate: {
                $lte: today
            }
        }).sort({
            nextRevisionDate: 1
        });
        return res.status(200).json({
            message : "The questions to be revisied!",
            count: revisions.length,
            data : revisions
        });

    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || BackEnd Crashed"
        });
    }
}

export const getRevisionHistory = async (req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        
        const history = await revisionHistory
            .find({ userId })
            .sort({
                completedAt: -1
            });

        return res.status(200).json({
            message : "The revison history as follows!",
            count : history.length,
            data : history
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || Backend Crashed!"
        })
    }
}