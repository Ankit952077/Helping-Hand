/* ==========================================
   home-requests.js
   Helping Hands NGO
   Loads real "Latest Help Requests" on index.html
   from Supabase and wires up View Details / Donate / Help Now
========================================== */

"use strict";

const FALLBACK_IMAGES = [
    "assets/images/demo1.jpg",
    "assets/images/demo2.jpg",
    "assets/images/demo3.jpg"
];

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function requestCardHTML(item, index) {

    const img = (item.images && item.images.length > 0)
        ? item.images[0]
        : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

    const statusLabel = (item.status || "Pending");
    const isVerified = statusLabel.toLowerCase() === "approved" || statusLabel.toLowerCase() === "verified";

    return `
        <div class="request-card">
            <img src="${escapeHtml(img)}" alt="${escapeHtml(item.category || 'Help request')}">
            <span class="verified" style="${isVerified ? '' : 'background:#FEF3C7;color:#B45309;'}">
                ${isVerified ? '✔ Verified' : '⏳ ' + escapeHtml(statusLabel)}
            </span>
            <h3>${escapeHtml(item.category || 'Help Needed')}</h3>
            <p>${escapeHtml((item.description || '').slice(0, 80))}${(item.description || '').length > 80 ? '…' : ''}</p>
            <small>📍 ${escapeHtml(item.city || 'Unknown')}</small>
            <div class="card-actions">
                <button class="btn-outline" onclick="openRequestModal(${item.id})">View Details</button>
                <button onclick="window.location.href='donate.html'">Donate</button>
            </div>
        </div>
    `;
}

let latestRequestsCache = [];

async function loadLatestRequests() {

    const grid = document.getElementById("latestRequestsGrid");
    if (!grid) return;

    if (!window.sbClient) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;opacity:.7">Unable to connect right now. Please refresh.</p>`;
        return;
    }

    const { data, error } = await window.sbClient
        .from("help_requests")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

    if (error) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;opacity:.7">Couldn't load requests right now.</p>`;
        console.error("loadLatestRequests error:", error);
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;opacity:.7">No help requests yet. Be the first to <a href="need-help.html">submit one</a>.</p>`;
        return;
    }

    latestRequestsCache = data;

    grid.innerHTML = data.map((item, i) => requestCardHTML(item, i)).join("");
}

function openRequestModal(id) {

    const item = latestRequestsCache.find(r => r.id === id);
    if (!item) return;

    const overlay = document.getElementById("requestModalOverlay");
    const box = document.getElementById("requestModalBox");
    if (!overlay || !box) return;

    const img = (item.images && item.images.length > 0) ? item.images[0] : FALLBACK_IMAGES[0];

    box.innerHTML = `
        <button class="close-modal" onclick="closeRequestModal()">✕</button>
        <img src="${escapeHtml(img)}" alt="">
        <h3>${escapeHtml(item.category || 'Help Needed')}</h3>
        <p><strong>By:</strong> ${escapeHtml(item.full_name || 'Anonymous')}</p>
        <p><strong>Location:</strong> ${escapeHtml(item.city || 'Unknown')}</p>
        <p><strong>Status:</strong> ${escapeHtml(item.status || 'Pending')}</p>
        <p>${escapeHtml(item.description || 'No further details provided.')}</p>
        <div class="modal-actions">
            <button onclick="window.location.href='donate.html'">Donate</button>
            <button onclick="window.location.href='provide-help.html'">Help Now</button>
        </div>
    `;

    overlay.classList.add("active");
}

function closeRequestModal() {
    const overlay = document.getElementById("requestModalOverlay");
    if (overlay) overlay.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {

    loadLatestRequests();

    const overlay = document.getElementById("requestModalOverlay");
    if (overlay) {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeRequestModal();
        });
    }

});
