/**
 * Supabase Database type definitions.
 * Mirrors the SQL schema in plans.md (Phase 0 subset).
 *
 * Generated manually for Phase 0 — replace with `supabase gen types` in CI later.
 */

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          tier: 'anonymous' | 'email' | 'passkey';
          email: string | null;
          email_verified: boolean | null;
          wallet_stellar: string | null;
          wallet_evm: string | null;
          username: string | null;
          display_name: string | null;
          bio: string | null;
          avatar_path: string | null;
          recovery_key_hash: string | null;
          recovery_key_verified_at: string | null;
          twofa_enabled: boolean | null;
          backup_codes_hash: string[] | null;
          created_at: string;
          last_active_at: string | null;
          inactivity_wipe_at: string | null;
          deletion_requested_at: string | null;
        };
        Insert: Partial<Database['public']['Tables']['users']['Row']> & {
          id: string;
          tier: 'anonymous' | 'email' | 'passkey';
        };
        Update: Partial<Database['public']['Tables']['users']['Row']>;
      };
      capsules: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          unlock_at: string;
          drand_round: number;
          chain_id: string;
          visibility: 'private' | 'unlisted' | 'public';
          share_slug: string | null;
          cover_color: string | null;
          cover_font: string | null;
          is_collaborative: boolean | null;
          stellar_anchor_tx: string | null;
          stellar_anchor_hash: string | null;
          created_at: string;
          opened_at: string | null;
          size_bytes: number | null;
        };
        Insert: Partial<Database['public']['Tables']['capsules']['Row']> & {
          id: string;
          owner_id: string;
          unlock_at: string;
        };
        Update: Partial<Database['public']['Tables']['capsules']['Row']>;
      };
      capsule_authors: {
        Row: {
          capsule_id: string;
          user_id: string;
          role: 'owner' | 'co-author';
          added_at: string;
        };
        Insert: Database['public']['Tables']['capsule_authors']['Row'];
        Update: Partial<Database['public']['Tables']['capsule_authors']['Row']>;
      };
      capsule_assets: {
        Row: {
          id: string;
          capsule_id: string;
          kind: 'text' | 'image' | 'audio' | 'video' | 'file';
          storage_path: string;
          mime: string;
          size_bytes: number;
          encrypted_meta: unknown;
          created_at: string;
        };
        Insert: Partial<Database['public']['Tables']['capsule_assets']['Row']> & {
          id: string;
          capsule_id: string;
        };
        Update: Partial<Database['public']['Tables']['capsule_assets']['Row']>;
      };
      user_passkeys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          credential_id: string;
          public_key: string;
          created_at: string;
          last_used_at: string | null;
        };
        Insert: Database['public']['Tables']['user_passkeys']['Row'];
        Update: Partial<Database['public']['Tables']['user_passkeys']['Row']>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          device: string | null;
          ip_region: string | null;
          user_agent: string | null;
          created_at: string;
          last_active_at: string | null;
          revoked_at: string | null;
        };
        Insert: Database['public']['Tables']['sessions']['Row'];
        Update: Partial<Database['public']['Tables']['sessions']['Row']>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          capsule_id: string | null;
          type: string;
          scheduled_for: string;
          sent_at: string | null;
          payload: unknown;
        };
        Insert: Database['public']['Tables']['notifications']['Row'];
        Update: Partial<Database['public']['Tables']['notifications']['Row']>;
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          capsule_id: string;
          reason: string;
          status: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['reports']['Row'];
        Update: Partial<Database['public']['Tables']['reports']['Row']>;
      };
      blocks: {
        Row: {
          blocker_id: string;
          blocked_id: string;
          created_at: string;
        };
        Insert: Database['public']['Tables']['blocks']['Row'];
        Update: Partial<Database['public']['Tables']['blocks']['Row']>;
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          metadata: unknown;
          created_at: string;
        };
        Insert: Database['public']['Tables']['audit_log']['Row'];
        Update: Partial<Database['public']['Tables']['audit_log']['Row']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
