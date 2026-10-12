const userModel=require('../model/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

async function registerUser(req,res){
    const {userName,email,password}=req.body

    const isUser= await userModel.findOne({
        $or: [
            {userName:userName},
            {email:email}
        ]
    })

    if(isUser){
        return res.status(409).json({
            message: "User Already Exists"
        })
    }

    const hash=await bcrypt.hash(password,10)
    
    const user= await userModel.create({
        userName,
        email,
        password:hash
    })

    const token= jwt.sign({
        _id:user._id,
        email:user.email
    },process.env.jwtsecret_Key)

    res.cookie("token",token)

    res.status(201).json({
        message:"Registered Successfully",
        user:{
            id:user._id,
            userName:user.userName,
            email:user.email
        }
    })
}

async function loginUser(req,res){
    const {userName,email,password}=req.body

    const user=await userModel.findOne({
        $or:[
            {userName:userName},
            {email:email}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:"Invalid Credentials",
        })
    }

    const validPass= await bcrypt.compare(password,user.password)

    if(!validPass){
        return res.status(401).json({
            message:"Invalid Credentials"
        })
    }
    const token=jwt.sign({
        id:user._id,
        role:user.role
    },process.env.jwtsecret_Key)

    res.cookie("token",token)
    res.status(201).json({
        message:"LoggedIn Successfully",
        user:{
            _id:user._id,
            userName:user.userName,
            email:user.email,
            role:user.role
        }
    })   
}

async function logoutUser(req,res){
    res.clearCookie("token")
    return res.status(200).json({
        message:"User loggedOut Successfully"
    })
}
module.exports={registerUser,loginUser,logoutUser}