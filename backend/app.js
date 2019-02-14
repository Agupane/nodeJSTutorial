const express = require('express')
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')

const app = express()

app.use(bodyParser.json())

/** Configures routes **/
app.use('/api', indexRoutes)

app.listen(3000)
