const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/popix/.gemini/antigravity/brain/5b2602a1-e655-4665-830a-06dbbf13fb66/uploaded_image_1768894893300.png';

async function checkMetadata() {
    try {
        const metadata = await sharp(inputPath).metadata();
        console.log('Width:', metadata.width);
        console.log('Height:', metadata.height);
    } catch (err) {
        console.error(err);
    }
}

checkMetadata();
