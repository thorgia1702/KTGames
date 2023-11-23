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
        "https://firebasestorage.googleapis.com/v0/b/ktgames-29a1d.appspot.com/o/1700723783045DALL%C2%B7E%202023-11-23%2014.15.55%20-%20Design%20an%20avatar%20for%20a%20gaming%20company%20named%20KTGAMES%2C%20incorporating%20elements%20that%20reflect%20video%20gaming%20culture.%20The%20avatar%20should%20be%20vibrant%2C%20inviting%2C.pngp3zyot0b?alt=media&token=1af5871d-496d-46f8-bdcd-c4ea94e88398",
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
