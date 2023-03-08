require('dotenv').config()
const logger = require('./logger')
const{request,response}=require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
  }
  const handleUnknown=(request,response)=>{
    response.status(400).json({
        error:'request made to unknown route'
    })
  }

  const tokenExtractor = (request,response,next)=>{
    const authorization = request.get('authorization')
    if(authorization && authorization.startsWith('Bearer '))
    {
      request.token = authorization.replace('Bearer ','')
    }
    else{
      request.token =''
    }
    next()
  }
  const userExtractor = async (request,response,next)=>{
    if(request.token){
    const token = request.token
    const decodedtoken = jwt.verify(token,process.env.SECRET)
    const user = await User.findById(decodedtoken.id)
    request.user = user
    }
   
    next()
  }
  
  const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
          error: 'invalid token'
        })
    }
    else if (error.name === "JsonWebTokenError") {
      return response.status(401).json({ error: "invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return response.status(401).json({ error: "expired token" });
    }

    logger.error(error.message)
    next(error)
}
  
   

module.exports = {
  requestLogger,
  handleUnknown,
  errorHandler,
  tokenExtractor,
  userExtractor
}
