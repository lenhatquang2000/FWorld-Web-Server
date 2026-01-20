const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Đường dẫn file ảnh gốcc
const malePath = path.join(__dirname, '../client/public/assets/male/image.png');
const femalePath = path.join(__dirname, '../client/public/assets/female/image.png');

async function removeBackground(inputPath) {
    if (!fs.existsSync(inputPath)) {
        console.log(`File not found: ${inputPath}`);
        return;
    }

    const backupPath = inputPath.replace('.png', '_backup.png');

    // Tạo backup nếu chưa có
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
        console.log(`Created backup: ${backupPath}`);
    }

    try {
        console.log(`Processing: ${inputPath}`);

        // Đọc file ảnh
        const buffer = await sharp(inputPath)
            .ensureAlpha() // Đảm bảo có kênh alpha
            .toBuffer();

        // Xử lý background trắng (giả sử background là màu trắng hoặc gần trắng)
        // Cách đơn giản nhất là dùng ngưỡng màu để chuyển thành transparent
        // Tuy nhiên, sharp không có hàm "magic wand" trực tiếp.
        // Ta sẽ dùng kỹ thuật đơn giản: chuyển màu trắng r > 240, g > 240, b > 240 thành trong suốt.

        const { data, info } = await sharp(buffer)
            .raw()
            .toBuffer({ resolveWithObject: true });

        // data là mảng [r, g, b, a, r, g, b, a, ...]
        const pixelData = new Uint8Array(data);

        for (let i = 0; i < pixelData.length; i += 4) {
            const r = pixelData[i];
            const g = pixelData[i + 1];
            const b = pixelData[i + 2];

            // Kiểm tra màu trắng (hoặc gần trắng)
            if (r > 240 && g > 240 && b > 240) {
                pixelData[i + 3] = 0; // Alpha = 0 (Transparent)
            }
        }

        await sharp(pixelData, {
            raw: {
                width: info.width,
                height: info.height,
                channels: 4
            }
        })
            .toFile(inputPath); // Ghi đè lại file gốc

        console.log(`Done removing background for: ${inputPath}`);

    } catch (err) {
        console.error('Error processing image:', err);
    }
}

async function run() {
    await removeBackground(malePath);
    await removeBackground(femalePath);
}

run();
