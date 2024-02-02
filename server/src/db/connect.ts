import config from "$/config/config";
import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";
import { type Database } from "./database.types";

// API Connect
const { supabaseUrl, supabaseKey } = config.dbConfig;
if (!supabaseUrl || !supabaseKey)
    throw new Error("Supabase API URL or KEY not found!");

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Direct Connect using Postgres
const { supabaseDirectUrl } = config.dbConfig;
if (!supabaseDirectUrl) throw new Error("Supabase Direct URL not found!");

export const sql = postgres(supabaseDirectUrl);
