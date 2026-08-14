/* ==========================================
   admin.js
   Helping Hands NGO
   Admin Panel — Supabase powered
========================================== */

"use strict";

/* ==========================
   MOBILE SIDEBAR TOGGLE
   (works on every admin.js page: admin-dashboard,
   manage-users, manage-posts, manage-donations,
   manage-volunteers, reports)
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

        // Close the sidebar after tapping a nav link (mobile UX)
        sidebar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", closeSidebar);
        });
    }

});

/* ==========================
   ADMIN LOGIN CHECK
========================== */

function checkAdmin(){

    let admin = localStorage.getItem("adminLogin");

    if(admin !== "true"){
        window.location.href = "login.html";
    }

}

/* ==========================
   STATUS BADGE HELPER
========================== */

function statusBadge(status){

    const s = (status || "").toLowerCase();

    let cls = "pending";

    if(s.includes("approve") || s.includes("verif") || s.includes("active") || s.includes("complet")){
        cls = "completed";
    } else if(s.includes("reject")){
        cls = "rejected";
    }

    return `<span class="status ${cls}">${status || "Pending"}</span>`;

}

/* ==========================
   DASHBOARD COUNTS
========================== */

async function loadDashboardStats(){

    const usersEl = document.querySelector('[data-stat="users"]');
    const requestsEl = document.querySelector('[data-stat="requests"]');
    const donationsEl = document.querySelector('[data-stat="donations"]');
    const volunteersEl = document.querySelector('[data-stat="volunteers"]');

    if(!usersEl && !requestsEl && !donationsEl && !volunteersEl) return;

    const [usersCount, requestsCount, volunteersCount, donationRows] = await Promise.all([
        sbClient.from('users').select('*', { count: 'exact', head: true }),
        sbClient.from('help_requests').select('*', { count: 'exact', head: true }),
        sbClient.from('volunteer_offers').select('*', { count: 'exact', head: true }),
        sbClient.from('donations').select('amount')
    ]);

    if(usersEl) usersEl.innerText = usersCount.count ?? 0;
    if(requestsEl) requestsEl.innerText = requestsCount.count ?? 0;
    if(volunteersEl) volunteersEl.innerText = volunteersCount.count ?? 0;

    if(donationsEl){
        const total = (donationRows.data || [])
            .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
        donationsEl.innerText = "₹" + total.toLocaleString("en-IN");
    }

}

/* ==========================
   USER MANAGEMENT (manage-users.html)
========================== */

async function loadUsers(){

    const tbody = document.getElementById("userTable");
    if(!tbody) return;

    const { data, error } = await sbClient
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

    if(error){
        tbody.innerHTML = `<tr><td colspan="6">Failed to load users: ${error.message}</td></tr>`;
        return;
    }

    if(!data || data.length === 0){
        tbody.innerHTML = `<tr><td colspan="6">No users yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${u.name || "-"}</td>
            <td>${u.email || "-"}</td>
            <td>${u.city || "-"}</td>
            <td>${statusBadge(u.role === "volunteer" ? "Volunteer" : "User")}</td>
            <td>
                <button class="action-btn view" onclick="viewUser('${u.id}')">View</button>
                <button class="action-btn delete" onclick="deleteUserRow('${u.id}')">Delete</button>
            </td>
        </tr>
    `).join("");

}

function viewUser(id){
    alert("User ID: " + id);
}

async function deleteUserRow(id){

    if(!confirm("Delete this user?")) return;

    const { error } = await sbClient.from('users').delete().eq('id', id);

    if(error){
        alert("Delete failed: " + error.message);
        return;
    }

    loadUsers();
    loadDashboardStats();

}

/* ==========================
   HELP REQUEST MANAGEMENT (manage-posts.html)
========================== */

