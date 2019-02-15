const express = require('express')
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')
const cors = require('cors')
const mongoConnect = require('./util/database').mongoConnect
const path = require('path')

const app = express()

app.use(bodyParser.json())

/** Configures CORS **/
app.use(cors())

/** Configures routes **/
app.use('/api', indexRoutes)
app.use('/api/images', express.static(path.join(__dirname, 'assets/images')))

/** Error handling **/
app.use((error, req, res, next) => {
  console.error(error)
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).json({ message: message })
})

app.listen(3000, () => {
  console.log('Node up and running in port 3000')
})

mongoConnect(() => {
  const server = app.listen(8080)
  server.listen(8080)
})
