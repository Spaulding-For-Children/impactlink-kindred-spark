export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analysis_tools: {
        Row: {
          access_url: string | null
          category: string
          created_at: string
          description: string
          documentation_url: string | null
          featured: boolean | null
          full_name: string
          id: string
          license_type: string | null
          name: string
          tags: string[] | null
          tool_type: string
          updated_at: string
        }
        Insert: {
          access_url?: string | null
          category?: string
          created_at?: string
          description: string
          documentation_url?: string | null
          featured?: boolean | null
          full_name: string
          id?: string
          license_type?: string | null
          name: string
          tags?: string[] | null
          tool_type?: string
          updated_at?: string
        }
        Update: {
          access_url?: string | null
          category?: string
          created_at?: string
          description?: string
          documentation_url?: string | null
          featured?: boolean | null
          full_name?: string
          id?: string
          license_type?: string | null
          name?: string
          tags?: string[] | null
          tool_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      collaborations: {
        Row: {
          created_at: string
          id: string
          message: string | null
          recipient_id: string
          requester_id: string
          status: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          recipient_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          recipient_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["collaboration_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          access_url: string | null
          coverage_end: string | null
          coverage_start: string | null
          created_at: string
          data_format: string | null
          description: string
          documentation_url: string | null
          featured: boolean | null
          id: string
          regions: string[] | null
          source_organization: string
          source_type: string
          tags: string[] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          access_url?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          data_format?: string | null
          description: string
          documentation_url?: string | null
          featured?: boolean | null
          id?: string
          regions?: string[] | null
          source_organization: string
          source_type?: string
          tags?: string[] | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          access_url?: string | null
          coverage_end?: string | null
          coverage_start?: string | null
          created_at?: string
          data_format?: string | null
          description?: string
          documentation_url?: string | null
          featured?: boolean | null
          id?: string
          regions?: string[] | null
          source_organization?: string
          source_type?: string
          tags?: string[] | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      dependency_advisories: {
        Row: {
          advisory_id: string
          advisory_url: string | null
          first_seen_at: string
          fixed_version: string | null
          id: string
          installed_version: string | null
          notified: boolean
          package_name: string
          resolved: boolean
          severity: string | null
          summary: string | null
        }
        Insert: {
          advisory_id: string
          advisory_url?: string | null
          first_seen_at?: string
          fixed_version?: string | null
          id?: string
          installed_version?: string | null
          notified?: boolean
          package_name: string
          resolved?: boolean
          severity?: string | null
          summary?: string | null
        }
        Update: {
          advisory_id?: string
          advisory_url?: string | null
          first_seen_at?: string
          fixed_version?: string | null
          id?: string
          installed_version?: string | null
          notified?: boolean
          package_name?: string
          resolved?: boolean
          severity?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      dependency_snapshot: {
        Row: {
          id: string
          installed_version: string
          package_name: string
          updated_at: string
        }
        Insert: {
          id?: string
          installed_version: string
          package_name: string
          updated_at?: string
        }
        Update: {
          id?: string
          installed_version?: string
          package_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      ethics_resources: {
        Row: {
          created_at: string
          description: string
          external_url: string | null
          featured: boolean | null
          id: string
          jurisdiction: string | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          external_url?: string | null
          featured?: boolean | null
          id?: string
          jurisdiction?: string | null
          resource_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          external_url?: string | null
          featured?: boolean | null
          id?: string
          jurisdiction?: string | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          attended: boolean | null
          event_id: string
          id: string
          registered_at: string
          reminder_sent: boolean | null
          user_id: string
        }
        Insert: {
          attended?: boolean | null
          event_id: string
          id?: string
          registered_at?: string
          reminder_sent?: boolean | null
          user_id: string
        }
        Update: {
          attended?: boolean | null
          event_id?: string
          id?: string
          registered_at?: string
          reminder_sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          featured: boolean | null
          host_name: string | null
          host_organization: string | null
          id: string
          is_virtual: boolean | null
          location: string | null
          max_attendees: number | null
          registration_deadline: string | null
          start_date: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          virtual_link: string | null
        }
        Insert: {
          created_at?: string
          description: string
          end_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          featured?: boolean | null
          host_name?: string | null
          host_organization?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_deadline?: string | null
          start_date: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          virtual_link?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          featured?: boolean | null
          host_name?: string | null
          host_organization?: string | null
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_attendees?: number | null
          registration_deadline?: string | null
          start_date?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          reply_count: number | null
          title: string
          topic_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          reply_count?: number | null
          title: string
          topic_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          reply_count?: number | null
          title?: string
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topic_suggestions: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          reviewed_at: string | null
          status: string
          suggested_by: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          reviewed_at?: string | null
          status?: string
          suggested_by: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          reviewed_at?: string | null
          status?: string
          suggested_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_topic_suggestions_suggested_by_fkey"
            columns: ["suggested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          post_count: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          post_count?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          post_count?: number | null
        }
        Relationships: []
      }
      login_attempts: {
        Row: {
          attempted_at: string
          email: string
          id: string
          ip_hint: string | null
          success: boolean
        }
        Insert: {
          attempted_at?: string
          email: string
          id?: string
          ip_hint?: string | null
          success?: boolean
        }
        Update: {
          attempted_at?: string
          email?: string
          id?: string
          ip_hint?: string | null
          success?: boolean
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          agency_type: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          email: string
          employees: string | null
          focus_areas: string[] | null
          founded: string | null
          id: string
          institution: string | null
          interests: string[] | null
          location: string | null
          major: string | null
          name: string
          notification_preferences: Json
          profile_type: Database["public"]["Enums"]["profile_type"]
          publications: number | null
          title: string | null
          tutorial_completed: boolean | null
          university: string | null
          updated_at: string
          user_id: string
          website: string | null
          year: string | null
        }
        Insert: {
          agency_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email: string
          employees?: string | null
          focus_areas?: string[] | null
          founded?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          location?: string | null
          major?: string | null
          name: string
          notification_preferences?: Json
          profile_type: Database["public"]["Enums"]["profile_type"]
          publications?: number | null
          title?: string | null
          tutorial_completed?: boolean | null
          university?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          year?: string | null
        }
        Update: {
          agency_type?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string
          employees?: string | null
          focus_areas?: string[] | null
          founded?: string | null
          id?: string
          institution?: string | null
          interests?: string[] | null
          location?: string | null
          major?: string | null
          name?: string
          notification_preferences?: Json
          profile_type?: Database["public"]["Enums"]["profile_type"]
          publications?: number | null
          title?: string | null
          tutorial_completed?: boolean | null
          university?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          year?: string | null
        }
        Relationships: []
      }
      prospect_searches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          initiated_by: string
          populations_used: string[]
          prospect_count: number
          status: string
          topics_used: string[]
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          initiated_by: string
          populations_used?: string[]
          prospect_count?: number
          status?: string
          topics_used?: string[]
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          initiated_by?: string
          populations_used?: string[]
          prospect_count?: number
          status?: string
          topics_used?: string[]
        }
        Relationships: []
      }
      prospects: {
        Row: {
          created_at: string
          department_title: string | null
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          organization: string | null
          outreach_status: string
          phone: string | null
          prospect_type: string
          relevance_score: number | null
          relevant_topics: string[] | null
          search_id: string
          social_profiles: Json | null
          source_url: string | null
          suggested_outreach: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          department_title?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          organization?: string | null
          outreach_status?: string
          phone?: string | null
          prospect_type?: string
          relevance_score?: number | null
          relevant_topics?: string[] | null
          search_id: string
          social_profiles?: Json | null
          source_url?: string | null
          suggested_outreach?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          department_title?: string | null
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          organization?: string | null
          outreach_status?: string
          phone?: string | null
          prospect_type?: string
          relevance_score?: number | null
          relevant_topics?: string[] | null
          search_id?: string
          social_profiles?: Json | null
          source_url?: string | null
          suggested_outreach?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prospects_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "prospect_searches"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          email: string
          id: string
          name: string
          organization: string
          organization_type: string
          phone_number: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          organization: string
          organization_type: string
          phone_number: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization?: string
          organization_type?: string
          phone_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      research_populations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      research_questions: {
        Row: {
          author_id: string
          created_at: string
          description: string
          id: string
          populations: string[] | null
          regions: string[] | null
          status: Database["public"]["Enums"]["research_question_status"] | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description: string
          id?: string
          populations?: string[] | null
          regions?: string[] | null
          status?:
            | Database["public"]["Enums"]["research_question_status"]
            | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string
          id?: string
          populations?: string[] | null
          regions?: string[] | null
          status?:
            | Database["public"]["Enums"]["research_question_status"]
            | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_questions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_submissions: {
        Row: {
          author_id: string
          created_at: string
          description: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          status: Database["public"]["Enums"]["submission_status"] | null
          submission_type: Database["public"]["Enums"]["submission_type"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          created_at?: string
          description: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"] | null
          submission_type: Database["public"]["Enums"]["submission_type"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          created_at?: string
          description?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          status?: Database["public"]["Enums"]["submission_status"] | null
          submission_type?: Database["public"]["Enums"]["submission_type"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_submissions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      research_topics: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      resource_bookmarks: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_bookmarks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          author: string | null
          category: string
          content: string | null
          created_at: string
          description: string
          download_count: number | null
          duration: string | null
          external_url: string | null
          featured: boolean | null
          file_url: string | null
          format: Database["public"]["Enums"]["resource_format"]
          id: string
          publication_date: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author?: string | null
          category: string
          content?: string | null
          created_at?: string
          description: string
          download_count?: number | null
          duration?: string | null
          external_url?: string | null
          featured?: boolean | null
          file_url?: string | null
          format: Database["public"]["Enums"]["resource_format"]
          id?: string
          publication_date?: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          created_at?: string
          description?: string
          download_count?: number | null
          duration?: string | null
          external_url?: string | null
          featured?: boolean | null
          file_url?: string | null
          format?: Database["public"]["Enums"]["resource_format"]
          id?: string
          publication_date?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      rfp_sections: {
        Row: {
          content_markdown: string
          group_name: string
          id: string
          is_custom: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content_markdown?: string
          group_name: string
          id?: string
          is_custom?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content_markdown?: string
          group_name?: string
          id?: string
          is_custom?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vulnerability_scan_runs: {
        Row: {
          advisories_found: number
          error: string | null
          id: string
          new_advisories: number
          ran_at: string
          status: string
        }
        Insert: {
          advisories_found?: number
          error?: string | null
          id?: string
          new_advisories?: number
          ran_at?: string
          status?: string
        }
        Update: {
          advisories_found?: number
          error?: string | null
          id?: string
          new_advisories?: number
          ran_at?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_partner_matches: {
        Args: { user_profile_id: string }
        Returns: {
          interests: string[]
          location: string
          match_score: number
          name: string
          profile_id: string
          profile_type: string
          shared_interests: string[]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      collaboration_status: "pending" | "accepted" | "declined"
      event_type:
        | "workshop"
        | "webinar"
        | "conference"
        | "networking"
        | "training"
      profile_type: "student" | "researcher" | "agency"
      research_question_status: "open" | "in_progress" | "completed" | "closed"
      resource_format:
        | "live"
        | "recorded"
        | "pdf"
        | "article"
        | "report"
        | "book"
      resource_type: "workshop" | "toolkit" | "reading"
      submission_status: "pending" | "approved" | "rejected"
      submission_type:
        | "student_project"
        | "faculty_research"
        | "agency_report"
        | "global_showcase"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      collaboration_status: ["pending", "accepted", "declined"],
      event_type: [
        "workshop",
        "webinar",
        "conference",
        "networking",
        "training",
      ],
      profile_type: ["student", "researcher", "agency"],
      research_question_status: ["open", "in_progress", "completed", "closed"],
      resource_format: ["live", "recorded", "pdf", "article", "report", "book"],
      resource_type: ["workshop", "toolkit", "reading"],
      submission_status: ["pending", "approved", "rejected"],
      submission_type: [
        "student_project",
        "faculty_research",
        "agency_report",
        "global_showcase",
      ],
    },
  },
} as const
