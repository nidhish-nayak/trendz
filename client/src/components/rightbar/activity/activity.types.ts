import {
    RealtimePostgresDeletePayload,
    RealtimePostgresInsertPayload,
} from "@supabase/supabase-js";

export type REALTIME_TYPE =
    | RealtimePostgresInsertPayload<{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any;
      }>
    | RealtimePostgresDeletePayload<{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key: string]: any;
      }>;

export type ACTIVITY_POST_TYPES = {
    table_name: string;
    message: string;
    activity_created_at: string;
    user_id: number;
    post_id: number;
};

export type ACTIVITY_COMMENT_TYPES = {
    table_name: string;
    message: string;
    activity_created_at: string;
    user_id: number;
    post_id: number;
    comment_id?: number;
};

export type ACTIVITY_GET_TYPES = {
    id: number;
    table_name: string;
    message: string;
    activity_created_at: string;
    user_id: number;
    post_id: number;
    comment_id: number | null;
    name: string;
    profilePic: string;
};
