
const supertest= require('supertest')
const app = require('../app')
const Blog= require('../models/blogs')
const api = supertest(app)
const mongoose = require('mongoose')
const config = require('../utils/config')
const initialBlogs=[
    {
        title: 'How to test api using JEST and supertest',
        author: 'Nafis',
        url: 'http://wwww.test.com',
        likes: '1'
    },
    {
        title: 'How to test api using JEST and supertest part-2',
        author: 'Nafis', 
        url: 'http://wwww.test/part2.com',
        likes: '6'
    }

]
beforeEach(async()=>{
    await mongoose.connect(config.MONGODB_URI)
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog=>new Blog(blog))
    const promises =  blogObjects.map(blog=>blog.save())
    await Promise.all(promises)
})
afterEach(async () => {
    await mongoose.connection.close();
  });

describe('fetching existing blogs',()=>{
    test('all the initial blogs are present in the db ',async()=>
{
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
})
    test('expect id property of blog to be valid',async()=>{
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
})
    test('fetching a specific blog',async()=>{
        const response = await api.get('/api/blogs')
        const blogtoView = response.body[0]

        const blog = await 
        api
        .get(`/api/blogs/${blogtoView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(blog.body).toEqual(blogtoView)
    })

   
})

describe('posting blog',()=>{

    test('with valid properties',async()=>{
        const blog={
            title:'test blog',
            author: 'John Doe',
            url: 'www.web.com',
            likes:'1000'
        }
        await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
    
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(initialBlogs.length+1)
    })
    
    test(' with invalid properties',async()=>{
        const blog={
            title:'',
            author: 'John Doe',
            url: '',
            likes:'1000'
        }
        await api
        .post('/api/blogs')
        .send(blog)
        .expect(400)
    })
})

describe('deleting a blog',()=>{
    test('deleting',async()=>{
        const response = await api.get('/api/blogs')
        const blogtoDelete = await response.body[0]
    
       await  api
        .delete(`/api/blogs/${blogtoDelete.id}`)
        .expect(202)
    
        const aferDeletion = await api.get('/api/blogs')
        expect(aferDeletion.body).toHaveLength(initialBlogs.length-1)
    },100000)
})

describe('updating a blog',()=>{
    test('updating a blog',async()=>{
        const beforeUpdate = await api.get('/api/blogs')
        const blogtoUpdate = beforeUpdate.body[0]
    
        const updatelikes = {
            likes: '100'
        }
        await api
        .put(`/api/blogs/${blogtoUpdate.id}`)
        .send(updatelikes)
        
        const afterUpdate = await api.get('/api/blogs')
        expect(afterUpdate.body[0].likes).toBe(100)
    })
})

afterAll(async()=>{
    await mongoose.connection.close()
 },100000)