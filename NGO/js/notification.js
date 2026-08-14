/* ==========================================
   notification.js
   Helping Hands NGO
   Notification Management System
========================================== */


/* ==========================
   DEFAULT NOTIFICATIONS
========================== */


let notifications = JSON.parse(

localStorage.getItem("notifications")

) || [


{

id:1,

icon:"fa-heart",

title:"Help Request Approved",

message:"Your help request has been verified by admin.",

type:"success",

time:"2 minutes ago",

read:false

},


{

id:2,

icon:"fa-hand-holding-dollar",

title:"Donation Received",

message:"Someone donated for your help request.",

type:"info",

time:"30 minutes ago",

read:false

},


{

id:3,

icon:"fa-user-group",

title:"Volunteer Joined",

message:"A volunteer accepted your request.",

type:"success",

time:"1 hour ago",

read:false

},


{

id:4,

icon:"fa-clock",

title:"Verification Pending",

message:"Your documents are under review.",

type:"pending",

time:"Today",

read:false

}


];



/* ==========================
   SAVE NOTIFICATIONS
========================== */


function saveNotifications(){


localStorage.setItem(

"notifications",

JSON.stringify(notifications)

);


}





/* ==========================
   DISPLAY NOTIFICATIONS
========================== */


function showNotifications(){


const box=document.getElementById(

"notificationList"

);



if(!box)

return;



box.innerHTML="";



if(notifications.length===0){


box.innerHTML=

`

<h2 style="text-align:center">

No Notifications 🔔

</h2>

`;


return;


}



notifications.forEach(item=>{


box.innerHTML += `


<div class="notification-card ${item.read ? 'read':''}">


<div class="left">


<div class="icon">

<i class="fa-solid ${item.icon}"></i>

</div>



<div class="content">


<h3>

${item.title}

</h3>


<p>

${item.message}

</p>


<div class="time">

${item.time}

</div>


</div>


</div>



<span class="badge ${item.type}">

${item.read ? "Read":"New"}

</span>



</div>


`;


});


}





/* ==========================
   ADD NEW NOTIFICATION
========================== */


function addNotification(

title,

message,

type="info"

){



let newNotification={


id:Date.now(),


icon:"fa-bell",


title:title,


message:message,


type:type,


time:"Just now",


read:false


};



notifications.unshift(

newNotification

);



saveNotifications();


showNotifications();



}





/* ==========================
   MARK AS READ
========================== */


function markAllRead(){



notifications.forEach(item=>{


item.read=true;


});



saveNotifications();


showNotifications();


}





/* ==========================
   DELETE NOTIFICATION
========================== */


function deleteNotification(id){



notifications = notifications.filter(

item=>item.id!==id

);



saveNotifications();


showNotifications();


}





/* ==========================
   CLEAR ALL
========================== */


function clearNotifications(){


if(confirm(

"Remove all notifications?"

)){


notifications=[];


saveNotifications();


showNotifications();


}


}





/* ==========================
   NOTIFICATION COUNT
========================== */


function notificationCount(){


let count = notifications.filter(

item=>item.read===false

).length;



let badge=document.getElementById(

"notificationCount"

);



if(badge){


badge.innerHTML=count;


}



}





/* ==========================
   REAL TIME DEMO ALERT
========================== */


function demoNotification(){


setTimeout(()=>{


addNotification(

"New Help Request",

"Someone nearby needs clothes donation.",

"success"

);


},5000);


}





/* ==========================
   INITIALIZE
========================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


saveNotifications();


showNotifications();


notificationCount();


demoNotification();


}

);



console.log(

"Notification System Loaded ✅"

);