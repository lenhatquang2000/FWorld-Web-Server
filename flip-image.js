const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Đường dẫn file cần flip
const targetPath = path.join(__dirname, '../client/public/assets/female/image.png');

async function flipImage(inputPath) {
    if (!fs.existsSync(inputPath)) {
        console.log(`File not found: ${inputPath}`);
        return;
    }

    const backupPath = inputPath.replace('.png', '_pre_flip_backup.png');

    // Tạo backup
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
        console.log(`Created backup: ${backupPath}`);
    }

    try {
        console.log(`Flipping image: ${inputPath}`);

        // Đọc vào buffer
        const buffer = await sharp(inputPath)
            .toBuffer();

        // Flop (Horizontal Flip) và ghi đè
        await sharp(buffer)
            .flop() // Lật ngang
            .toFile(inputPath);

        console.log(`Done flipping: ${inputPath}`);

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

flipImage(targetPath);
