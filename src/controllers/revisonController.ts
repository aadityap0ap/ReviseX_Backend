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

export const getQuestions = async(req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const{
            search,
            topics,
            difficulty,
            platform,
            status
        } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if(page < 1 || limit < 1){
            return res.status(400).json({
                message : "Page and limit must be greater than 0"
            });
        }

        const filter : any =  {
            userId
        }

        if(search){
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if(topics){
            filter.topics = topics
        }

        if(difficulty){
            filter.difficulty = difficulty
        }

        if(platform){
            filter.platform = platform
        }

        if(status){
            filter.status = status
        }

        const skip = (page - 1) * limit;
        const sortOption = {
            createdAt : -1 as const
        };

        const totalQuestions = await question.countDocuments(filter);
        const questions = await question
        .find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit);
        
        const totalPages = Math.ceil(totalQuestions / limit);

        return res.status(200).json({
            message : "Message Fetched Successfully",
            data : questions,
            pagination :{
                currentPage : page,
                limit : limit,
                totalQuestions : totalQuestions,
                totalPages : totalPages
            }
        });

    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || Backend Crashed"
        });
    }
}