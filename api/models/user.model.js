import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthday: { 
        type: Date, 
        required: false 
    },
    isActivate: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    avatar:{
      type: String,
      default: "https://scontent.fhan20-1.fna.fbcdn.net/v/t1.15752-9/250510336_616776576166119_4735492534877987506_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=MbVR_IVKxXEAX8Smse2&_nc_ht=scontent.fhan20-1.fna&oh=03_AdQl9RSdg4IFbBMpGt5IQxQbdcfDrmqYj8Ao86O9oSYy6w&oe=654E3679",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
