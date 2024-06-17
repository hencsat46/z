const express = require('express')
const methods = require('methods')
const path = require('path')
const router = express.Router()
const cors = require('cors')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const mongo = require('mongoose')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const fs = require('fs')
const { render } = require('ejs')

const app = express()
const upload = multer()
app.use(express.json())
app.use(upload.array())
app.use(cookieParser(process.env.cookie_secret))
dotenv.config()
mongo.connect(process.env.mongo_url)
const db = mongo.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log("Connected to mongodb"))


authCors = {
    origin: 'http://localhost:3000/login',
    origin: 'http://localhost:3000/signup',
    methods: 'POST',
}

mainCors = {
    origin: 'http://localhost:3000/',
    methods: 'GET',
}

router.get('/', async (req, res) => {
    const data = await db.collection('products').find().sort({ date: -1 }).limit(12).toArray()

    const sortedData = sortData(data)

    

    res.render('index', {firstArray: sortedData})
})

router.post('/cart_handle', async (req, res) => {
    const data = req.body
    const cookie = req.headers.cookie
    const username = getUsername(cookie)

    const id = mongo.Types.ObjectId.createFromHexString(req.body.id)

    const updates = {
        $push: {
            cart: id
        }
    }

    const result = await db.collection('users').updateOne({ username: username }, updates)
    console.log(result)
    
    res.sendStatus(200)
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/data_first', async (req, res) => {
  const first = [
    {
        name: 'Танк',
        description: '3 млн рублей',
        date: new Date(),
        img: 'tank.jpg',
        category: 'first'
    }, 
    {
        name: 'АК-47',
        description: '300 тыс. рублей',
        date: new Date(),
        img: 'ak47.jpg',
        category: 'first'
    }, 
    {
        name: 'Бинт',
        description: '150 рублей',
        date: new Date(),
        img: 'bondage.jpg',
        category: 'first'
    }, 
    {
        name: 'Сигареты Пёрт 1 (Особые)',
        description: '170 рублей',
        date: new Date(),
        img: 'cig.jpg',
        category: 'first'
    }, 
    {
        name: 'Тушенка (улан-удэнская)',
        description: '70 рублей',
        date: new Date(),
        img: 'food.jpg',
        category: 'first'
    }, 
    {
        name: 'Аптечка',
        description: '3000 рублей',
        date: new Date(),
        img: 'medicine.jpg',
        category: 'first'
    },
    {
        name: 'Коктейл Молотого',
        description: '1000 рублей',
        date: new Date(),
        img: 'molotov.jpg',
        category: 'first'
    },
    {
        name: 'Носки',
        description: '3000 рублей',
        date: new Date(),
        img: 'socs.jpg',
        category: 'first'
    },
    {
        name: 'Водка Путинка',
        description: '400 рублей',
        date: new Date(),
        img: 'vodka.jpg',
        category: 'first'
    },
  ];

    const result = await db.collection('products').insertMany(first)
    res.sendStatus(200)
})

router.get('/second', async (req, res) => {
    const data = await db.collection('products').find({ category: 'second' }).toArray()

    const sortedData = sortData(data)
    
    res.render('second', {firstArray: sortedData})
})

router.get('/data_second', async (req, res) => {
    
  const second = [
    {
        name: 'Прицел',
        description: '30000 рублей',
        date: new Date(),
        img: '5x.jpg',
        category: 'second'
    },
    {
        name: 'Кепка Mr PUTIN',
        description: '750 рублей',
        date: new Date(),
        img: 'cap.jpg',
        category: 'second'
    }, 
    {
        name: 'Флаг Державы',
        description: '500 рублей',
        date: new Date(),
        img: 'flag.jpg',
        category: 'second'
    },  
    {
        name: 'Камуфляжный Костюм (женский)',
        description: '4000 рублей',
        date: new Date(),
        img: 'form.jpg',
        category: 'second'
    }, 
    {
        name: 'Футболка \"Отряды Путина\"',
        description: '2500 рублей',
        date: new Date(),
        img: 'king.jpg',
        category: 'second'
    }, 
    {
        name: 'Балаклава',
        description: '800 рублей',
        date: new Date(),
        img: 'mask.jpg',
        category: 'second'
    },
    {
        name: 'Нашивка Опасная',
        description: '350 рублей',
        date: new Date(),
        img: 'nash.jpg',
        category: 'second'
    },
    {
        name: 'Георгиевская Лента',
        description: '50 рублей',
        date: new Date(),
        img: 'victory.jpg',
        category: 'second'
    },
    {
        name: 'Нашивка Z',
        description: '300 рублей',
        date: new Date(),
        img: 'z.jpg',
        category: 'second'
    },

  ]

    const result = await db.collection('products').insertMany(second)
    res.sendStatus(200)
        
})

router.get('/first', async (req, res) => {
    const first = await db.collection('products').find({ category: 'first' }).toArray()

    const firstArray = sortData(first)
    
    res.render('first', {firstArray: firstArray})
})


function sortData(array) {

    const clothesLength = Math.ceil(array.length / 3)
    let clothesArray = new Array()
    for (let i = 0; i < clothesLength; i++) {
        clothesArray.push(new Array())
        for (let j = 0; j < 3; j++) {
            if (3 * i + j < array.length)
                clothesArray[i].push(array[3 * i + j])
        }
    }

    return clothesArray
}

router.get('/about', (req, res) => {
    res.render('about')
})


router.post('/login_handler', cors(authCors), async (req, res) => {
    
    const password = req.body.password

    const result = await db.collection('users').findOne({username: req.body.username})
    
    if (password == result.password) {
        const token = generateToken(req.body.username)
        res.cookie('token', token)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }

})

