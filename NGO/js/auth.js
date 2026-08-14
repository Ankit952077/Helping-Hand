/* ==========================================
   auth.js
   Helping Hands NGO
   Login + Register System (Supabase)
========================================== */


/* ==========================
   REGISTER USER
========================== */

const registerForm = document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", async function(e){

        e.preventDefault();

        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let phone = document.getElementById("phone").value;
        let password = document.getElementById("password").value;
        let city = document.getElementById("city").value;
        let state = document.getElementById("state") ? document.getElementById("state").value : "";
        let gender = document.getElementById("gender") ? document.getElementById("gender").value : "";
        let about = document.getElementById("about") ? document.getElementById("about").value : "";
        let role = document.getElementById("role") ? document.getElementById("role").value : "user";

        const submitBtn = registerForm.querySelector('button:not(.google)');
        if(submitBtn){ submitBtn.disabled = true; }

        const { data, error } = await sbClient.auth.signUp({
            email: email,
            password: password
        });

        if(error){
            alert(error.message);
            if(submitBtn){ submitBtn.disabled = false; }
            return;
        }

        // extra info users table mein save karo
        const { error: insertError } = await sbClient.from('users').insert([
            { name, email, phone, city, state, gender, about, role }
        ]);

        if(insertError){
            alert(insertError.message);
            if(submitBtn){ submitBtn.disabled = false; }
            return;
        }

        alert("Registration Successful ❤️ Please check your email to verify.");

        window.location.href = "index.html";
        

    });

}


/* ==========================
   LOGIN USER
========================== */

const loginForm = document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener("submit", async function(e){

        e.preventDefault();

        let email = document.getElementById("loginEmail").value;
        let password = document.getElementById("loginPassword").value;

        const loginBtn = loginForm.querySelector('button:not(.google)');
        if(loginBtn){ loginBtn.disabled = true; }

        const { data, error } = await sbClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if(error){
            alert("Invalid Email or Password ❌");
            if(loginBtn){ loginBtn.disabled = false; }
            return;
        }

        alert("Login Successful ✅");

        // Email ke basis par decide karo ki admin hai ya normal user/volunteer
        const isAdmin = (window.ADMIN_EMAILS || [])
            .map(e => e.toLowerCase())
            .includes(email.toLowerCase());

        if(isAdmin){
            localStorage.setItem("adminLogin", "true");
            window.location.href = "admin-dashboard.html";
            return;
        }

        // Users table se profile (role samet) laake dashboard.js ke liye save karo
        const { data: profile } = await sbClient
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if(profile){
            localStorage.setItem("currentUser", JSON.stringify(profile));
        }

        window.location.href = "dashboard.html";

    });

}


/* ==========================
   LOGOUT
========================== */

async function logout(){

    await sbClient.auth.signOut();

    alert("Logged Out Successfully");

    window.location.href = "login.html";

}


/* ==========================
   CHECK LOGIN
========================== */

async function checkLogin(){

    const { data: { session } } = await sbClient.auth.getSession();

    let protectedPages = [
        "dashboard.html",
        "profile.html",
        "notifications.html"
    ];

    let currentPage = window.location.pathname;

    protectedPages.forEach(page => {

        if(currentPage.includes(page) && !session){

            window.location.href = "login.html";

        }

    });

}

checkLogin();


/* ==========================
   PASSWORD SHOW/HIDE
========================== */

function showPassword(){

    let pass = document.getElementById("loginPassword");

    if(pass.type === "password"){
        pass.type = "text";
    } else {
        pass.type = "password";
    }

}


/* ==========================
   USER DATA DISPLAY
========================== */

async function loadUser(){

    const { data: { user } } = await sbClient.auth.getUser();

    if(!user) return;

    const { data: profile } = await sbClient
        .from('users')
        .select('*')
        .eq('email', user.email)
        .single();

    if(profile){

        let elements = document.querySelectorAll(".username");

        elements.forEach(item => {
            item.innerHTML = profile.name;
        });

    }

}

loadUser();

console.log("Authentication System Loaded ✅ (Supabase)");