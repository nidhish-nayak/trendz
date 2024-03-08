import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";

export type REALTIME_TYPE = RealtimePostgresInsertPayload<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}>;
