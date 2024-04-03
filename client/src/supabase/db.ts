import { createClient } from "@supabase/supabase-js";
import config from "../config/config";

const supabaseUrl = config.supabase.db_url;
const supabaseKey = config.supabase.db_key;

if (!supabaseKey || !supabaseUrl) throw Error("Supabase connection failed!");

export const supabase = createClient(supabaseUrl, supabaseKey, {
	realtime: {
		params: {
			eventsPerSecond: 1,
		},
	},
});
