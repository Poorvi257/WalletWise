const express = require('express')
const bodyParser = require('body-parser')
const routes = require("./routes/index");
const initDb = require('./database');

const app = express();

app.use(bodyParser.json())  
app.use(bodyParser.urlencoded({ extended: true }))  

app.use('/', routes)

const PORT = 8000

app.listen(PORT, async () => {
    console.log(`Listening at ${PORT}`)
    try {
        await initDb();
        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
})

