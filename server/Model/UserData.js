const mongoose=require('mongoose')
const ProductSchema=new mongoose.Schema({
    vendor:Boolean,
    company:String,
    name:String,
    email:String,
    mobilenumber:String,
    password:String,
    isOtpVeryfied:Boolean,
   
})

module.exports=mongoose.model('userInfos',ProductSchema)

