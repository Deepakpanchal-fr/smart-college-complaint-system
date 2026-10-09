const multer=require("multer"),path=require("path"),fs=require("fs");const dir=path.join(__dirname,"..","uploads");fs.mkdirSync(dir,{recursive:true});
const allowed=["image/jpeg","image/png","image/webp","application/pdf"];
const storage=multer.diskStorage({destination:(_r,_f,cb)=>cb(null,dir),filename:(_r,f,cb)=>cb(null,`${Date.now()}-${f.originalname.replace(/[^a-zA-Z0-9._-]/g,"_")}`)});
module.exports=multer({storage,fileFilter:(_r,f,cb)=>allowed.includes(f.mimetype)?cb(null,true):cb(new Error("Only JPG, PNG, WEBP and PDF files are allowed.")),limits:{fileSize:5*1024*1024}});
