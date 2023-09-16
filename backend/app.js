const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json)
app.use(bodyParser.urlencoded)

const PORT = 8000
app.listen(PORT, ()=>{
    console.log(`Listening at ${PORT}`)
})
