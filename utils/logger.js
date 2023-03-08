require('dotenv').config()

const info=(...message)=>{
    if(process.env.NODE_ENV!=='test'){
    console.log(message)
    }
}

const error=(...message)=>{
    if(process.env.NODE_ENV!=='test'){
    console.log(message)
    }
}

module.exports={
    info,
    error
}