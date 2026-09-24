export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instantiate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: "14.5";
	};
	public: {
		Tables: {
			classes: {
				Row: {
					access_code: string | null;
					created_at: string;
					id: string;
					is_playing: boolean;
					name: string;
					school_id: string;
					teacher_id: string | null;
				};
				Insert: {
					access_code?: string | null;
					created_at?: string;
					id?: string;
					is_playing?: boolean;
					name: string;
					school_id: string;
					teacher_id?: string | null;
				};
				Update: {
					access_code?: string | null;
					created_at?: string;
					id?: string;
					is_playing?: boolean;
					name?: string;
					school_id?: string;
					teacher_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "classes_school_id_fkey";
						columns: ["school_id"];
						isOneToOne: false;
						referencedRelation: "school";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "classes_teacher_id_fkey";
						columns: ["teacher_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			games: {
				Row: {
					key: string;
					name: string;
				};
				Insert: {
					key: string;
					name: string;
				};
				Update: {
					key?: string;
					name?: string;
				};
				Relationships: [];
			};
			levels: {
				Row: {
					config: Json;
					game_key: string;
					id: number;
					name: string;
				};
				Insert: {
					config: Json;
					game_key: string;
					id?: number;
					name: string;
				};
				Update: {
					config?: Json;
					game_key?: string;
					id?: number;
					name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "levels_game_key_fkey";
						columns: ["game_key"];
						isOneToOne: false;
						referencedRelation: "games";
						referencedColumns: ["key"];
					},
				];
			};
			profiles: {
				Row: {
					id: string;
					name: string | null;
					username: string | null;
				};
				Insert: {
					id: string;
					name?: string | null;
					username?: string | null;
				};
				Update: {
					id?: string;
					name?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
			progress: {
				Row: {
					end_time: string;
					id: number;
					level_id: number;
					metadata: Json;
					result: string;
					start_time: string;
					student_id: string;
				};
				Insert: {
					end_time: string;
					id?: number;
					level_id: number;
					metadata: Json;
					result: string;
					start_time: string;
					student_id: string;
				};
				Update: {
					end_time?: string;
					id?: number;
					level_id?: number;
					metadata?: Json;
					result?: string;
					start_time?: string;
					student_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "progress_level_id_fkey";
						columns: ["level_id"];
						isOneToOne: false;
						referencedRelation: "levels";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "progress_student_id_fkey";
						columns: ["student_id"];
						isOneToOne: false;
						referencedRelation: "students";
						referencedColumns: ["id"];
					},
				];
			};
			school: {
				Row: {
					cnpj: string;
					created_at: string;
					id: string;
					is_active: boolean;
					legal_name: string;
					trade_name: string;
				};
				Insert: {
					cnpj: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					legal_name: string;
					trade_name: string;
				};
				Update: {
					cnpj?: string;
					created_at?: string;
					id?: string;
					is_active?: boolean;
					legal_name?: string;
					trade_name?: string;
				};
				Relationships: [];
			};
			school_memberships: {
				Row: {
					profile_id: string;
					role: Database["public"]["Enums"]["profile_roles"];
					school_id: string;
					status: Database["public"]["Enums"]["invite_status"];
				};
				Insert: {
					profile_id: string;
					role: Database["public"]["Enums"]["profile_roles"];
					school_id: string;
					status?: Database["public"]["Enums"]["invite_status"];
				};
				Update: {
					profile_id?: string;
					role?: Database["public"]["Enums"]["profile_roles"];
					school_id?: string;
					status?: Database["public"]["Enums"]["invite_status"];
				};
				Relationships: [
					{
						foreignKeyName: "schools_profiles_profile_id_fkey";
						columns: ["profile_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schools_profiles_school_id_fkey";
						columns: ["school_id"];
						isOneToOne: false;
						referencedRelation: "school";
						referencedColumns: ["id"];
					},
				];
			};
			students: {
				Row: {
					access_code: string;
					class_id: string;
					created_at: string;
					id: string;
					name: string;
					school_id: string;
				};
				Insert: {
					access_code: string;
					class_id: string;
					created_at?: string;
					id?: string;
					name: string;
					school_id: string;
				};
				Update: {
					access_code?: string;
					class_id?: string;
					created_at?: string;
					id?: string;
					name?: string;
					school_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "student_class_id_fkey";
						columns: ["class_id"];
						isOneToOne: false;
						referencedRelation: "classes";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "student_school_id_fkey";
						columns: ["school_id"];
						isOneToOne: false;
						referencedRelation: "school";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			invite_status: "pending" | "active";
			profile_roles: "teacher" | "admin";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema["CompositeTypes"]
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {
			invite_status: ["pending", "active"],
			profile_roles: ["teacher", "admin"],
		},
	},
} as const;
