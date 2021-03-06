const express = require('express')
const cors = require('cors')
var PingRouter = require('./controllers/PingRouter')
var RoomRouter = require('./controllers/Room')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/', PingRouter)
app.use('/room', RoomRouter)

module.exports = app