const express = require('express')
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')
const cors = require('cors')


const app = express()

app.use(bodyParser.json())

/** Configures CORS **/
app.use(cors())

/** Configures routes **/
app.use('/api', indexRoutes)

app.listen(3000, () => {
  console.log('Node up and running in port 3000')
})
