const express = require('express')
const cors = require('cors')
const path = require('node:path')
const multer = require('multer')
const fs = require('fs')
const { PrismaClient } = require("@prisma/client");

const upload = multer()

require("dotenv").config();

const prisma = new PrismaClient()
const app = express()

app.use(cors({
    origin: 'https://aquilaltd-editor-production.up.railway.app/',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json({limit: '50mb'}));

app.post('/api/saveTemplate',upload.single('image'), async (req, res) => {
   try {
    const thumbnailDir = path.join(__dirname, 'thumbnails')
    if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir);
      }
    const imagePath = `/thumbnails/${Date.now()}-${req.file.originalname}`;
    fs.writeFileSync(path.join(__dirname, imagePath), req.file.buffer);

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

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listneing on port ${port}`)
})