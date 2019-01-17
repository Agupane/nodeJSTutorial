const express = require('express')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

app.use(bodyParser.urlencoded({extended: false}))

app.use(adminRoutes)
app.use(shopRoutes)

app.get('/',(req, res, next) => {
    console.log("In the middleware ")
    res.send('<h1>Hello from Express!</h1>')
})

app.listen(3000)