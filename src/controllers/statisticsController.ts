import { Request,Response } from "express";
import { question, revisionHistory, user } from "../db/db";



// "totalRevisions":143,
//     "totalQuestions":52,
//     "masteredQuestions":17,
//     "averageRevisionsPerDay":4.2,
//     "currentStreak":8,
//     "longestStreak":21
export const getStatistics = async (req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const existingUser = await user.findById(userId);
        if(!existingUser){
            return res.status(404).json({
                message : "User not Found!"
            });
        }

        const totalQuestions = await question.countDocuments({userId});
        const masteredQuestions  = await question.countDocuments({
            userId,
            status : "Mastered"
        });
        const totalRevisions = await revisionHistory.countDocuments({userId});
        const longestStreak = existingUser.highestStreak;
        const currentStreak = existingUser.currentStreak;

        let averageRevisionsPerDay = 0;
        if(totalRevisions > 0){
            //find the first revision
            const firstRevision = await revisionHistory
            .findOne({userId})
            .sort({completedAt : 1});

            if(firstRevision){
                const firstDate = new Date(firstRevision.completedAt);
            const today = new Date();
            //diff in miliseconds
            const diff = today.getTime() - firstDate.getTime();
            //convert miliseconds into days
            const days =Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
            averageRevisionsPerDay = Number((totalRevisions / days).toFixed(2));
            }
        }
        return res.status(200).json({
            totalQuestions,
            masteredQuestions,
            totalRevisions,
            averageRevisionsPerDay,
            longestStreak,
            currentStreak
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || Backend Crashed"
        });
    }
}


