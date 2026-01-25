import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '../public/images');
const OUTPUT_DIR = join(__dirname, '../public/images-optimized');

// Target dimensions for texture display
const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 600;

async function optimizeImages() {
  try {
    // Create output directory
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Read all image files
    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|webp)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} images to optimize...`);

    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;

    for (const file of imageFiles) {
      const inputPath = join(INPUT_DIR, file);
      const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const outputPath = join(OUTPUT_DIR, outputFileName);

      try {
        // Get original file size
        const originalStats = await stat(inputPath);
        const originalSize = originalStats.size;
        totalOriginalSize += originalSize;

        // Optimize and convert to WebP
        await sharp(inputPath)
          .resize(TARGET_WIDTH, TARGET_HEIGHT, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 80 })
          .toFile(outputPath);

        // Get optimized file size
        const optimizedStats = await stat(outputPath);
        const optimizedSize = optimizedStats.size;
        totalOptimizedSize += optimizedSize;

        const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
        console.log(`✓ ${file} -> ${outputFileName} (${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(optimizedSize / 1024 / 1024).toFixed(2)}MB, ${reduction}% smaller)`);
      } catch (err) {
        console.error(`✗ Failed to process ${file}:`, err.message);
      }
    }

    const totalReduction = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);
    console.log('\n' + '='.repeat(60));
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total reduction: ${totalReduction}%`);
    console.log('='.repeat(60));
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

optimizeImages();
