const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://entyheocxwblqyhefshu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVudHloZW9jeHdibHF5aGVmc2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjkwNzMsImV4cCI6MjA3NDAwNTA3M30.hvyVY3gqr8qAcO69RcqzOk0YiPs7aWJn49Mr9d8HDm8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test basic connection with our actual table
    const { data, error } = await supabase.from('campaign_insights').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('📊 Supabase URL:', supabaseUrl);
    console.log('🔑 Using anon key for client-side operations');
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
}

testConnection();
