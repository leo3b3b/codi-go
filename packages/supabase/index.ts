import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export type { Json, Tables } from "./database.types";
export {
	generateImageCode,
	type ImageCode,
	imageCodes,
} from "./imageCodes";
