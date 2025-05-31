import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm'

// Initialize the Supabase client
const supabaseUrl = 'https://uzgxluiqyovpkyjpqles.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6Z3hsdWlxeW92cGt5anBxbGVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjQ2MDksImV4cCI6MjA2MDE0MDYwOX0.-TLpRGpDdLpIE7qRvlGPO_dwxgIl5my_xtqYjl6fXwI'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase