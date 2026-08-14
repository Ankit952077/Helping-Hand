/* =====================================================
   Helping Hands NGO Platform
   File: forms.js
   Purpose: Need Help Form Validation & Local Storage
===================================================== */

"use strict";

// ================================
// Form Reference
// ================================

const helpForm = document.getElementById("helpForm");

if (helpForm) {

    helpForm.addEventListener("submit", submitHelpRequest);

}

// ================================
// Submit Form
// ================================

async function submitHelpRequest(e) {

    e.preventDefault();

    // Get Values

    const data = {

        fullName: document.getElementById("name").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        age: document.getElementById("age").value.trim(),

        state: document.getElementById("state").value.trim(),

        city: document.getElementById("city").value.trim(),

        pin: document.getElementById("pin").value.trim(),

        map: document.getElementById("map").value.trim(),   // optional

        address: document.getElementById("address").value.trim(),

        category: document.getElementById("category").value,

        urgency: document.getElementById("urgency").value,

        amount: document.getElementById("amount").value,

        family: document.getElementById("family").value,

        description: document.getElementById("description").value.trim(),

    };

    // Validation

    if (!validateForm(data)) {

        return;

    }

    const submitBtn = helpForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";
    }

    try {

        // Evidence uploads (all optional) go to the public "evidence" bucket
        const imageUrls = await uploadFiles("images", "evidence");
        const videoUrl = (await uploadFiles("video", "evidence"))[0] || null;
        const idProofUrl = (await uploadFiles("idProof", "evidence"))[0] || null;
        const documentUrl = (await uploadFiles("supportingDoc", "evidence"))[0] || null;

        const { data: { user } } = window.sbClient
            ? await window.sbClient.auth.getUser()
            : { data: { user: null } };

        const payload = {
            full_name: data.fullName,
            phone: data.phone,
            email: data.email || null,
            age: data.age ? Number(data.age) : null,
            state: data.state,
            city: data.city,
            pincode: data.pin,
            map_link: data.map || null,
            address: data.address,
            category: data.category,
            urgency: data.urgency,
            amount: data.amount ? Number(data.amount) : null,
            family: data.family ? Number(data.family) : null,
            description: data.description,
            images: imageUrls,
            video: videoUrl,
            id_proof: idProofUrl,
            document: documentUrl,
            user_id: user ? user.id : null
        };

        let { error } = await window.sbClient.from("help_requests").insert([payload]);

        // If the cached session points at a user that no longer exists in
        // Supabase Auth (stale/expired token), retry once as a guest
        // request instead of failing the whole submission.
        if (error && error.message && error.message.toLowerCase().includes("foreign key") && payload.user_id) {
            payload.user_id = null;
            ({ error } = await window.sbClient.from("help_requests").insert([payload]));
        }

        if (error) {
            showMessage("❌ " + error.message, "#dc2626");
            return;
        }

        showMessage("✅ Request submitted successfully!", "#16a34a");

        localStorage.removeItem("helpDraft");

        helpForm.reset();

    } catch (err) {

        showMessage("❌ Something went wrong. Try again.", "#dc2626");
        console.error(err);

    } finally {

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Request";
        }

    }

}

// ================================
// Upload helper (skips silently if no file picked)
// ================================

async function uploadFiles(inputId, bucket) {

    const input = document.getElementById(inputId);

    if (!input || !input.files || input.files.length === 0) {
        return [];
    }

    const urls = [];

    for (const file of input.files) {

        const path = `${inputId}/${Date.now()}-${file.name}`;

        const { error } = await window.sbClient
            .storage
            .from(bucket)
            .upload(path, file);

        if (error) {
            console.error("Upload failed:", error.message);
            continue;
        }

        const { data } = window.sbClient
            .storage
            .from(bucket)
            .getPublicUrl(path);

        urls.push(data.publicUrl);

    }

    return urls;

}

// ================================
// Validation
// ================================

