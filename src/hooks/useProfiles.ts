import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseProfile {
  id: string;
  user_id: string;
  profile_type: 'student' | 'researcher' | 'agency';
  name: string;
  email: string;
  avatar_url: string | null;
  location: string | null;
  bio: string | null;
  university: string | null;
  major: string | null;
  year: string | null;
  institution: string | null;
  department: string | null;
  title: string | null;
  publications: number | null;
  agency_type: string | null;
  focus_areas: string[] | null;
  employees: string | null;
  founded: string | null;
  website: string | null;
  interests: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface UnifiedProfile {
  id: string;
  name: string;
  title: string;
  organization: string;
  location: string;
  email: string;
  tags: string[];
  description: string;
  type: 'student' | 'researcher' | 'agency';
  userId: string;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<UnifiedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({ students: 0, researchers: 0, agencies: 0 });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const dbProfiles = data as DatabaseProfile[];
    
    // Transform to unified format
    const unified: UnifiedProfile[] = dbProfiles.map((p) => {
      let title = '';
      let organization = '';

      if (p.profile_type === 'student') {
        title = p.year ? `${p.year} - ${p.major || 'Student'}` : (p.major || 'Student');
        organization = p.university || '';
      } else if (p.profile_type === 'researcher') {
        title = p.title || 'Researcher';
        organization = p.institution || '';
      } else if (p.profile_type === 'agency') {
        title = p.agency_type || 'Agency';
        organization = p.name;
      }

      return {
        id: p.id,
        name: p.name,
        title,
        organization,
        location: p.location || '',
        email: p.email,
        tags: p.interests || p.focus_areas || [],
        description: p.bio || '',
        type: p.profile_type,
        userId: p.user_id,
      };
    });

    setProfiles(unified);
    setCounts({
      students: dbProfiles.filter(p => p.profile_type === 'student').length,
      researchers: dbProfiles.filter(p => p.profile_type === 'researcher').length,
      agencies: dbProfiles.filter(p => p.profile_type === 'agency').length,
    });
    setLoading(false);
  };

  return { profiles, loading, error, counts, refetch: fetchProfiles };
}

export function useProfile(id: string) {
  const [profile, setProfile] = useState<DatabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setProfile(data as DatabaseProfile);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [id]);

  return { profile, loading, error };
}
