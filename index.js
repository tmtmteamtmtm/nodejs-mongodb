const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const expressSession = require('express-session')
const flash = require('connect-flash')

//MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.1piafic.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true
})

global.loggedIn = null

//Controllers
const indexController = require('./controllers/indexController')
const loginController = require('./controllers/loginController')
const registerController = require('./controllers/registerController')
const storeUserController = require('./controllers/storeUserController')
const loginUserController = require('./controllers/loginUserController')
const logoutController = require('./controllers/logoutController')
const homeController = require('./controllers/homeController')

const newLocal = './middleware/redirectIfAuth'
//Middleware
const redirectIfAuth = require('./middleware/redirectIfAuth')
const authMiddleware = require('./middleware/authMiddleware')

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node scret"
}))
app.use("*",(req, res, next) => {
    loggedIn = req.session.userId
    next()
})
app.set('view engine', 'ejs')

app.get('/', indexController)
app.get('/home', authMiddleware,redirectIfAuth, homeController)
app.get('/login', redirectIfAuth, loginController)
app.get('/register', redirectIfAuth, registerController)
app.post('/user/register', redirectIfAuth, storeUserController)
app.post('/user/login', redirectIfAuth, loginUserController)
app.get('/logout', logoutController)

app.listen(8000, () => {
    console.log("App listening on port 8000")
})