async function loadPosts(){

    const tbody = document.getElementById("postTable");
    if(!tbody) return;

    const { data, error } = await sbClient
        .from('help_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if(error){
        tbody.innerHTML = `<tr><td colspan="6">Failed to load requests: ${error.message}</td></tr>`;
        return;
    }

    if(!data || data.length === 0){
        tbody.innerHTML = `<tr><td colspan="6">No help requests yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(p => `
        <tr>
            <td>
                <img class="post" src="${(p.images && p.images[0]) || 'assets/images/demo1.jpg'}">
            </td>
            <td>${p.full_name}</td>
            <td>${p.category || "-"}</td>
            <td>${p.city || "-"}</td>
            <td>${statusBadge(p.status)}</td>
            <td>
                <button class="action view" onclick="viewPost(${p.id})">View</button>
                <button class="action approve" onclick="approvePost(${p.id})">Approve</button>
                <button class="action reject" onclick="rejectPost(${p.id})">Reject</button>
            </td>
        </tr>
    `).join("");

}

function viewPost(id){
    alert("Help Request ID: " + id);
}

async function approvePost(id){

    const { error } = await sbClient
        .from('help_requests')
        .update({ status: "Approved" })
        .eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    alert("Help Request Approved ✅");
    loadPosts();
    loadDashboardStats();

}

async function rejectPost(id){

    const { error } = await sbClient
        .from('help_requests')
        .update({ status: "Rejected" })
        .eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    alert("Help Request Rejected");
    loadPosts();

}

/* ==========================
   DONATION MANAGEMENT (manage-donations.html)
========================== */

async function loadDonations(){

    const tbody = document.getElementById("donationTable");
    if(!tbody) return;

    const { data, error } = await sbClient
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

    if(error){
        tbody.innerHTML = `<tr><td colspan="7">Failed to load donations: ${error.message}</td></tr>`;
        return;
    }

    if(!data || data.length === 0){
        tbody.innerHTML = `<tr><td colspan="7">No donations yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(d => `
        <tr>
            <td>#${d.id}</td>
            <td>${d.donor_name}</td>
            <td>${d.amount ? "₹" + Number(d.amount).toLocaleString("en-IN") : "-"}</td>
            <td>${d.type || d.message || "-"}</td>
            <td>${new Date(d.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}</td>
            <td>${statusBadge(d.status)}</td>
            <td>
                <button class="action view" onclick="viewDonation(${d.id})">View</button>
                <button class="action approve" onclick="verifyDonation(${d.id})">Verify</button>
                <button class="action reject" onclick="deleteDonation(${d.id})">Delete</button>
            </td>
        </tr>
    `).join("");

}

function viewDonation(id){
    alert("Donation ID: " + id);
}

async function verifyDonation(id){

    const { error } = await sbClient
        .from('donations')
        .update({ status: "Verified" })
        .eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    alert("Donation Verified ❤️");
    loadDonations();
    loadDashboardStats();

}

async function deleteDonation(id){

    if(!confirm("Delete this donation record?")) return;

    const { error } = await sbClient.from('donations').delete().eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    loadDonations();
    loadDashboardStats();

}

/* ==========================
   VOLUNTEER MANAGEMENT (manage-volunteers.html)
========================== */

async function loadVolunteers(){

    const tbody = document.getElementById("volunteerTable");
    if(!tbody) return;

    const { data, error } = await sbClient
        .from('volunteer_offers')
        .select('*')
        .order('created_at', { ascending: false });

    if(error){
        tbody.innerHTML = `<tr><td colspan="7">Failed to load volunteers: ${error.message}</td></tr>`;
        return;
    }

    if(!data || data.length === 0){
        tbody.innerHTML = `<tr><td colspan="7">No volunteer offers yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(v => `
        <tr>
            <td><img class="profile-img" src="https://i.pravatar.cc/100?u=${encodeURIComponent(v.email || v.helper_name)}"></td>
            <td>${v.helper_name}</td>
            <td>${v.city || "-"}</td>
            <td>${(v.help_types && v.help_types.join(", ")) || "-"}</td>
            <td>${v.available_date ? new Date(v.available_date).toLocaleDateString("en-IN") : "-"}</td>
            <td>${statusBadge(v.status)}</td>
            <td>
                <button class="action view" onclick="viewVolunteer(${v.id})">View</button>
                <button class="action approve" onclick="approveVolunteer(${v.id})">Approve</button>
                <button class="action remove" onclick="removeVolunteer(${v.id})">Remove</button>
            </td>
        </tr>
    `).join("");

}

function viewVolunteer(id){
    alert("Volunteer Offer ID: " + id);
}

async function approveVolunteer(id){

    const { error } = await sbClient
        .from('volunteer_offers')
        .update({ status: "Active" })
        .eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    alert("Volunteer Approved");
    loadVolunteers();
    loadDashboardStats();

}

async function removeVolunteer(id){

    if(!confirm("Remove this volunteer offer?")) return;

    const { error } = await sbClient.from('volunteer_offers').delete().eq('id', id);

    if(error){
        alert("Failed: " + error.message);
        return;
    }

    loadVolunteers();
    loadDashboardStats();

}

/* ==========================
   SEARCH ADMIN TABLE
========================== */

function adminSearch(inputId, tableId){

    let input = document.getElementById(inputId);

    if(!input) return;

    input.addEventListener("keyup", () => {

        let value = input.value.toLowerCase();

        document.querySelectorAll("#" + tableId + " tr").forEach(row => {

            row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";

        });

    });

}

/* ==========================
   EXPORT REPORT
========================== */

async function exportReport(){

    const [users, requests, volunteers, donationRows] = await Promise.all([
        sbClient.from('users').select('*', { count: 'exact', head: true }),
        sbClient.from('help_requests').select('*', { count: 'exact', head: true }),
        sbClient.from('volunteer_offers').select('*', { count: 'exact', head: true }),
        sbClient.from('donations').select('amount')
    ]);

    const totalDonations = (donationRows.data || [])
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);

    let report = `
Helping Hands NGO Report
Generated: ${new Date().toLocaleString("en-IN")}

Total Users: ${users.count ?? 0}
Total Help Requests: ${requests.count ?? 0}
Total Donations: ₹${totalDonations.toLocaleString("en-IN")}
Volunteer Offers: ${volunteers.count ?? 0}
`;

    let blob = new Blob([report], { type: "text/plain" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "NGO_Report.txt";
    link.click();

}

/* ==========================
   ADMIN LOGOUT
========================== */

function adminLogout(){

    localStorage.removeItem("adminLogin");

    if(window.sbClient){
        sbClient.auth.signOut();
    }

    alert("Admin Logout Successfully");

    window.location.href = "login.html";

}

/* ==========================
   INITIALIZE
========================== */

document.addEventListener("DOMContentLoaded", () => {

    checkAdmin();

    loadDashboardStats();
    loadUsers();
    loadPosts();
    loadDonations();
    loadVolunteers();

    adminSearch("searchUser", "userTable");
    adminSearch("searchPost", "postTable");

});

console.log("Admin Panel Loaded Successfully ✅ (Supabase)");
