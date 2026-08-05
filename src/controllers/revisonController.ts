import { Request,Response } from "express";
import { question } from "../db/db";
import { REVISION_INTERVALS } from "../utils/revisonIntervals";

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

    return res.status(200).json({
        message : "Revison Done Successfully!",
        data : existingQuestion
    });
}
catch(error){
    return res.status(500).json({
        message : "Internal Server Error || BackEnd Crashed!"
    });
}
}