import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public/browser use (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types for our database tables
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  keywords: string[] | null;
  status: 'draft' | 'published' | 'scheduled';
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogTopic {
  id: string;
  topic: string;
  category: string | null;
  primary_keyword: string | null;
  secondary_keywords: string[] | null;
  used: boolean;
  priority: number;
  created_at: string;
}

