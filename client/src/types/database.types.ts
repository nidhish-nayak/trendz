export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            comments: {
                Row: {
                    createdAt: string | null;
                    desc: string;
                    id: number;
                    postId: number;
                    userId: number;
                };
                Insert: {
                    createdAt?: string | null;
                    desc: string;
                    id?: number;
                    postId: number;
                    userId: number;
                };
                Update: {
                    createdAt?: string | null;
                    desc?: string;
                    id?: number;
                    postId?: number;
                    userId?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "comments_postId_fkey";
                        columns: ["postId"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "comments_userId_fkey";
                        columns: ["userId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            likes: {
                Row: {
                    id: number;
                    postId: number;
                    userId: number;
                };
                Insert: {
                    id?: number;
                    postId: number;
                    userId: number;
                };
                Update: {
                    id?: number;
                    postId?: number;
                    userId?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "likes_postId_fkey";
                        columns: ["postId"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "likes_userId_fkey";
                        columns: ["userId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            posts: {
                Row: {
                    createdAt: string | null;
                    desc: string | null;
                    id: number;
                    img: string | null;
                    userId: number;
                };
                Insert: {
                    createdAt?: string | null;
                    desc?: string | null;
                    id?: number;
                    img?: string | null;
                    userId: number;
                };
                Update: {
                    createdAt?: string | null;
                    desc?: string | null;
                    id?: number;
                    img?: string | null;
                    userId?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "posts_userId_fkey";
                        columns: ["userId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            relationships: {
                Row: {
                    followedUserId: number;
                    followerUserId: number;
                    id: number;
                };
                Insert: {
                    followedUserId: number;
                    followerUserId: number;
                    id?: number;
                };
                Update: {
                    followedUserId?: number;
                    followerUserId?: number;
                    id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "relationships_followedUserId_fkey";
                        columns: ["followedUserId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "relationships_followerUserId_fkey";
                        columns: ["followerUserId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            stories: {
                Row: {
                    id: number;
                    img: string;
                    userId: number;
                };
                Insert: {
                    id?: number;
                    img: string;
                    userId: number;
                };
                Update: {
                    id?: number;
                    img?: string;
                    userId?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "stories_userId_fkey";
                        columns: ["userId"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            users: {
                Row: {
                    city: string | null;
                    coverPic: string | null;
                    email: string;
                    id: number;
                    name: string;
                    password: string;
                    profilePic: string | null;
                    username: string;
                    website: string | null;
                };
                Insert: {
                    city?: string | null;
                    coverPic?: string | null;
                    email: string;
                    id?: number;
                    name: string;
                    password: string;
                    profilePic?: string | null;
                    username: string;
                    website?: string | null;
                };
                Update: {
                    city?: string | null;
                    coverPic?: string | null;
                    email?: string;
                    id?: number;
                    name?: string;
                    password?: string;
                    profilePic?: string | null;
                    username?: string;
                    website?: string | null;
                };
                Relationships: [];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            get_user_comments: {
                Args: Record<PropertyKey, never>;
                Returns: {
                    id: number;
                    desc: string;
                    createdAt: string;
                    userId: number;
                    postId: number;
                    name: string;
                    profilePic: string;
                }[];
            };
            get_user_posts: {
                Args: {
                    my_id: number;
                };
                Returns: {
                    id: number;
                    desc: string;
                    img: string;
                    userId: number;
                    createdAt: string;
                    name: string;
                    profilePic: string;
                }[];
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
          Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
          Database["public"]["Views"])[PublicTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof Database["public"]["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof Database["public"]["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof Database["public"]["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never;
