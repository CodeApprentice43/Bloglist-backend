require('dotenv').config()
const config=require('./utils/config')
require('express-async-errors')
const express=require('express')
const app=express()
const logger=require('./utils/logger')
const blogsRouter=require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware=require('./utils/middleware')
const cors=require('cors')
const mongoose=require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URI).then(()=>{
    logger.info('Connected to db')
})
.catch(error=>{
    logger.error('Failed to connect to db')
})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs',middleware.userExtractor,blogsRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)
app.use(middleware.handleUnknown)
app.use(middleware.errorHandler)

module.exports=app