router.post('/signup_handler', cors(authCors), async (req, res) => {
    const body = req.body
    const data = {
        username: body.username,
        password: body.password,
        cart: []
    }

    if (req.body.username.indexOf('putin') == -1) {
        data.profile = 'user'
    } else {
        data.profile = 'putin'
    }

    const count = await db.collection('users').countDocuments({username: data.username})
    
    if (count > 0) {
        return res.sendStatus(400)
    }
    
    const result = await db.collection('users').insertOne(data)
    if (result.acknowledged) {
        res.sendStatus(200)
    }

})

router.get('/auth', cors(mainCors), (req, res) => {
    
    const token = req.headers['token']
    if (token == '') 
        res.clearCookie('token').sendStatus(401)
    else {
        jwt.verify(token, process.env.jwt_secret, (err, user) => {
            console.log(err)
            if (err) return res.clearCookie('token').sendStatus(403)
            res.sendStatus(200)
        })
    }
    
})

router.use('/profile', (req, res, next) => {
    const cookie = req.headers.cookie
    if (cookie == undefined) {

        return res.redirect('/')
    }
    const token = cookie.substring(cookie.indexOf('=') + 1)
    jwt.verify(token, process.env.jwt_secret, (err, user) => {
        console.log(err)
        if (err) {
            return res.redirect('/')
        } else {
            next()
        }
    })
})

router.get('/profile', async (req, res) => {

    const cookie = req.headers.cookie

    const username = getUsername(cookie)
    const result = await db.collection('users').findOne({username: username})

    let data = new Array()
    console.log(result.cart)
    for (let i = 0; i < result.cart.length; i++) {
        const product = await db.collection('products').findOne({ _id: result.cart[i]})
        console.log(product)
        data.push(product)
    }

    console.log(data)


    const userData = {
        username: result.username,
        name: result.name,
        surname: result.surname,
        patronomyc: result.patronomyc,
        phone: result.phone,
        profile: result.profile,
    }

    console.log(userData)

    res.render('profile', {userData: userData, data: data})
})

router.put('/update_handler', async (req, res) => {
    const data = req.body
    const username = getUsername(req.headers.cookie)

    const updates = {
        $set: { 
            name: data.name,
            surname: data.surname,
            patronomyc: data.patronomyc,
            phone: data.phone
        }
    }

    const result = await db.collection('users').updateOne({ username: username }, updates)

    if (result.acknowledged) {
        res.sendStatus(200)
    }
})

router.use('/edit', (req, res, next) => {
    const cookie = req.headers.cookie
    const token = cookie.substring(cookie.indexOf('=') + 1)

    console.log(token)

    jwt.verify(token, process.env.jwt_secret, (err, user) => {
        console.log(err)
        if (err) {
            return res.redirect('/')
        } else {
            next()
        }
    })
})

router.get('/edit', async (req, res) => {
    const clothes = await db.collection('products').find({}).toArray()

    const clothesArray = sortData(clothes)

    console.log(clothesArray[0][0]._id.toString())

    res.render('edit', { clothesArray: clothesArray })
})

router.put('/item_handle', async (req, res) => {
    const data = req.body

    console.log(data)

    const updates = {
        $set: { 
            name: data.name,
            description: data.description,
        }
    }

    const result = await db.collection('products').updateOne({ _id: mongo.Types.ObjectId.createFromHexString(data.id)}, updates)

    if (result.acknowledged)
        res.sendStatus(200)
    
})

router.delete('/delete_handle', async (req, res) => {
    const data = req.body
    const username = getUsername(req.headers.cookie)
    const updates = {
        $pull: {
            cart: mongo.Types.ObjectId.createFromHexString(data.id)
        }
    }

    const result = await db.collection('users').updateOne({ username: username }, updates)
    console.log(result)
    if (result.acknowledged)
        res.sendStatus(200)
})

router.delete('/delete_item_handle', async (req, res) => {
    const data = req.body
    const productId = mongo.Types.ObjectId.createFromHexString(data.id)

    const result = await db.collection('products').deleteOne({_id: productId})

    if (result.acknowledged)
        res.sendStatus(200)
})

router.get('/profile/add', (req, res) => {
    res.render('add_product')
})

router.post('/upload', upload.single('photo'), (req, res) => {
    const file = req.file
    const name = req.body.productName
    const des = req.body.description
    const coll = req.body.collection

    const data = {
        name: name,
        description: des,
        date: new Date(),
        img: file.originalname,
        category: coll,
    }
    console.log(__dirname)
    const path = __dirname + '/../public/img/' + coll + '/' + file.originalname
    fs.writeFile(path, file.buffer, (err) => {
        if (err) console.log(err)
    })

    const result = db.collection('products').insertOne(data)
    res.sendStatus(200)
})

router.get('/backlink', (req, res) => {
    res.render('backlink')
})

router.post('/backlink_handle', async (req, res) => {
    const data = req.body

    console.log(data)
    
    const result = await db.collection('backlink').insertOne(data)
    if (result.acknowledged) {
        res.sendStatus(200)
    }

    
})

function getUsername(cookie) {
    return jwt.decode(cookie.substring(cookie.indexOf('=') + 1)).username
}

function generateToken(username) {
    return jwt.sign({username: username}, process.env.jwt_secret, {expiresIn:'3600s'})
}

router.use((req, res, next) => { 
    res.status(404).render('404')
}) 


module.exports = router


// const authHeader = req.headers['token']
//     const token = authHeader
//     if (token == null) 
//         return res.sendStatus(401)
//     jwt.verify(token, process.env.jwt_secret, (err, user) => {
//         console.log(err)
//         if (err) return res.sendStatus(403)
//     })
    