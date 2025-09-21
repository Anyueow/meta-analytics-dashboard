const fs = require('fs');
const path = require('path');

// Supabase configuration
const SUPABASE_URL = 'https://entyheocxwblqyhefshu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudHloZW9jeHdibHF5aGVmc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjkwNzMsImV4cCI6MjA3NDAwNTA3M30.hvyVY3gqr8qAcO69RcqzOk0YiPs7aWJn49Mr9d8HDm8';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudHloZW9jeHdibHF5aGVmc2h1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQyOTA3MywiZXhwIjoyMDc0MDA1MDczfQ.8p7Gfbqd-gC7oV4r9BmxuWAbt1zhG4yI10LTWNTRiAs';

// Database URL for Supabase (you'll need to replace [password] with your actual password)
const DATABASE_URL = 'postgresql://postgres:[password]@db.entyheocxwblqyhefshu.supabase.co:5432/postgres';

// Read current .env file
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

// Update the .env content
envContent = envContent.replace(
  /DATABASE_URL=.*/,
  `DATABASE_URL=${DATABASE_URL}`
);

// Add Supabase configuration
if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) {
  envContent += `\n# Supabase Configuration\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}\n`;
  envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}\n`;
  envContent += `SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}\n`;
}

// Add META_ACCOUNT_ID if missing
if (!envContent.includes('META_ACCOUNT_ID')) {
  envContent = envContent.replace(
    /META_ACCESS_TOKEN=.*/,
    `META_ACCESS_TOKEN=EAAPoDjPBUQcBPeMUE6PBVcFT21ZAUXZAKh4ldW5ZB7vZCRfm6DWQfnDwA7iWhJ3spaXPMQZBIzPhjSBZBu5ebc48x3AlWPgeMO6I1djGdCiuGWA7yZAhBaZCRys6IG4jGLB7xHekYC9bxYVdtzjFtxG97pyKJQvB1GRAg4t6xFtuVKCWwMeO4BkvPp5ZAPsXTISxiabig\nMETA_ACCOUNT_ID=act_1099572625625351`
  );
}

// Update ZAI_API_KEY
envContent = envContent.replace(
  /GLM_API_KEY=.*/,
  `ZAI_API_KEY=4c1c00ba7ff7489d88c29b737e3d8b0f.ZQ7Rpx7rGl9J0J4U`
);

// Write updated .env file
fs.writeFileSync(envPath, envContent);

console.log('✅ Updated .env file with Supabase configuration');
console.log('⚠️  IMPORTANT: You need to update the DATABASE_URL with your actual Supabase password');
console.log('   Replace [password] in DATABASE_URL with your Supabase database password');
console.log('   You can find this in your Supabase project settings > Database > Connection string');
