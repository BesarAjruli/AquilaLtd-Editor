const express = require('express')
const cors = require('cors')
const path = require('node:path')
const multer = require('multer')
const fs = require('fs')
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const {Pool} = require('pg')
const cookieParser = require('cookie-parser');
const db = new Pool({
  connectionString: process.env.DATABASE_URL + '?sslmode=require'
})

const upload = multer()

require("dotenv").config();

const prisma = new PrismaClient()
const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
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
    httpOnly: true, //development only
    secure: false, //developent only
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json({limit: '50mb'}));

app.post('/api/saveTemplate',upload.single('image'), async (req, res) => {
   try {
    const thumbnailDir = path.join(__dirname, 'thumbnails')
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, {recursive: true});
      }
    const imagePath = `/thumbnails/${Date.now()}-${req.file.originalname}`;
    fs.promises.writeFileSync(path.join(__dirname, imagePath), req.file.buffer);

        const newTemplate = await prisma.template.create({
          data: {
            template: JSON.stringify(req.body.template),
            path: imagePath,
            category: req.body.category,
            device_type: req.body.deviceType,
            authorId: parseInt(req.body.userId)
          }
        });
        res.status(201).json({success: true});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to save template' });
      }
})
app.get('/api/saveTemplate', async (req, res) => {
    const data = await prisma.template.findMany()  
    res.json(data)
})
//Sign up
app.post('/api/sign-up', async (req, res) => {
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