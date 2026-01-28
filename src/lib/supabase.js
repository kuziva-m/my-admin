import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fkzatfezfmgvurqwdhbj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZremF0ZmV6Zm1ndnVycXdkaGJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTgyNTksImV4cCI6MjA4NTE5NDI1OX0.i4pdHVVD_eOc63rvM_f9d7jU7zwfHXiuzMd4xLKEbHc";

export const supabase = createClient(supabaseUrl, supabaseKey);
