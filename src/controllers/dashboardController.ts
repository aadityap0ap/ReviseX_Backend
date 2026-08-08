import { Request,Response} from "express";
import { question, user } from "../db/db";

export const getDashboard = async(req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const currentUser = await user.findById(userId);
        if(!currentUser){
            return res.status(404).json({
                message : "User With this userId not found!"
            });
        }
        const today = new Date();
        //todays revison plus overdue revision
        const todayRevision = await question.countDocuments({
            userId,
            nextRevisionDate: {
                $lte: today
            }
        });
        //total question solved by the user
        const totalQuestions = await question.countDocuments({
            userId
        });
        //masterdQuestion 
        const mastered = await question.countDocuments({
            userId,
            status : "Mastered"
        });
        //currentStreak
        const currentStreak = currentUser.currentStreak;
        //longestStreak
        const longestStreak = currentUser.highestStreak;
        return res.status(200).json({
            data : {
                todayRevision,
                totalQuestions,
                completedToday:0,
                mastered,
                currentStreak,
                longestStreak

            }
        });
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || BackEnd Crashed!"
        });
    }
}