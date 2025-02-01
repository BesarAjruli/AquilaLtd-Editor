const express = require('express')
const cors = require('cors')
const path = require('node:path')
const multer = require('multer')
const fs = require('fs')
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs')
const passport = require('passport')
const session = require('express-session')
const { body, validationResult } = require('express-validator');
const LocalStrategy = require('passport-local').Strategy
const {Pool} = require('pg')
const cloudinary = require('cloudinary').v2
const cookieParser = require('cookie-parser');
const db = new Pool({
  connectionString: process.env.DATABASE_URL + '?sslmode=require'
})

const upload = multer({dest: 'uploads/'})

require("dotenv").config();

const prisma = new PrismaClient()
const app = express()

cloudinary.config({
  cloud_name: 'dnatydh3w',
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_CLOUDINARY,
});

app.use(cors({
    origin: ['http://localhost:5173', 'https://aquila-editor.up.railway.app'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser())
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: db,
    tableName: 'user-session',
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    httpOnly: true,
    secure: true,//process.env.NODE_ENV === 'production',
    sameSite: 'None',
    domain: '.koyeb.app'
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json({limit: '50mb'}));
app.set('trust proxy', true)

app.post('/api/saveTemplate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'thumbnails',
      public_id: `${Date.now()}-${req.file.originalname}`,
    });

    const newTemplate = await prisma.template.create({
      data: {
        template: JSON.stringify(req.body.template),
        path: result.secure_url,
        category: req.body.category,
        device_type: req.body.deviceType,
        authorId: parseInt(req.body.userId),
        premium: false,
        verified: false,
      }
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Failed to save template' });
  }
});

app.get('/api/saveTemplate', async (req, res) => {
    const data = await prisma.template.findMany()  
    res.json(data)
})
//Sign up
app.post('/api/sign-up',[
  body('password')
  .isLength({min: 8})
  .withMessage('Password must be at least 8 chaacters long!')
  .matches(/[A-Z]/)
  .withMessage('Password must contain one uppercase letter!'),
  body('confirmPass').custom((value, {req}) => {
      return value === req.body.password
  }).withMessage('Password didn\'t match')
], async (req, res) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPass) => {
    try {
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPass,
        },
      });
      res.json({ success: true, message: "User created successfully" });
    } catch (err) {
      console.log(err);
    }
  });
})
//Log in
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({success: true, redirect: `/`});
  })

  app.get('/api', (req, res) => {
    res.json({ user: req.user || "No user found" });
  });

//Delete thumbnail
app.delete('/api/delete/:id', async (req, res) => {
const id = req.params.id
await prisma.template.delete({where: {id: parseInt(id)}})
const response = await prisma.template.findMany()
res.json(response)
})
//Update thumbnail
app.put('/api/update/:id', async (req, res) => {
  const id = req.params.id
  await prisma.template.update({
    where: { id: parseInt(id) },
    data: {
      verified: true
    }
  })
  const response = await prisma.template.findMany()
  res.json(response)
})
  

//Passport
passport.use(
  new LocalStrategy(async (username, password, done) => {
      const user = await prisma.user.findFirst({where: {username: username}})

          try{
              if(!user){
                  return done(null,false, {message: 'Incorrecr username'})
              }

              const match = await bcrypt.compare(password, user.password)
              if(!match){
                  return done(null, false, {message: 'Incorrect password'})
              }
              return done(null, user)
          }catch(error){
              return done(error)
          }
  })
)

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({where: {id: id}})
    return done(null, user);

  } catch (err) {
    return done(err);
  }
});

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listneing on port ${port}`)
})