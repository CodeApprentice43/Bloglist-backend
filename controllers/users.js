const usersRouter = require('express').Router()
const { response } = require('../app')
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/',async(request,response,next)=>{
    const {name,username,password} = request.body

    if(password.length<3){
       return response.status(401).json({error:'Password too short'})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds)
    const user = new User ({
        name,
        username,
        passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)

})

usersRouter.get('/',async(request,response)=>{
    const users = await User.find({}).populate('blogs',{title:1,author:1,url:1,likes:1})
    response.json(users)
})

module.exports = usersRouter