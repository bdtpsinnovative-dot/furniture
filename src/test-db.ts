import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Sample Data:', JSON.stringify(data, null, 2));
    if (data && data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
    } else {
      console.log('No rows in product table to infer schema.');
    }
  }
}

checkSchema();
