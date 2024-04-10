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
            activities: {
                Row: {
                    activity_created_at: string;
                    comment_id: number | null;
                    id: number;
                    message: string;
                    post_id: number | null;
                    table_name: string;
                    user_id: number;
                };
                Insert: {
                    activity_created_at?: string;
                    comment_id?: number | null;
                    id?: number;
                    message: string;
                    post_id?: number | null;
                    table_name: string;
                    user_id: number;
                };
                Update: {
                    activity_created_at?: string;
                    comment_id?: number | null;
                    id?: number;
                    message?: string;
                    post_id?: number | null;
                    table_name?: string;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "public_activities_comment_id_fkey";
                        columns: ["comment_id"];
                        isOneToOne: false;
                        referencedRelation: "comments";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "public_activities_post_id_fkey";
                        columns: ["post_id"];
                        isOneToOne: false;
                        referencedRelation: "posts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "public_activities_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
            bans: {
                Row: {
                    created_at: string;
                    id: number;
                    user_id: number;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    user_id: number;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    user_id?: number;
                };
                Relationships: [
                    {
                        foreignKeyName: "public_bans_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    },
                ];
            };
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
                    },
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
                    },
                ];
            };
            logs: {
                Row: {
                    created_at: string;
                    id: number;
                    img: string;
                    type: string;
                    user_id: number;
                };
                Insert: {
                    created_at?: string;
                    id?: number;
                    img: string;
                    type: string;
                    user_id: number;
                };
                Update: {
                    created_at?: string;
                    id?: number;
                    img?: string;
                    type?: string;
                    user_id?: number;
                };
                Relationships: [];
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
                    },
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
                    },
                ];
            };
            stories: {
                Row: {
                    createdAt: string | null;
                    id: number;
                    img: string;
                    userId: number;
                };
                Insert: {
                    createdAt?: string | null;
                    id?: number;
                    img: string;
                    userId: number;
                };
                Update: {
                    createdAt?: string | null;
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
                    },
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
            get_activities: {
                Args: {
                    my_user_id: number;
                    activity_limit: number;
                };
                Returns: {
                    id: number;
                    table_name: string;
                    message: string;
                    activity_created_at: string;
                    user_id: number;
                    post_id: number;
                    comment_id: number;
                    name: string;
                    profilePic: string;
                }[];
            };
            get_explore_posts: {
                Args: {
                    user_id: number;
                    limit_no: number;
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
            get_findpeople: {
                Args: {
                    my_user_id: number;
                };
                Returns: {
                    id: number;
                    name: string;
                    username: string;
                    profilePic: string;
                }[];
            };
            get_followers_id: {
                Args: {
                    my_user_id: number;
                };
                Returns: {
                    followeruserid: number;
                }[];
            };
            get_following_id: {
                Args: {
                    my_user_id: number;
                };
                Returns: {
                    followinguserid: number;
                }[];
            };
            get_friends_id: {
                Args: {
                    my_user_id: number;
                };
                Returns: {
                    frienduserid: number;
                }[];
            };
            get_post_likes: {
                Args: {
                    post_id: number;
                    user_id: number;
                };
                Returns: {
                    liked: boolean;
                    count: number;
                }[];
            };
            get_single_post: {
                Args: {
                    my_post_id: number;
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
            get_stories: {
                Args: {
                    user_id: number;
                };
                Returns: {
                    id: number;
                    img: string;
                    userId: number;
                    createdAt: string;
                    name: string;
                }[];
            };
            get_user_comments: {
                Args: {
                    post_id: number;
                };
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
                    page?: number;
                    page_size?: number;
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

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
            PublicSchema["Views"])
      ? (PublicSchema["Tables"] &
            PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R;
        }
          ? R
          : never
      : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Insert: infer I;
        }
          ? I
          : never
      : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
            Update: infer U;
        }
          ? U
          : never
      : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
      ? PublicSchema["Enums"][PublicEnumNameOrOptions]
      : never;
