import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    status: {
      type: String,
      default: "active",
    },
    avatar: {
      type: String,
      default:
        "https://scontent.fhan20-1.fna.fbcdn.net/v/t1.15752-9/250510336_616776576166119_4735492534877987506_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=MbVR_IVKxXEAX8Smse2&_nc_ht=scontent.fhan20-1.fna&oh=03_AdQl9RSdg4IFbBMpGt5IQxQbdcfDrmqYj8Ao86O9oSYy6w&oe=654E3679",
    },
    trophy: {
      type: Number,
      required: false,
      default: 0,
    },
    ktpoint: {
      type: Number,
      required: false,
      default: 0,
    },
    phone: {
      type: String,
      required: false,
      default: "1234567890",
      validate: {
        validator: function (value) {
          // Use a regular expression to validate the phone number format
          const phoneRegex = /^\d{10}$/; // 10-digit phone number
          return phoneRegex.test(value);
        },
        message: "Invalid phone number format. Please enter a 10-digit number.",
      },
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
