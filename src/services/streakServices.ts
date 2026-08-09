import { revisionHistory, user } from "../db/db"

export const updateUserStreak = async(userId : string) => {
    //get all the revision history of the user
    const history = await revisionHistory
    .find({userId})
    .select("completedAt")
    .sort({completedAt : 1});
    //if the user has never done or completed revision 
    //then update currentStreak,longestStreak,completedAt all to 0
    if(history.length === 0){
        await user.findByIdAndUpdate(userId,
            {
                currentStreak : 0,
                highestStreak : 0
        });

        return{
            currentStreak : 0,
            longestStreak : 0,
            completedToday : 0
        };
    }

    //we dont care how many question a user had revised on a particluar day.
    //we only need no of active days on which the user had revised at least one question for streak calculation
    //thats why we are storing the dates in set for uniqueness
    const uniqueDates = new Set<string>();
    for(const revised of history){
        const date = revised.completedAt;
        // Convert date into YYYY-MM-DD.
        const dateString = date.toISOString().split("T")[0];
        uniqueDates.add(dateString);
    }

    //to find the longest streak we need to store the dates in sorted array
    //so that we can calculate longest streak
    const dates = Array.from(uniqueDates).sort();

    //to calculate longeststreak we compare every date with prev date
    //If:Aug 2 - Aug 1 = 1 day,then the streak continues.
    // If: Aug 5 - Aug 3 = 2 days then there was a break.
    let currentStreak  = 1;
    let longestStreak = 1;
    for(let i = 1;i<dates.length;i++){
        const currentDate = new Date(dates[i]);
        const prevDate = new Date(dates[i-1]);
        
        const difference =
        (currentDate.getTime() - prevDate.getTime()) /(1000 * 60 * 60 * 24);
        //we are dividing this difference with this 1000*60*60*24 because difference will give the op in miliseconds and we want it in days for streak

        //if(diff is 1 it means there is consecutiveness bw currentDate and prevDate)
        if(difference === 1){
            currentStreak++;
            longestStreak = Math.max(currentStreak,longestStreak);
        }
        else{
            //there is a gap so change the currentStreak to 1;
            currentStreak  = 1;
        }
    }

    //find currentStreak
    //we will start finding it from the most recent revision date
    //We start from the most recent revision date and move backwards.
    const today = new Date();
    today.setHours(0,0,0,0);
    //get todays date
    const todayString = today.toISOString().split("T")[0];
    //to start from today we will count the no of revisions done today
    //we count revisionHistory enteries whose completedAt belongs to today
    const startOfToday = new Date(today);
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);
    const completedToday = await revisionHistory.countDocuments({
        userId,
        completedAt: {
            $gte: startOfToday,
            $lte: endOfToday
        }
    });
    //if the user had not revised today then the current streak will become 0
    let currStreak = 0;
    if(uniqueDates.has(todayString)){
        currStreak = 1;
        //now keep checking and moving backwards one day at a time
        let checkDate = new Date(today);
        while(true){
            checkDate.setDate(checkDate.getDate() - 1);
            const checkDateString = checkDate.toISOString().split("T")[0];
            if(uniqueDates.has(checkDateString)){
                currStreak++;
            }
            else{
                break;
            }
        }
    }
       //Save the calculated values in User.
       //RevisionHistory remains the source of truth.
       // These values are stored in User so that
       // Dashboard can retrieve them quickly.
       await user.findByIdAndUpdate(userId,{
        currentStreak: currStreak,
        highestStreak : longestStreak
       });

       return{
        currStreak,
        longestStreak,
        completedToday
       }
}