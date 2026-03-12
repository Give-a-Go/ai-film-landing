// Script to fetch video URLs from Cloudinary collection
// Run with: node scripts/fetch-cloudinary-videos.js

// You'll need to set these environment variables or replace them here:
// CLOUDINARY_CLOUD_NAME=dwgjwc96q
// CLOUDINARY_API_KEY=your_api_key
// CLOUDINARY_API_SECRET=your_api_secret

const https = require('https');

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dwgjwc96q';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;
const COLLECTION_ID = 'be38947943f4608449e53793e421b109';

if (!API_KEY || !API_SECRET) {
  console.error('Error: Please set CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET environment variables');
  console.log('\nUsage:');
  console.log('  CLOUDINARY_API_KEY=xxx CLOUDINARY_API_SECRET=yyy node scripts/fetch-cloudinary-videos.js');
  process.exit(1);
}

// Cloudinary Admin API endpoint to get collection resources
const options = {
  hostname: 'api.cloudinary.com',
  path: `/v1_1/${CLOUD_NAME}/resources/by_asset_folder/${COLLECTION_ID}?resource_type=video&max_results=500`,
  method: 'GET',
  auth: `${API_KEY}:${API_SECRET}`
};

https.get(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);

      if (result.error) {
        console.error('Cloudinary API Error:', result.error.message);
        return;
      }

      if (!result.resources || result.resources.length === 0) {
        console.log('No videos found in this collection.');
        return;
      }

      console.log(`Found ${result.resources.length} videos:\n`);

      // Generate video URLs
      const videoUrls = result.resources.map(resource => {
        return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${resource.public_id}.mp4`;
      });

      console.log('const videoUrls = [');
      videoUrls.forEach((url, index) => {
        const comma = index < videoUrls.length - 1 ? ',' : '';
        console.log(`  "${url}"${comma}`);
      });
      console.log('];');

      console.log(`\n✅ Copy the array above and paste it into components/Hero.tsx (replace the videoUrls array)`);

    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Response:', data);
    }
  });
}).on('error', (error) => {
  console.error('Request error:', error.message);
});
