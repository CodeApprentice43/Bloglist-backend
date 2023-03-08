require('dotenv').config()
const { response,request } = require('express')
const { resource } = require('../app')
const blogsRouter=require('express').Router()
const Blog=require('../models/blogs')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const date= new Date()
blogsRouter.get('/info',async (request,response)=>{
  const count = await Blog.countDocuments({})
    response.send(`<p>The blogsite has ${count} blogs
    <br></br>
    ${date}</p>`)
   
  })
 
blogsRouter.post('/',async(request,response)=>{
  const body = request.body

    if(!body.title||!body.url){
      return response.status(400).json({error:'missing fields'})
     }
    const decodedToken =  jwt.verify(request.token,process.env.SECRET)
    const user = request.user
   if(!decodedToken.id)
    {
      response.status(401).json({error:'invalid token'})
    }
   
     const blog = new Blog({
      title:body.title,
      url:body.url,
      author:user.name,
      likes: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id',async(request,response)=>{

  let blogobejct = request.body
  let modifiedBlog = {...blogobejct,user:request.token.id}
  modifiedBlog = await Blog.findByIdAndUpdate(request.params.id,modifiedBlog, {new:true,runValidators:true,context:'query'})
  response.json(modifiedBlog)

})

blogsRouter.get('/',async(request,response)=>{
  const blogs = await Blog.find({}).populate('user',{username:1,name:1})
  response.json(blogs)
})

blogsRouter.get('/:id',async(request,responose)=>{
    const blog = await Blog.findById(request.params.id)
    responose.json(blog)
})


blogsRouter.delete('/:id',async(request,response)=>{
 
  const user = request.user
  const id = request.params.id

  const blog = await Blog.findById(id)

  if(user._id.toString() === blog.user.toString())
  {
    await Blog.findByIdAndDelete(id)
    response.status(201).end()
  }
  else {
    return response.status(401).json({error:'unauthorized'})
  }
})



module.exports=blogsRouter

