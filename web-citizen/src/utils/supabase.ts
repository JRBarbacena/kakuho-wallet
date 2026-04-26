import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type CitizenData = {
  license_id: string
  first_name: string
  last_name: string
  dob: string
  license_type: 'STUDENT' | 'NON_PRO'
  expiration_date: string
  blood_type: string
  address_city: string
  admin_hash: string
}
