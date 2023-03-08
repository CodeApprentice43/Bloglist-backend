const config=require('./utils/config')
const app=require('./app')
const logger=require('./utils/logger')



app.listen(3003, () => {
 logger.info(`Server running on port ${config.PORT}`)
})
