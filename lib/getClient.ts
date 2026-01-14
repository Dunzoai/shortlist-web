import { supabase } from './supabase';

export interface WebClient {
  id: string;
  slug: string;
  business_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  domains: string[];
  contact_email?: string;
  contact_phone?: string;
  logo_url?: string;
  tagline?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Get client data based on hostname
 * @param hostname - The domain name (e.g., "demo-nitos.shortlistpass.com", "danidiaz.com")
 * @returns Client data or falls back to danidiaz
 */
export async function getClient(hostname: string): Promise<WebClient | null> {
  try {
    // Query for client where hostname is in domains array
    const { data, error } = await supabase
      .from('web_clients')
      .select('*')
      .contains('domains', [hostname])
      .single();

    if (error) {
      console.warn(`No client found for hostname: ${hostname}, falling back to danidiaz`);

      // Fallback to danidiaz
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('web_clients')
        .select('*')
        .eq('slug', 'danidiaz')
        .single();

      if (fallbackError) {
        console.error('Error fetching fallback client:', fallbackError);
        return null;
      }

      return fallbackData;
    }

    return data;
  } catch (error) {
    console.error('Error in getClient:', error);

    // Try to get danidiaz as fallback
    try {
      const { data: fallbackData } = await supabase
        .from('web_clients')
        .select('*')
        .eq('slug', 'danidiaz')
        .single();

      return fallbackData;
    } catch (fallbackError) {
      console.error('Error fetching fallback client:', fallbackError);
      return null;
    }
  }
}

/**
 * Get client data by slug
 * @param slug - The client slug (e.g., "danidiaz", "nitos")
 * @returns Client data
 */
export async function getClientBySlug(slug: string): Promise<WebClient | null> {
  try {
    const { data, error } = await supabase
      .from('web_clients')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`Error fetching client by slug ${slug}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getClientBySlug:', error);
    return null;
  }
}
