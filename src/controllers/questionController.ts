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
        const {
            search,
            topic,
            difficulty,
            platform,
            status,
            page,
            limit,
        } = req.query;

        const currentPage = Number(page) || 1;
        const pageLimit = Number(limit) || 10;
        if (currentPage < 1 || pageLimit < 1) {
            return res.status(400).json({
                message: "Page and limit must be greater than 0",
            });
        }

        const filter: any = { userId };

        if (search) {
            filter.title = {
                $regex: String(search),
                $options: "i",
            };
        }

        if (topic) {
            filter.topic = String(topic);
        }

        if (difficulty) {
            filter.difficulty = String(difficulty);
        }

        if (platform) {
            filter.platform = String(platform);
        }

        if (status) {
            filter.status = String(status);
        }

        const skip = (currentPage - 1) * pageLimit;
        const sortOption = { createdAt: -1 as const };

        const totalQuestions = await question.countDocuments(filter);
        const questions = await question
            .find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(pageLimit);

        const totalPages = Math.ceil(totalQuestions / pageLimit);

        return res.status(200).json({
            message : "Your Questions are as followed",
            count : questions.length,
            data : questions,
            pagination: {
                currentPage,
                limit: pageLimit,
                totalQuestions,
                totalPages,
            },
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error and Backend Failure!"
        });
    }
};

export const getOneQuestion = async(req : Request, res: Response) => {
    try{
        const userId = (req as any).userId;
        const questionId = req.params.id;
        const existingQuestion = await question.findOne({
            _id : questionId,
            userId
        });
        if(!existingQuestion){
            return res.status(400).json({
                message : "This question is not found"
            });
        }
        return res.status(200).json({
            message : "The Question is",
            data : existingQuestion
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error and BackeEnd Failure!"
        });
    }
};

export const updateQuestion = async(req : Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const questionId = req.params.id;
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

        const existingQuestion = await question.findOne({
            _id : questionId,
            userId
        });

        if(!existingQuestion){
            return res.status(400).json({
                message : "The question is not found!"
            });
        }

        existingQuestion.title = title ?? existingQuestion.title;
        existingQuestion.platform = platform ?? existingQuestion.platform;
        existingQuestion.problemLink = problemLink ?? existingQuestion.problemLink;
        existingQuestion.difficulty = difficulty ?? existingQuestion.difficulty;
        existingQuestion.topic = topic ?? existingQuestion.topic;
        existingQuestion.subtopic = subtopic ?? existingQuestion.subtopic;
        existingQuestion.notes = notes ?? existingQuestion.notes;
        existingQuestion.intuition = intuition ?? existingQuestion.intuition;

        await existingQuestion.save();

        return res.status(200).json({
            message : "The Updates are executed SuccessFully!",
            data : existingQuestion
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error and BackEnd Failure!"
        });
    }
};

export const deleteQuestion = async(req : Request,res : Response) => {
    try{
        const userId = (req as any).userId;
        const questionId = req.params.id;
        const existingQuestion = await question.findOne({
            _id : questionId,
            userId
        });
        if(!existingQuestion){
            return res.status(400).json({
                message : "Question with this id not found!"
            });
        }
        await question.findByIdAndDelete(questionId);
        return res.status(200).json({
            message : "Question Deleted Successfully!"
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error or Backend Failure!"
        });
    }
};

