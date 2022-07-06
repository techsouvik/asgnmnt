const express = require('express')
const app = express()

const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')

const ejs = require('ejs')
app.set('view engine', 'ejs')
app.use(bodyparser.urlencoded({
     extended:true
}))

PORT = process.env.PORT || 3000
dotenv.config()

//Connect to DB
mongoose.connect( process.env.db_url, { useNewUrlParser : true }, ()=>{
     console.log("Connected to DB");
})

//Middleware
app.use(express.json())
app.use(express.static('public'))

//routes
app.get('/', async(req, res) => {
    const users = await User.find()
    console.log(users)
    res.render("index",{users:users})
})

app.post('/register', async(req, res) => {
  console.log(req.body)
  const user = new User()
    user.name = req.body.cname,
    user.email = req.body.email
    user.save(()=>{
      console.log(user)
      res.redirect('/')
    })
})

app.get('/delete/:id', async(req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  res.redirect('/')
})
app.get('/getUser/:id', async(req, res) => {
  const user = await User.findById(req.params.id)
  res.render('update',{user:user})
})
app.post('/update', async(req, res) => {
  console.log(req.body)
  const user = await User.findByIdAndUpdate(req.body.id,{name:req.body.cname,email:req.body.email})
  res.redirect('/')
})

app.listen(PORT, () => {
  console.log('listening on port '+PORT)
})