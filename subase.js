const {createClient} = require('@supabase/supabase-js')


const supabaseUrl = "https://xoxjeqwyfrvmrmhmyuiz.supabase.co";
const supabaseAnonKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhveGplcXd5ZnJ2bXJtaG15dWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNzAxNDIsImV4cCI6MjAyNjk0NjE0Mn0.1xPNyGLVir15vLijJ_hzBTczWdqHBtqO0l_UajRlBOE`;


const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});


module.exports = supabase;
