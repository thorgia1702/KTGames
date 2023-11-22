import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: false,
    },
    address: {
      type: String,
      require: true,
      unique: false,
    },
    phone: {
      type: String,
      required: true,
      default: "1234567890",
      unique: false,
      validate: {
        validator: function (value) {
          // Use a regular expression to validate the phone number format
          const phoneRegex = /^\d{10}$/; // 10-digit phone number
          return phoneRegex.test(value);
        },
        message: "Invalid phone number format. Please enter a 10-digit number.",
      },
    },
    email: {
      type: String,
      require: true,
      unique: false,
    },
    productName: {
      type: String,
      require: true,
      unique: false,
    },
    orderDate: {
      type: String,
      require: true,
      unique: false,
    },
    orderStatus: {
      type: String,
      default: "user",
      unique: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
