import { Request,Response } from "express";
import { revisionHistory } from "../db/db";

export const getRevisionCalender = async(req:Request,res:Response) => {
    try{
        const userId = (req as any).userId;
        const year = Number(req.query.year) || new Date().getFullYear();
        const startDate = new Date(year,0,1);
        const endDate = new Date(year+1,0,1);

        const history = await revisionHistory.find({
            userId,
             completedAt: {
                $gte: startDate,
                $lt: endDate
            }
        }).select("completedAt")

        const calendar: Record<string, number> = {};
        for (const revision of history) {
            const date = new Date(revision.completedAt);
            const dateString = date.toISOString().split("T")[0];
            if (calendar[dateString]) {
                calendar[dateString]++;
            } else {
                calendar[dateString] = 1;
            }
        }
        return res.status(200).json({
            message : "Calender Fetched Successfully!",
            year,
            data : calendar
        })
    }
    catch(error){
        return res.status(500).json({
            message : "Internal Server Error || Backend Crashed!"
        });
    }
}