function validateForm(data) {

    if (data.fullName.length < 3) {

        showMessage("Please enter a valid name.", "#dc2626");

        return false;

    }

    if (!/^[0-9]{10}$/.test(data.phone)) {

        showMessage("Enter a valid 10 digit mobile number.", "#dc2626");

        return false;

    }

    if (data.description.length < 20) {

        showMessage("Please explain your situation properly.", "#dc2626");

        return false;

    }

    return true;

}

// ================================
// Notification
// ================================

function showMessage(message, colour) {

    const box = document.createElement("div");

    box.innerText = message;

    box.style.position = "fixed";

    box.style.top = "20px";

    box.style.right = "20px";

    box.style.padding = "15px 25px";

    box.style.background = colour;

    box.style.color = "#fff";

    box.style.borderRadius = "10px";

    box.style.fontWeight = "600";

    box.style.boxShadow = "0 10px 25px rgba(0,0,0,.2)";

    box.style.zIndex = "9999";

    document.body.appendChild(box);

    setTimeout(() => {

        box.remove();

    }, 3000);

}

// ================================
// Character Counter
// ================================

const description = document.getElementById("description");

if (description) {

    const counter = document.createElement("small");

    counter.style.display = "block";

    counter.style.marginTop = "8px";

    counter.style.color = "#555";

    description.parentNode.appendChild(counter);

    description.addEventListener("input", () => {

        counter.innerText =
            description.value.length + " characters";

    });

}

// ================================
// Amount Formatter
// ================================

const amount = document.getElementById("amount");

if (amount) {

    amount.addEventListener("input", () => {

        amount.value = amount.value.replace(/[^\d]/g, "");

    });

}

// ================================
// Phone Number Validation
// ================================

const phone = document.getElementById("phone");

if (phone) {

    phone.addEventListener("input", () => {

        phone.value = phone.value.replace(/[^\d]/g, "");

        if (phone.value.length > 10) {

            phone.value = phone.value.slice(0, 10);

        }

    });

}

// ================================
// Auto Save Draft
// ================================

const fields = document.querySelectorAll(

    "#helpForm input, #helpForm textarea, #helpForm select"

);

fields.forEach(field => {

    field.addEventListener("input", saveDraft);

});

function saveDraft() {

    const draft = {};

    fields.forEach(field => {

        if (field.type === "file") return; // file inputs can't be restored

        draft[field.id] = field.value;

    });

    localStorage.setItem(

        "helpDraft",

        JSON.stringify(draft)

    );

}

// ================================
// Load Draft
// ================================

window.addEventListener("load", () => {

    const draft = JSON.parse(

        localStorage.getItem("helpDraft")

    );

    if (!draft) return;

    fields.forEach(field => {

        if (field.type === "file") return;

        if (draft[field.id] !== undefined) {

            field.value = draft[field.id];

        }

    });

});

// ================================
// Clear Draft After Submit
// ================================

if (helpForm) {

    helpForm.addEventListener("submit", () => {

        localStorage.removeItem("helpDraft");

    });

}

// ================================
// Image Preview
// ================================

const imageInput = document.querySelector(

    'input[type="file"][accept="image/*"]'

);

if (imageInput) {

    const preview = document.createElement("div");

    preview.style.display = "flex";

    preview.style.flexWrap = "wrap";

    preview.style.gap = "10px";

    preview.style.marginTop = "15px";

    imageInput.parentNode.appendChild(preview);

    imageInput.addEventListener("change", () => {

        preview.innerHTML = "";

        [...imageInput.files].forEach(file => {

            const reader = new FileReader();

            reader.onload = e => {

                const img = document.createElement("img");

                img.src = e.target.result;

                img.style.width = "100px";

                img.style.height = "100px";

                img.style.objectFit = "cover";

                img.style.borderRadius = "10px";

                preview.appendChild(img);

            };

            reader.readAsDataURL(file);

        });

    });

}

// ================================
// End
// ================================

console.log("forms.js Loaded Successfully");