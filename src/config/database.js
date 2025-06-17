const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('products').select('count', { count: 'exact', head: true });
    if (error) throw error;
    console.log('Connected to Supabase successfully');
  } catch (error) {
    console.error('Supabase connection error:', error.message);
  }
}

testConnection();

module.exports = supabase;
