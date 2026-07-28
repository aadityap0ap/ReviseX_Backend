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
    }
})

export const user = mongoose.model("user",userSchema);