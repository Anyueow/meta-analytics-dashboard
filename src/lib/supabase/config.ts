import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://entyheocxwblqyhefshu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY

if (!supabaseKey) {
  throw new Error('Missing Supabase key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_KEY in your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database URL for Prisma
export const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('Missing DATABASE_URL. Please set it in your environment variables.')
  }
  return url
}

// Helper function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_prisma_migrations').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected for new projects
      throw error
    }
    console.log('✅ Supabase connection successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}
