/* ==========================================
   search.js
   Helping Hands NGO
   Search & Filter System
========================================== */


/* ==========================
   HELP REQUEST DATA
========================== */


let helpRequests = [


{

name:"Rahul Kumar",

category:"Food",

location:"Delhi",

need:"Monthly food supplies",

status:"Verified"

},


{

name:"Priya Sharma",

category:"Education",

location:"Noida",

need:"School fees support",

status:"Verified"

},


{

name:"Aman Verma",

category:"Medical",

location:"Aligarh",

need:"Emergency treatment",

status:"Pending"

},


{

name:"Ravi Singh",

category:"Clothes",

location:"Lucknow",

need:"Winter clothes",

status:"Verified"

}


];





/* ==========================
   DISPLAY SEARCH RESULTS
========================== */


function displayResults(data){



let container=document.getElementById(

"searchResults"

);



if(!container)

return;



container.innerHTML="";



if(data.length===0){


container.innerHTML=

`

<h3 style="text-align:center">

No Help Request Found ❌

</h3>

`;

return;


}




data.forEach(item=>{



container.innerHTML +=`


<div class="result-card">


<div class="result-content">


<h3>

${item.name}

</h3>



<p>

<strong>Need:</strong>

${item.need}

</p>



<p>

<strong>Category:</strong>

${item.category}

</p>



<p>

<strong>Location:</strong>

${item.location}

</p>



<span class="tag">

${item.status}

</span>



<button onclick="helpUser('${item.name}')"

class="help-btn">

Help Now ❤️

</button>



</div>


</div>


`;



});



}





/* ==========================
   SEARCH FUNCTION
========================== */


function searchHelp(){



let keyword=document.getElementById(

"searchInput"

).value.toLowerCase();



let category=document.getElementById(

"category"

).value;



let filtered=helpRequests.filter(item=>{


let matchText=


item.name.toLowerCase().includes(keyword)

||

item.need.toLowerCase().includes(keyword)

||

item.location.toLowerCase().includes(keyword);



let matchCategory=


category===""

||

item.category===category;



return matchText && matchCategory;



});



displayResults(filtered);



}





/* ==========================
   CATEGORY FILTER
========================== */


function filterCategory(){


searchHelp();


}





/* ==========================
   HELP BUTTON
========================== */


function helpUser(name){



let confirmHelp=confirm(

"Do you want to help "+name+"?"

);



if(confirmHelp){



alert(

"Thank you ❤️ Your support request has been sent."

);



addNotification(

"Help Started",

"You started helping "+name,

"success"

);



}



}





/* ==========================
   SAVE NEW HELP REQUEST
========================== */


function addHelpRequest(data){



helpRequests.push(data);



localStorage.setItem(

"helpRequests",

JSON.stringify(helpRequests)

);



displayResults(helpRequests);



}





/* ==========================
   LOAD SAVED REQUESTS
========================== */


function loadRequests(){



let saved=

JSON.parse(

localStorage.getItem(

"helpRequests"

)

);



if(saved){


helpRequests=saved;


}



displayResults(helpRequests);



}





/* ==========================
   INIT
========================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


loadRequests();



let btn=document.querySelector(

".search-box button"

);



if(btn){


btn.addEventListener(

"click",

searchHelp

);


}



let category=document.getElementById(

"category"

);



if(category){


category.addEventListener(

"change",

filterCategory

);


}



}

);



console.log(

"Search System Loaded Successfully ✅"

);