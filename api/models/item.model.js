import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            require: true,
        },
        description:{
            type: String,
            require: true,
        },
        point:{
            type: Number,
            require: true,
        },
        img: {
            type: String,
            default:
              "https://scontent.fhan20-1.fna.fbcdn.net/v/t1.15752-9/250510336_616776576166119_4735492534877987506_n.png?_nc_cat=100&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=MbVR_IVKxXEAX8Smse2&_nc_ht=scontent.fhan20-1.fna&oh=03_AdQl9RSdg4IFbBMpGt5IQxQbdcfDrmqYj8Ao86O9oSYy6w&oe=654E3679",
          },
    }, {timestamps: true}
)

const Item = mongoose.model('Item', itemSchema);
export default Item;