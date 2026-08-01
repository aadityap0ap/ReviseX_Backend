import mongoose from "mongoose";

export async function ConnectDB() {
    await mongoose.connect(process.env.MONGO_URL!);
}

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        unique : true,
        require : true
    },

    username : {
        type : String,
        require : true
    },

    password : {
        type : String,
        require : true
    },
    //this will give the total number of question added by the user
    totalQuestions : {
            type : Number,
            default : 0
    },
    //no of question that completed the last revision stage
    masteredQuestions : {
        type : Number,
        default : 0
    },
    //the longest no of days the user had solved at least one question
    currentStreak : {
        type : Number,
        default : 0
    },
    //highest streak achieved by the user
    highestStreak : {
        type : Number,
        default : 0
    }
});

export const user = mongoose.model("user",userSchema);