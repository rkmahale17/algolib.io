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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      algorithm_implementations: {
        Row: {
          code_cpp: string
          code_java: string
          code_python: string
          code_typescript: string
          created_at: string
          explanation_overview: string
          explanation_steps: Json | null
          explanation_tips: Json | null
          explanation_use_case: string
          id: string
          practice_problems: Json | null
          updated_at: string
          visualization_type: string
        }
        Insert: {
          code_cpp: string
          code_java: string
          code_python: string
          code_typescript: string
          created_at?: string
          explanation_overview: string
          explanation_steps?: Json | null
          explanation_tips?: Json | null
          explanation_use_case: string
          id: string
          practice_problems?: Json | null
          updated_at?: string
          visualization_type: string
        }
        Update: {
          code_cpp?: string
          code_java?: string
          code_python?: string
          code_typescript?: string
          created_at?: string
          explanation_overview?: string
          explanation_steps?: Json | null
          explanation_tips?: Json | null
          explanation_use_case?: string
          id?: string
          practice_problems?: Json | null
          updated_at?: string
          visualization_type?: string
        }
        Relationships: []
      }
      algorithms: {
        Row: {
          category: string
          created_at: string | null
          description: string
          difficulty: string
          explanation: Json
          id: string
          implementations: Json
          input_schema: Json | null
          metadata: Json | null
          name: string
          problems_to_solve: Json | null
          test_cases: Json | null
          title: string
          tutorials: Json | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          difficulty: string
          explanation?: Json
          id: string
          implementations?: Json
          input_schema?: Json | null
          metadata?: Json | null
          name: string
          problems_to_solve?: Json | null
          test_cases?: Json | null
          title: string
          tutorials?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          difficulty?: string
          explanation?: Json
          id?: string
          implementations?: Json
          input_schema?: Json | null
          metadata?: Json | null
          name?: string
          problems_to_solve?: Json | null
          test_cases?: Json | null
          title?: string
          tutorials?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      blind75_implementations: {
        Row: {
          code_cpp: string
          code_java: string
          code_python: string
          code_typescript: string
          created_at: string
          explanation: string
          slug: string
          updated_at: string
        }
        Insert: {
          code_cpp: string
          code_java: string
          code_python: string
          code_typescript: string
          created_at?: string
          explanation: string
          slug: string
          updated_at?: string
        }
        Update: {
          code_cpp?: string
          code_java?: string
          code_python?: string
          code_typescript?: string
          created_at?: string
          explanation?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blind75_problems: {
        Row: {
          algorithm_id: string | null
          category: string
          companies: Json | null
          created_at: string
          description: string
          difficulty: string
          id: number
          leetcode_search: string
          slug: string
          space_complexity: string
          tags: Json | null
          time_complexity: string
          title: string
          updated_at: string
          use_cases: Json | null
          youtube_url: string | null
        }
        Insert: {
          algorithm_id?: string | null
          category: string
          companies?: Json | null
          created_at?: string
          description: string
          difficulty: string
          id: number
          leetcode_search: string
          slug: string
          space_complexity: string
          tags?: Json | null
          time_complexity: string
          title: string
          updated_at?: string
          use_cases?: Json | null
          youtube_url?: string | null
        }
        Update: {
          algorithm_id?: string | null
          category?: string
          companies?: Json | null
          created_at?: string
          description?: string
          difficulty?: string
          id?: number
          leetcode_search?: string
          slug?: string
          space_complexity?: string
          tags?: Json | null
          time_complexity?: string
          title?: string
          updated_at?: string
          use_cases?: Json | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          completed_at: string
          created_at: string
          duration_seconds: number | null
          errors: number
          game_type: Database["public"]["Enums"]["game_type"]
          grade: string | null
          hints_used: number
          id: string
          level: number
          moves: number
          score: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          errors?: number
          game_type: Database["public"]["Enums"]["game_type"]
          grade?: string | null
          hints_used?: number
          id?: string
          level: number
          moves?: number
          score: number
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          duration_seconds?: number | null
          errors?: number
          game_type?: Database["public"]["Enums"]["game_type"]
          grade?: string | null
          hints_used?: number
          id?: string
          level?: number
          moves?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          algorithm_id: string | null
          created_at: string
          id: string
          notes_text: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          algorithm_id?: string | null
          created_at?: string
          id?: string
          notes_text?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          algorithm_id?: string | null
          created_at?: string
          id?: string
          notes_text?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          algorithm_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          time_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          algorithm_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          time_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          algorithm_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          time_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_whiteboards: {
        Row: {
          algorithm_id: string | null
          board_json: Json
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          algorithm_id?: string | null
          board_json?: Json
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          algorithm_id?: string | null
          board_json?: Json
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_algorithms_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      game_type:
        | "sort_hero"
        | "graph_explorer"
        | "stack_master"
        | "dp_puzzle"
        | "sliding_window"
        | "two_pointer"
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
      game_type: [
        "sort_hero",
        "graph_explorer",
        "stack_master",
        "dp_puzzle",
        "sliding_window",
        "two_pointer",
      ],
    },
  },
} as const
