import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildDemos() {
  console.log('Generating images.json...');
  const imagesDir = path.resolve(__dirname, '../images');
  const demosDir = path.resolve(__dirname, '../demos');
  const outDir = path.resolve(__dirname, '../dist-demos');

  // Read images from root images directory
  let imageFiles = [];
  if (fs.existsSync(imagesDir)) {
    imageFiles = fs.readdirSync(imagesDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext);
    });
  }

  // Write images.json into demos folder so Vite can bundle/serve it
  fs.writeJsonSync(path.join(demosDir, 'images.json'), imageFiles);
  console.log(`Found ${imageFiles.length} images. Saved to demos/images.json`);

  // Build the demos using Vite
  console.log('Building demos with Vite...');
  // We need to configure Vite to build all HTML files in demos
  // Let's run vite build with entry points
  // Vite can build multiple html files by specifying them or using rollup options
  // Let's run the build command
  execSync('npx vite build demos --outDir ../dist-demos --emptyOutDir', { stdio: 'inherit' });

  // Copy images folder into output dist-demos/images
  console.log('Copying images to build output...');
  if (fs.existsSync(imagesDir)) {
    fs.copySync(imagesDir, path.join(outDir, 'images'));
  }
  
  // Copy the images.json to build output just in case
  fs.copySync(path.join(demosDir, 'images.json'), path.join(outDir, 'images.json'));

  console.log('Demos build completed successfully! Output in: dist-demos');
}

buildDemos().catch(err => {
  console.error('Error building demos:', err);
  process.exit(1);
});
