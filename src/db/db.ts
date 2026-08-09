import mongoose, { mongo } from "mongoose";

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
    },
    {
        timestamps: true,
    }
);


const questionSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this question
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Question title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Coding platform
    platform: {
      type: String,
      enum: ["LeetCode", "Codeforces", "CodeChef", "AtCoder", "GeeksforGeeks", "Other"],
      required: true,
    },

    // Direct link to the problem
    problemLink: {
      type: String,
      required: true,
      trim: true,
    },

    // Difficulty level
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // Main topic
    topic: {
      type: String,
      required: true,
      trim: true,
    },

    // Sub-topic (optional)
    subtopic: {
      type: String,
      default: "",
      trim: true,
    },

    // User's personal notes
    notes: {
      type: String,
      default: "",
      trim: true,
    },

    // Key intuition behind the solution
    intuition: {
      type: String,
      default: "",
      trim: true,
    },

    // Current revision status
    status: {
      type: String,
      enum: ["Pending", "Learning", "Revising", "Mastered"],
      default: "Pending",
    },

    // Current revision stage (0 → 1 → 2 → ...)
    revisionLevel: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Next scheduled revision
    nextRevisionDate: {
      type: Date,
      default: null,
    },

    // Last revision date
    lastRevisionDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const revisonSchema = new mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user",
    require : true
  },
  questionId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "question",
    require : true
  },
  revisonLevel : {
    type : Number,
    require : true
  },
  completedAt : {
    type : Date,
    default : Date.now
  }
},
{
  timestamps : true
}
);


export const user = mongoose.model("user",userSchema);
export const question = mongoose.model("question",questionSchema);
export const revision = mongoose.model("revision",revisonSchema);