import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type REALTIME_TYPE = RealtimePostgresChangesPayload<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}>;
