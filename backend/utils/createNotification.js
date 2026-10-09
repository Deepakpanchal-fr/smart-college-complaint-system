const Notification=require("../models/Notification");module.exports=async({user,title,message,type,complaint=null})=>Notification.create({user,title,message,type,complaint});
