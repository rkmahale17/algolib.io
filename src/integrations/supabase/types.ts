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
      algorithms: {
        Row: {
          categories: string[]
          category: string
          controls: Json | null
          created_at: string | null
          description: string
          difficulty: string
          explanation: Json
          id: string
          implementations: Json
          input_schema: Json | null
          list_type: string | null
          list_types: string[]
          metadata: Json | null
          name: string
          problem_type: string | null
          problems_to_solve: Json | null
          published: boolean
          serial_no: number | null
          space_complexity: string | null
          test_cases: Json | null
          time_complexity: string | null
          title: string
          tutorials: Json | null
          updated_at: string | null
        }
        Insert: {
          categories?: string[]
          category: string
          controls?: Json | null
          created_at?: string | null
          description: string
          difficulty: string
          explanation?: Json
          id: string
          implementations?: Json
          input_schema?: Json | null
          list_type?: string | null
          list_types?: string[]
          metadata?: Json | null
          name: string
          problem_type?: string | null
          problems_to_solve?: Json | null
          published?: boolean
          serial_no?: number | null
          space_complexity?: string | null
          test_cases?: Json | null
          time_complexity?: string | null
          title: string
          tutorials?: Json | null
          updated_at?: string | null
        }
        Update: {
          categories?: string[]
          category?: string
          controls?: Json | null
          created_at?: string | null
          description?: string
          difficulty?: string
          explanation?: Json
          id?: string
          implementations?: Json
          input_schema?: Json | null
          list_type?: string | null
          list_types?: string[]
          metadata?: Json | null
          name?: string
          problem_type?: string | null
          problems_to_solve?: Json | null
          published?: boolean
          serial_no?: number | null
          space_complexity?: string | null
          test_cases?: Json | null
          time_complexity?: string | null
          title?: string
          tutorials?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_enabled: boolean | null
          key: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          key: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_anonymous: boolean | null
          status: string
          title: string
          type: string | null
          updated_at: string
          upvotes_count: number | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          status?: string
          title: string
          type?: string | null
          updated_at?: string
          upvotes_count?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_anonymous?: boolean | null
          status?: string
          title?: string
          type?: string | null
          updated_at?: string
          upvotes_count?: number | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_comments: {
        Row: {
          content: string
          created_at: string
          feedback_id: string
          id: string
          is_anonymous: boolean | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          feedback_id: string
          id?: string
          is_anonymous?: boolean | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          feedback_id?: string
          id?: string
          is_anonymous?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_comments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_votes: {
        Row: {
          created_at: string
          feedback_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_votes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_users: {
        Row: {
          note: string | null
          user_id: string
        }
        Insert: {
          note?: string | null
          user_id: string
        }
        Update: {
          note?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mailed_events: {
        Row: {
          action_type: string
          created_at: string
          error: string | null
          id: string
          idempotency_key: string
          payload: Json | null
          redirect_to: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["email_status"]
          sub_action_type: string | null
          token_hash: string | null
          user_email: string
        }
        Insert: {
          action_type: string
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key: string
          payload?: Json | null
          redirect_to?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          sub_action_type?: string | null
          token_hash?: string | null
          user_email: string
        }
        Update: {
          action_type?: string
          created_at?: string
          error?: string | null
          id?: string
          idempotency_key?: string
          payload?: Json | null
          redirect_to?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          sub_action_type?: string | null
          token_hash?: string | null
          user_email?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cancel_at_period_end: boolean | null
          company: string | null
          created_at: string | null
          current_period_end: string | null
          customer_portal_url: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          github_url: string | null
          id: string
          is_public: boolean | null
          linkedin_url: string | null
          location: string | null
          role: string | null
          subscription_duration: string | null
          subscription_id: string | null
          subscription_plan_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          trial_end_date: string | null
          twitter_url: string | null
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cancel_at_period_end?: boolean | null
          company?: string | null
          created_at?: string | null
          current_period_end?: string | null
          customer_portal_url?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          is_public?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          role?: string | null
          subscription_duration?: string | null
          subscription_id?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cancel_at_period_end?: boolean | null
          company?: string | null
          created_at?: string | null
          current_period_end?: string | null
          customer_portal_url?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean | null
          linkedin_url?: string | null
          location?: string | null
          role?: string | null
          subscription_duration?: string | null
          subscription_id?: string | null
          subscription_plan_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          trial_end_date?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          compile_output: string | null
          created_at: string | null
          finished_at: string | null
          id: string
          judge0_token: string | null
          language_id: number
          memory: number | null
          message: string | null
          problem_id: string | null
          source_code: string
          status: string | null
          stderr: string | null
          stdout: string | null
          time: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compile_output?: string | null
          created_at?: string | null
          finished_at?: string | null
          id?: string
          judge0_token?: string | null
          language_id: number
          memory?: number | null
          message?: string | null
          problem_id?: string | null
          source_code: string
          status?: string | null
          stderr?: string | null
          stdout?: string | null
          time?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compile_output?: string | null
          created_at?: string | null
          finished_at?: string | null
          id?: string
          judge0_token?: string | null
          language_id?: number
          memory?: number | null
          message?: string | null
          problem_id?: string | null
          source_code?: string
          status?: string | null
          stderr?: string | null
          stdout?: string | null
          time?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      submission_performance: {
        Row: {
          id: string
          user_id: string
          algorithm_id: string
          language: string
          status: string
          execution_time_ms: number | null
          memory_usage_kb: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          algorithm_id: string
          language: string
          status: string
          execution_time_ms?: number | null
          memory_usage_kb?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          algorithm_id?: string
          language?: string
          status?: string
          execution_time_ms?: number | null
          memory_usage_kb?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_algorithm_data: {
        Row: {
          algorithm_id: string
          code: Json | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          is_favorite: boolean | null
          last_viewed_at: string | null
          notes: string | null
          share_count: number | null
          submissions: Json | null
          time_spent_seconds: number | null
          updated_at: string | null
          user_id: string
          user_vote: string | null
          whiteboard_data: Json | null
          visualization_completed: boolean | null
          drawing_completed: boolean | null
          solution_completed: boolean | null
        }
        Insert: {
          algorithm_id: string
          code?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          notes?: string | null
          share_count?: number | null
          submissions?: Json | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id: string
          user_vote?: string | null
          whiteboard_data?: Json | null
          visualization_completed?: boolean | null
          drawing_completed?: boolean | null
          solution_completed?: boolean | null
        }
        Update: {
          algorithm_id?: string
          code?: Json | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          last_viewed_at?: string | null
          notes?: string | null
          share_count?: number | null
          submissions?: Json | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string
          user_vote?: string | null
          whiteboard_data?: Json | null
          visualization_completed?: boolean | null
          drawing_completed?: boolean | null
          solution_completed?: boolean | null
        }
        Relationships: []
      }
      webhook_events: {
        Row: {
          attempt_count: number
          event_id: string
          event_name: string
          id: string
          idempotency_key: string
          last_error: string | null
          payload: Json
          processed_at: string | null
          received_at: string
          resource_id: string
          resource_type: string
          resource_updated_at: string
          skip_reason: string | null
          status: Database["public"]["Enums"]["webhook_status"]
        }
        Insert: {
          attempt_count?: number
          event_id: string
          event_name: string
          id?: string
          idempotency_key: string
          last_error?: string | null
          payload: Json
          processed_at?: string | null
          received_at?: string
          resource_id: string
          resource_type: string
          resource_updated_at: string
          skip_reason?: string | null
          status?: Database["public"]["Enums"]["webhook_status"]
        }
        Update: {
          attempt_count?: number
          event_id?: string
          event_name?: string
          id?: string
          idempotency_key?: string
          last_error?: string | null
          payload?: Json
          processed_at?: string | null
          received_at?: string
          resource_id?: string
          resource_type?: string
          resource_updated_at?: string
          skip_reason?: string | null
          status?: Database["public"]["Enums"]["webhook_status"]
        }
        Relationships: []
      }
      visualization_feedback: {
        Row: {
          algorithm_id: string
          created_at: string
          feedback_checkboxes: Json
          id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          algorithm_id: string
          created_at?: string
          feedback_checkboxes?: Json
          id?: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          algorithm_id?: string
          created_at?: string
          feedback_checkboxes?: Json
          id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visualization_feedback_algorithm_id_fkey"
            columns: ["algorithm_id"]
            isOneToOne: false
            referencedRelation: "algorithms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visualization_feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_submission_distribution: {
        Args: {
          p_algorithm_id: string
          p_language: string
          p_user_time_ms?: number | null
          p_user_memory_kb?: number | null
        }
        Returns: Json
      }
      is_algorithms_admin: { Args: never; Returns: boolean }
      is_internal_user: { Args: { u: string }; Returns: boolean }
    }
    Enums: {
      email_status: "pending" | "sent" | "failed" | "skipped" | "duplicate"
      game_type:
        | "sort_hero"
        | "graph_explorer"
        | "stack_master"
        | "dp_puzzle"
        | "sliding_window"
        | "two_pointer"
      webhook_status:
        | "received"
        | "processing"
        | "processed"
        | "failed"
        | "dead_lettered"
        | "skipped"
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
      email_status: ["pending", "sent", "failed", "skipped", "duplicate"],
      game_type: [
        "sort_hero",
        "graph_explorer",
        "stack_master",
        "dp_puzzle",
        "sliding_window",
        "two_pointer",
      ],
      webhook_status: [
        "received",
        "processing",
        "processed",
        "failed",
        "dead_lettered",
        "skipped",
      ],
    },
  },
} as const
