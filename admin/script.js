const apiUrl = "https://szabfun-backend.onrender.com";
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
});

// app.post("/owner/remove-admin", saveLoadCors, (req, res) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ error: "Missing or invalid Authorization header" });
//   }
//   const googleId = authHeader.replace("Bearer ", "");

//   // Check if the user is the owner
//   if (googleId !== ownerId) {
//     return res.status(403).json({ error: "Forbidden: Not owner" });
//   }

//   const { adminGoogleId } = req.body;
//   if (!adminGoogleId) {
//     return res.status(400).json({ error: "Missing adminGoogleId" });
//   }

//   adminsDb.run(
//     "DELETE FROM admins WHERE google_id = ?",
//     [adminGoogleId],
//     function (err) {
//       if (err) {
//         return res.status(500).json({ error: "Failed to remove admin" });
//       }
//       res.json({ success: true, adminGoogleId });
//     }
//   );
// });
