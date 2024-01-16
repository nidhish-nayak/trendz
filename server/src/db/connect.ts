import config from "$/config/config";
import { createClient } from "@supabase/supabase-js";
import { type Database } from "./database.types";

const { supabaseUrl, supabaseKey } = config.dbConfig;
const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);

export default supabase;
