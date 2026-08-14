/* ==========================================
   dashboard.js
   Helping Hands NGO Platform
========================================== */

"use strict";

/* ==========================
   MOBILE SIDEBAR TOGGLE
========================== */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (menuToggle && sidebar) {

        const openSidebar = () => {
            sidebar.classList.add("active");
            if (overlay) overlay.classList.add("active");
        };

        const closeSidebar = () => {
            sidebar.classList.remove("active");
            if (overlay) overlay.classList.remove("active");
        };

        menuToggle.addEventListener("click", openSidebar);

        if (overlay) {
            overlay.addEventListener("click", closeSidebar);
        }

        sidebar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeSidebar);
        });
    }

});

/* ==========================
   USER DATA
========================== */

const user = JSON.parse(localStorage.getItem("currentUser")) || {
    name: "Ankit Kumar",
    email: "ankit@example.com",
    password: "1245678",
    city: "Aligarh",
    badge: "Community Hero"
};

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileCity = document.getElementById("profileCity");

if (profileName) profileName.innerText = user.name;
if (profileEmail) profileEmail.innerText = user.email;
if (profileCity) profileCity.innerText = user.city;

/* ==========================
   DARK MODE
========================== */

const darkBtn = document.getElementById("darkMode");

if (darkBtn) {

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }

    darkBtn.onclick = () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );

    };

}

/* ==========================
   COUNTER ANIMATION
========================== */

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target = Number(counter.dataset.target);

    let count = 0;

    const update = () => {

        const increment = Math.ceil(target / 70);

        count += increment;

        if (count >= target) {

            counter.innerText = target;

        } else {

            counter.innerText = count;

            requestAnimationFrame(update);

        }

    };

    update();

});

/* ==========================
   SEARCH
========================== */

const search = document.getElementById("search");

if (search) {

    search.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        document.querySelectorAll("table tbody tr")
            .forEach(row => {

                row.style.display =
                    row.innerText.toLowerCase().includes(value)
                        ? ""
                        : "none";

            });

    });

}

/* ==========================
   CHART
========================== */

document.querySelectorAll(".bar").forEach(bar => {

    const value = bar.dataset.value;

    bar.style.height = value + "%";

});

/* ==========================
   SAVE SETTINGS
========================== */

const saveBtn = document.getElementById("saveSettings");

if (saveBtn) {

    saveBtn.onclick = () => {

        alert("Settings Saved Successfully ✅");

    };

}

/* ==========================
   NOTIFICATIONS
========================== */

const notifications = [

    "Someone donated clothes.",
    "New help request received.",
    "Volunteer joined.",
    "Food donation completed.",
    "Medical request verified."

];

const noticeBox = document.getElementById("notifications");

if (noticeBox) {

    notifications.forEach(item => {

        const div = document.createElement("div");

        div.className = "notice";

        div.innerHTML = `
            <i class="fa-solid fa-bell"></i>
            <p>${item}</p>
        `;

        noticeBox.appendChild(div);

    });

}

/* ==========================
   LEADERBOARD
========================== */

const leaders = [

    {name:"Rahul",point:560},
    {name:"Priya",point:510},
    {name:"Ankit",point:480},
    {name:"Neha",point:450},
    {name:"Amit",point:420}

];

const leaderBox = document.getElementById("leaderboard");

if (leaderBox) {

    leaders.forEach((item,index)=>{

        leaderBox.innerHTML += `
        <div class="leader">

            <div class="leader-left">

                <div class="rank">${index+1}</div>

                <div>

                    <h4>${item.name}</h4>

                    <small>${item.point} Points</small>

                </div>

            </div>

            🏆

        </div>
        `;

    });

}

/* ==========================
   RECENT ACTIVITY
========================== */

const activity = document.getElementById("activity");

if(activity){

const data=[

"Food donated",

"Clothes distributed",

"Blood request completed",

"Volunteer joined",

"Medical support approved"

];

data.forEach(item=>{

activity.innerHTML+=`
<div class="activity-item">

<i class="fa-solid fa-circle-check"></i>

<p>${item}</p>

</div>
`;

});

}

/* ==========================
   LOGOUT
========================== */

const logout=document.getElementById("logout");

if(logout){

logout.onclick=()=>{

if(confirm("Logout?")){

localStorage.removeItem("currentUser");

if(window.sbClient){
    sbClient.auth.signOut();
}

location.href="login.html";

}           

}
}
/* ==========================
   WELCOME
========================== */

window.onload=()=>{

setTimeout(()=>{

alert("Welcome Back ❤️ "+user.name);

},500);

};

/* ==========================
   END
========================== */

console.log("Dashboard Loaded Successfully");