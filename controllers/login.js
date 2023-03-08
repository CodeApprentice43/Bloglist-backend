require('dotenv').config()
const loginRouter = require('express').Router()
const { response } = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/',async(request,response)=>{
    const {username,password} = request.body
    const user = await User.findOne({username})

    const passwordCorrect = user===null?
    false: bcrypt.compare(password,user.passwordHash)

    if(!(passwordCorrect && user))
    {
        response.status(401).json({error:'invalid password/username'})
    }
    const personToken = {
        username:user.username,
        id:user._id
    }
    const token =  jwt.sign(personToken,process.env.SECRET,{expiresIn:60*60})

    response.status(201).send({token,username:user.username,name:user.name})

})

module.exports = loginRouter