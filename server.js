import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wedding_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

app.get('/api/compliments', (req, res) => {
    const jsonPath = path.join(__dirname, 'assets', 'compliments.json');
    if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        res.json(JSON.parse(fileContent));
    } else {
        res.json([]);
    }
});

app.get('/api/gallery', (req, res) => {
    const jsonPath = path.join(__dirname, 'assets', 'gallery.json');
    if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        res.json(JSON.parse(fileContent));
    } else {
        res.json([]);
    }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    const { name } = req.body;
    const image = req.file;

    if (!name || !image) {
        return res.status(400).json({ error: 'Name and image are required' });
    }

    const assetsFolder = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsFolder)) {
        fs.mkdirSync(assetsFolder, { recursive: true });
    }

    const jsonPath = path.join(assetsFolder, 'compliments.json');

    try {
        let data = [];
        if (fs.existsSync(jsonPath)) {
            const fileContent = fs.readFileSync(jsonPath, 'utf-8');
            try {
                data = JSON.parse(fileContent);
            } catch (e) {
                data = [];
            }
        }

        // Store the Cloudinary URL (image.path)
        const newEntry = { name, img: image.path };
        data.push(newEntry);

        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

        console.log('Added new compliment:', newEntry);
        res.json({ success: true, message: 'Uploaded successfully', data: newEntry });
    } catch (err) {
        console.error('Error in upload:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
    const { caption } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).json({ error: 'Image is required' });
    }

    const assetsFolder = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsFolder)) {
        fs.mkdirSync(assetsFolder, { recursive: true });
    }

    const jsonPath = path.join(assetsFolder, 'gallery.json');

    try {
        let data = [];
        if (fs.existsSync(jsonPath)) {
            const fileContent = fs.readFileSync(jsonPath, 'utf-8');
            try {
                data = JSON.parse(fileContent);
            } catch (e) {
                data = [];
            }
        }

        // Store the Cloudinary URL (image.path)
        const newEntry = { url: image.path, caption: caption || '' };
        data.push(newEntry);

        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

        console.log('Added to gallery:', newEntry);
        res.json({ success: true, message: 'Gallery image uploaded', data: newEntry });
    } catch (err) {
        console.error('Error in gallery upload:', err);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

app.get('/api/guestbook', (req, res) => {
    const jsonPath = path.join(__dirname, 'assets', 'guestbook.json');
    if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        res.json(JSON.parse(fileContent));
    } else {
        res.json([]);
    }
});

app.post('/api/guestbook', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
    }

    const jsonPath = path.join(__dirname, 'assets', 'guestbook.json');
    try {
        let data = [];
        if (fs.existsSync(jsonPath)) {
            data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        }
        const newEntry = {
            id: Date.now().toString(),
            name,
            message,
            date: new Date().toISOString()
        };
        data.unshift(newEntry); // Newest first
        fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
        res.json(newEntry);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.get('/api/journey', (req, res) => {
    const jsonPath = path.join(__dirname, 'assets', 'journey.json');
    if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf-8');
        res.json(JSON.parse(fileContent));
    } else {
        res.json([]);
    }
});

app.delete('/api/guestbook/:id', (req, res) => {
    const { id } = req.params;
    const jsonPath = path.join(__dirname, 'assets', 'guestbook.json');
    try {
        if (fs.existsSync(jsonPath)) {
            let data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            data = data.filter(msg => msg.id !== id);
            fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
            return res.json({ success: true });
        }
        res.status(404).json({ error: 'Not found' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete' });
    }
});

app.post('/api/generate-dua', (req, res) => {
    const { guestName } = req.body;

    const duas = [
        {
            dua: "Barakallahu lakum wa baraka 'alaykum wa jama'a baynakuma fii khayr",
            translation: "May Allah bless you and shower His blessings upon you and join you in goodness."
        },
        {
            dua: "Allahumma ic'al hadal 'aqda 'aqdan mubarakan wa sa'idan",
            translation: "O Allah, make this marriage a blessed and happy union."
        },
        {
            dua: "Rabbana hab lana min azwajina wa dhurriyatina qurrata a'yun",
            translation: "Our Lord, grant us from among our spouses and offspring comfort to our eyes."
        }
    ];

    const randomDua = duas[Math.floor(Math.random() * duas.length)];
    res.json(randomDua);
});

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')));
app.use('/src/assets', express.static(path.join(__dirname, 'assets')));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
