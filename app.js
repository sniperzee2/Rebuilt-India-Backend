const express = require('express')
const morgan = require('morgan')
const path = require('path')
const {connectDB} = require('./config/db')
require('dotenv').config()

const app = express()

connectDB()
app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

// ROUTES
app.use('/images', express.static(path.join(__dirname + '/Images')));

app.use('/api/services', require('./routers/servicesRouter'))
app.use('/api/subservices', require('./routers/subservicesRouter'))
app.use('/api/faqs', require('./routers/faqRouter'))
app.use('/api/blogs', require('./routers/blogRouter'))
app.use('/api/forms', require('./routers/formRouter'))

const port = process.env.port || 8000
app.listen(port, () => {
  console.log(`Server running on PORT ${port}`)
})