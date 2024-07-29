//Color schema
const mongoose=require("mongoose");
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  product:{
    type:[mongoose.Schema.Types.ObjectId]
  },
  hexcode:{
    type:String,
    default:'#000000'
  }
  },
  { timestamps: true }
);

const Color = mongoose.model("Color", ColorSchema);

module.exports=Color;
