import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (matching your schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'super_admin' | 'admin' | 'admin_helper' | 'booking_manager' | 'operations_coordinator' | 'driver' | 'finance_officer' | 'customer_service'
          avatar: string | null
          is_active: boolean
          last_login: string | null
          permissions: string[]
          assigned_region: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'super_admin' | 'admin' | 'admin_helper' | 'booking_manager' | 'operations_coordinator' | 'driver' | 'finance_officer' | 'customer_service'
          avatar?: string | null
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          assigned_region?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'super_admin' | 'admin' | 'admin_helper' | 'booking_manager' | 'operations_coordinator' | 'driver' | 'finance_officer' | 'customer_service'
          avatar?: string | null
          is_active?: boolean
          last_login?: string | null
          permissions?: string[]
          assigned_region?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          profile_image: string | null
          journey_status: 'submitted' | 'confirmed' | 'arrived' | 'completed'
          booking_date: string | null
          total_cost: number
          paid_amount: number
          special_requirements: string[]
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          profile_image?: string | null
          journey_status?: 'submitted' | 'confirmed' | 'arrived' | 'completed'
          booking_date?: string | null
          total_cost?: number
          paid_amount?: number
          special_requirements?: string[]
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          profile_image?: string | null
          journey_status?: 'submitted' | 'confirmed' | 'arrived' | 'completed'
          booking_date?: string | null
          total_cost?: number
          paid_amount?: number
          special_requirements?: string[]
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
  }
}

// Auth types
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']
