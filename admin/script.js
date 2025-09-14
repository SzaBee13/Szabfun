const apiUrl = "https://inf-programmers-paris-tigers.trycloudflare.com";
// const apiUrl = "http://localhost:3000";
let isError = false;

async function isAdmin() {
  const userId = localStorage.getItem("google_id");
  try {
    const response = await fetch(`${apiUrl}/admin/is-admin?userId=${userId}`);
    if (response.status === 200) {
      return true;
    } else if (response.status === 403) {
      return false;
    } else {
      throw new Error();
    }
  } catch {
    console.error("Error checking admin status");
    document.getElementById("error").style.display = "block";
    document.getElementById("admin-container").style.display = "none";
    isError = true;
    return false;
  }
}

async function isOwner() {
  const userId = localStorage.getItem("google_id");
  try {
    const response = await fetch(`${apiUrl}/owner/is-owner?userId=${userId}`);
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.isOwner === true;
  } catch {
    console.error("Error checking owner status");
    document.getElementById("error").style.display = "block";
    document.getElementById("owner-container").style.display = "none";
    return false;
  }
}

async function loadAdmins() {
  const googleId = localStorage.getItem("google_id");
  if (!googleId) return;
  try {
    const res = await fetch(`${apiUrl}/admin/get-admins`, {
      headers: {
        Authorization: `Bearer ${googleId}`,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    const admins = data.admins || [];
    const adminsContainer = document.getElementById("admins-container");
    if (!adminsContainer) return;
    adminsContainer.style.display = "block";
    let html = "<h2>Admins</h2><ul>";
    for (const [id, email, name] of admins) {
      html += `<li><b>${name || "(no name)"}</b> ${
        email
          ? `<a class="admin-email" href="mailto:${email}">${email}</a>`
          : '<span class="no-email">no email</span>'
      } <span class="admin-id">${id}</span></li>`;
    }
    html += "</ul>";
    adminsContainer.innerHTML = html;
  } catch (e) {
    // Optionally show error
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  let admin = false,
    owner = false;
  try {
    if (localStorage.getItem("google_id") === null) {
      // Redirect to login if not signed in
      window.location.href = "../login/index.html";
    } else {
      admin = await isAdmin();
      owner = await isOwner();
    }
  } catch {
    console.error("Error checking admin/owner status");
    document.getElementById("error").style.display = "block";
    return;
  }

  if (admin) {
    document.getElementById("admin-container").style.display = "block";
  }
  if (owner) {
    document.getElementById("owner-container").style.display = "block";
  }
  if (!admin && !owner && !isError) {
    document.getElementById("not-authorized").style.display = "block";
  }

  if (admin) {
    document
      .getElementById("email-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value;
        const res = await fetch(`${apiUrl}/admin/send-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("google_id")}`,
          },
          body: JSON.stringify({ subject, message }),
        });
        document.getElementById("status").textContent = res.ok
          ? "Emails sent!"
          : "Failed to send emails.";
      });
  }

  if (owner) {
    document
      .getElementById("add-admin-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const adminGoogleId = document.getElementById("new-admin-id").value;
        const res = await fetch(`${apiUrl}/owner/add-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("google_id")}`,
          },
          body: JSON.stringify({ adminGoogleId }),
        });
        document.getElementById("owner-status").textContent = res.ok
          ? "Admin added!"
          : "Failed to add admin.";
      });
    document
      .getElementById("remove-admin-form")
      .addEventListener("submit", async (e) => {
        e.preventDefault();
        const adminGoogleId = document.getElementById("remove-admin-id").value;
        const res = await fetch(`${apiUrl}/owner/remove-admin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("google_id")}`,
          },
          body: JSON.stringify({ adminGoogleId }),
        });
        document.getElementById("owner-status").textContent = res.ok
          ? "Admin removed!"
          : "Failed to remove admin.";
      });
  }

  if (admin || owner) {
    document.getElementById("admins-container").style.display = "block";
    await loadAdmins();
  }
});