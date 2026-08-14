/* ===================================================
   app.js
   Helping Hands NGO Website
   Author : ChatGPT
=================================================== */

"use strict";

/* ==========================================
   LOADER
========================================== */

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (loader) {
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);
    }

});


/* ==========================================
   STICKY NAVBAR
========================================== */
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if(hamburger){
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";
        navbar.style.padding = "14px 8%";

    } else {

        navbar.style.boxShadow = "none";
        navbar.style.padding = "18px 8%";

    }

});


/* ==========================================
   BACK TO TOP BUTTON
========================================== */

const topBtn = document.querySelector(".top-btn");

window.addEventListener("scroll", () => {

    if (!topBtn) return;

    if (window.scrollY > 400) {

        topBtn.style.display = "flex";

    } else {

        topBtn.style.display = "none";

    }

});


if (topBtn) {

    topBtn.addEventListener("click", () => {

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}


/* ==========================================
   COUNTER ANIMATION
========================================== */

const counters = document.querySelectorAll(".card h2");

counters.forEach(counter=>{

    const update = ()=>{

        const target = parseInt(counter.innerText.replace(/\D/g,"")) || 0;

        let current = Number(counter.dataset.count || 0);

        const increment = Math.ceil(target/80);

        if(current < target){

            current += increment;

            if(current > target) current = target;

            counter.dataset.count = current;

            counter.innerText = current + "+";

            requestAnimationFrame(update);

        }else{

            counter.innerText = target + "+";

        }

    }

    update();

});


/* ==========================================
   FADE UP ANIMATION
========================================== */

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(".fade-up").forEach(item=>{

    observer.observe(item);

});


/* ==========================================
   SEARCH
========================================== */

const searchInput = document.querySelector(".search-box input");

const cards = document.querySelectorAll(".request-card");

if(searchInput){

searchInput.addEventListener("keyup",()=>{

const value = searchInput.value.toLowerCase();

cards.forEach(card=>{

const text = card.innerText.toLowerCase();

card.style.display = text.includes(value) ? "block" : "none";

});

});

}


/* ==========================================
   NEWSLETTER
========================================== */

const newsletterBtn = document.querySelector(".newsletter button");

if(newsletterBtn){

newsletterBtn.addEventListener("click",()=>{

const email = document.querySelector(".newsletter input").value;

const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;

if(pattern.test(email)){

alert("Thank you for subscribing ❤️");

document.querySelector(".newsletter input").value="";

}else{

alert("Please enter a valid email.");

}

});

}


/* ==========================================
   BUTTON RIPPLE
========================================== */

document.querySelectorAll("button").forEach(button=>{

button.addEventListener("click",(e)=>{

const circle=document.createElement("span");

const diameter=Math.max(button.clientWidth,button.clientHeight);

circle.style.width=circle.style.height=diameter+"px";

circle.style.left=e.offsetX-diameter/2+"px";

circle.style.top=e.offsetY-diameter/2+"px";

circle.classList.add("ripple");

button.appendChild(circle);

setTimeout(()=>{

circle.remove();

},600);

});

});


/* ==========================================
   DARK MODE
========================================== */

const darkToggle=document.querySelector(".dark-mode");

if(darkToggle){

darkToggle.addEventListener("click",()=>{

document.body.classList.toggle("dark");

localStorage.setItem(

"theme",

document.body.classList.contains("dark")?"dark":"light"

);

});

}

window.onload=()=>{

if(localStorage.getItem("theme")=="dark"){

document.body.classList.add("dark");

}

}



/* ==========================================
   DONATE BUTTON (fallback for any static
   .request-card buttons still on the page)
========================================== */

document.querySelectorAll(".request-card button[data-static]").forEach(btn=>{

btn.addEventListener("click",()=>{

alert("Thank you for helping someone ❤️");

});

});


/* ==========================================
   SCROLL SMOOTH LINKS
========================================== */

document.querySelectorAll("a[href^='#']").forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

const target=document.querySelector(this.getAttribute("href"));

if(target){

target.scrollIntoView({

behavior:"smooth"

});

}

});

});


/* ==========================================
   SIMPLE NOTIFICATION
========================================== */

function showNotification(message){

const note=document.createElement("div");

note.innerHTML=message;

note.style.position="fixed";

note.style.top="20px";

note.style.right="20px";

note.style.background="#0F766E";

note.style.color="#fff";

note.style.padding="15px 25px";

note.style.borderRadius="10px";

note.style.boxShadow="0 10px 25px rgba(0,0,0,.2)";

note.style.zIndex="9999";

document.body.appendChild(note);

setTimeout(()=>{

note.remove();

},3000);

}


/* ==========================================
   WELCOME MESSAGE
========================================== */

setTimeout(()=>{

showNotification("❤️ Welcome to Helping Hands");

},1500);


/* ==========================================
   END
========================================== */