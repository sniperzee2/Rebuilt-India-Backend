const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const {connectDB} = require('./config/db')
require('dotenv').config()

const app = express()

connectDB()
app.use(morgan('dev'))

app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(express.json())

// ROUTES
app.use('/images', express.static(path.join(__dirname + '/Images')));

app.use('/api/services', require('./routers/servicesRouter'))
app.use('/api/rates', require('./routers/rateRouter'))
app.use('/api/subservices', require('./routers/subservicesRouter'))
app.use('/api/faqs', require('./routers/faqRouter'))
app.use('/api/categories', require('./routers/categoryRouter'))
app.use('/api/blogs', require('./routers/blogRouter'))
app.use('/api/problems', require('./routers/commonProblemsRouter'))
app.use('/api/companyFAQs', require('./routers/companyFaqRouter'))
app.use('/api/users', require('./routers/userRouter'))
app.use('/api/bookings', require('./routers/bookingRouter'))
app.use('/api/admins', require('./routers/adminRouter'))
app.use('/api/cart', require('./routers/cartRouter'))

//Forms
app.use('/api/contactForms', require('./routers/contactFormRouter'))
app.use('/api/partnerForms', require('./routers/partnerFormRouter'))
app.use('/api/coorporateForms', require('./routers/coorporateFormRouter'))

const port = process.env.PORT || 8000
app.listen(port,() => {
  console.log(`Server running on PORT ${port}`)
})