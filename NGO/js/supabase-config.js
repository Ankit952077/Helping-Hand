const SUPABASE_URL = "https://faswyojqyllwelkwrvif.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhc3d5b2pxeWxsd2Vsa3dydmlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNjcwOTcsImV4cCI6MjEwMDY0MzA5N30.x_Bu31tTGSni2B5EWn6PGPs8Q8kUVbZdBQm9fyyCMjM";

window.sbClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Emails jo Admin maane jaayenge (login ke baad inhi emails ko
// admin-dashboard.html par bheja jaayega). Apna real admin email
// yahan daal do — jitne chaho utne add kar sakte ho.
window.ADMIN_EMAILS = [
    "theboy952077@gmail.com"
];

console.log("Connected", window.sbClient);