const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Load models (assuming they are in the same folder structure)
// Since we are running from backend/, models are in ./models/
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bhargav_bharti_glooms';

async function syncImages() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      console.error('❌ Uploads directory not found:', uploadsDir);
      process.exit(1);
    }

    const availableFiles = fs.readdirSync(uploadsDir);
    console.log(`📁 Found ${availableFiles.length} files in uploads folder.`);

    const products = await Product.find({});
    console.log(`🔍 Checking ${products.length} products...`);

    let updatedCount = 0;

    for (const product of products) {
      let changed = false;
      const newImages = [];

      for (const imgPath of product.images) {
        // imgPath is like "/uploads/1774284782444-4.jpeg"
        const filename = path.basename(imgPath);
        
        if (fs.existsSync(path.join(uploadsDir, filename))) {
          newImages.push(imgPath);
          continue;
        }

        // File doesn't exist, try to find a match by suffix
        // e.g. "1774284782444-4.jpeg" -> suffix "-4.jpeg"
        const suffix = filename.split('-').slice(1).join('-');
        if (!suffix) {
          console.log(`⚠️  Could not extract suffix from ${filename}, skipping.`);
          newImages.push(imgPath);
          continue;
        }

        const match = availableFiles.find(f => f.endsWith(`-${suffix}`));
        if (match) {
          console.log(`✨ Fixed: ${filename} -> ${match}`);
          newImages.push(`/uploads/${match}`);
          changed = true;
        } else {
          console.log(`❌ No match found for suffix -${suffix}`);
          newImages.push(imgPath);
        }
      }

      if (changed) {
        product.images = newImages;
        await product.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Done! Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (err) {
    console.error('🔥 Error during sync:', err);
    process.exit(1);
  }
}

syncImages();
