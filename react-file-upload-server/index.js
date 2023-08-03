const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});

const upload = multer({ storage });

app.get('/', (req, res) => {
  const data = { message: 'Server is running!' };
  res.json(data);
});

// image upload route
app.post('/upload', upload.single('file'), async function (req, res) {
  try {
    if (!req?.file?.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const imageUrl = result.secure_url;
    console.log(imageUrl);

    res.json({ message: 'Image uploaded successfully!', url: imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
