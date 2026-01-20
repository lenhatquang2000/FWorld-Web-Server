const sharp = require('sharp');
const path = require('path');

const inputPath = 'C:/Users/popix/.gemini/antigravity/brain/5b2602a1-e655-4665-830a-06dbbf13fb66/uploaded_image_1768894893300.png';
const maleOut = path.join(__dirname, '../client/public/assets/male/image.png');
const femaleOut = path.join(__dirname, '../client/public/assets/female/image.png');

async function splitAndSave() {
    try {
        console.log('Processing split...');

        // Input dimensions are 1024x682
        // Split width = 512
        const halfWidth = 512;
        const height = 682;

        // 1. Process Male (Left Half)
        const maleBuffer = await sharp(inputPath)
            .extract({ left: 0, top: 0, width: halfWidth, height: height })
            .toBuffer();

        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 } // Nền trắng
            }
        })
            .composite([{ input: maleBuffer, gravity: 'center' }]) // Căn giữa
            .toFile(maleOut);

        console.log('Saved Male image to:', maleOut);

        // 2. Process Female (Right Half)
        const femaleBuffer = await sharp(inputPath)
            .extract({ left: halfWidth, top: 0, width: halfWidth, height: height })
            .toBuffer();

        await sharp({
            create: {
                width: 1024,
                height: 1024,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 } // Nền trắng
            }
        })
            .composite([{ input: femaleBuffer, gravity: 'center' }]) // Căn giữa
            .toFile(femaleOut);

        console.log('Saved Female image to:', femaleOut);

    } catch (err) {
        console.error('Error splitting image:', err);
    }
}

splitAndSave();
