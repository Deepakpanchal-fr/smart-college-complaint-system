const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 complaint:{type:mongoose.Schema.Types.ObjectId,ref:"Complaint",required:true,unique:true},
 student:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 rating:{type:Number,required:true,min:1,max:5},
 comment:{type:String,trim:true,maxlength:1000}
},{timestamps:true});
module.exports=mongoose.model("Feedback",schema);
