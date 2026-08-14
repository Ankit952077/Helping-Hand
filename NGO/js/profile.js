/* ==========================================
   profile.js
   Helping Hands NGO
   User Profile Management
========================================== */


/* ==========================
   LOAD PROFILE DATA
========================== */


function loadProfile(){


let user = JSON.parse(

localStorage.getItem("currentUser")

);



if(!user){

return;

}



const name = document.getElementById("userName");

const email = document.getElementById("userEmail");

const phone = document.getElementById("userPhone");

const city = document.getElementById("userCity");

const bio = document.getElementById("userBio");



if(name)

name.innerText=user.name;



if(email)

email.innerText=user.email;



if(phone)

phone.innerText=user.phone;



if(city)

city.innerText=user.city;



if(bio)

bio.innerText=user.bio || "No Bio Added";



}





/* ==========================
   UPDATE PROFILE
========================== */


const updateProfile = document.getElementById(

"updateProfile"

);



if(updateProfile){


updateProfile.addEventListener(

"submit",

function(e){


e.preventDefault();



let user = JSON.parse(

localStorage.getItem("currentUser")

);



user.name=document.getElementById(

"editName"

).value;



user.phone=document.getElementById(

"editPhone"

).value;



user.city=document.getElementById(

"editCity"

).value;



user.bio=document.getElementById(

"editBio"

).value;



localStorage.setItem(

"currentUser",

JSON.stringify(user)

);



alert(

"Profile Updated Successfully ❤️"

);



location.reload();



}


);


}





/* ==========================
   PROFILE IMAGE CHANGE
========================== */


const imageUpload=document.getElementById(

"profileImageUpload"

);



if(imageUpload){


imageUpload.addEventListener(

"change",

function(){


let file=this.files[0];



if(file){


let reader=new FileReader();



reader.onload=function(e){



document.getElementById(

"profileImage"

).src=e.target.result;



localStorage.setItem(

"profileImage",

e.target.result

);



}



reader.readAsDataURL(file);



}



}

);



}





/* ==========================
   LOAD SAVED IMAGE
========================== */


function loadImage(){



let image=

localStorage.getItem(

"profileImage"

);



if(image){


let img=document.getElementById(

"profileImage"

);



if(img)

img.src=image;


}



}





/* ==========================
   USER STATS
========================== */


function loadStats(){


let stats={

help:12,

donation:25,

volunteer:7,

points:850

};



document.querySelectorAll(

".helpCount"

).forEach(item=>{

item.innerHTML=stats.help;

});



document.querySelectorAll(

".donationCount"

).forEach(item=>{

item.innerHTML=stats.donation;

});



document.querySelectorAll(

".volunteerCount"

).forEach(item=>{

item.innerHTML=stats.volunteer;

});



document.querySelectorAll(

".points"

).forEach(item=>{

item.innerHTML=stats.points;

});



}





/* ==========================
   DELETE ACCOUNT
========================== */


function deleteAccount(){


let confirmDelete=

confirm(

"Are you sure you want to delete account?"

);



if(confirmDelete){


localStorage.removeItem(

"currentUser"

);


localStorage.removeItem(

"isLoggedIn"

);



alert(

"Account Deleted"

);



window.location.href="register.html";


}



}





/* ==========================
   RUN FUNCTIONS
========================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


loadProfile();

loadImage();

loadStats();


}

);



console.log(

"Profile System Loaded Successfully ✅"

);