const express = require('express')
const path = require('path')
const routes = require('./router/router')
const app = express()
const port = 3000

app.use('/public', express.static('public'))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.use(express.json())
app.use('', require('./router/router'))


app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})