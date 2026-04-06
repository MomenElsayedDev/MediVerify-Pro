function toggleDarkMode() {
  const body = document.body;
  const icon = document.getElementById("themeIcon");
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    icon.classList.replace("fa-moon", "fa-sun");
    icon.className = "fas fa-sun text-yellow-400";
    localStorage.setItem("theme", "dark");
  } else {
    icon.classList.replace("fa-sun", "fa-moon");
    icon.className = "fas fa-moon text-indigo-600";
    localStorage.setItem("theme", "light");
  }
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
}

const AUTH_API = "/api/auth";
const MED_API = "/api/medicines";

function showTab(id) {
  document
    .querySelectorAll(".tab-content")
    .forEach((t) => t.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  const token = localStorage.getItem("token");
  const navDashBtn = document.getElementById("navDashBtn");
  const adminBtn = document.getElementById("adminBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (token) {
    navDashBtn?.classList.remove("hidden");
    logoutBtn?.classList.remove("hidden");
    adminBtn?.classList.add("hidden");
  } else {
    navDashBtn?.classList.add("hidden");
    logoutBtn?.classList.add("hidden");
    adminBtn?.classList.remove("hidden");
  }

  if (id === "dashboard" && token) {
    loadMedicines();
    loadStats();
  }
}

async function loginFlow() {
  const result = await Swal.fire({
    title: "Central Administration Portal",
    text: "Select an action to access the system",
    icon: "shield-halved",
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: '<i class="fas fa-lock-open mr-2"></i> Login',
    denyButtonText: '<i class="fas fa-user-plus mr-2"></i> Register',
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    denyButtonColor: "#4f46e5",
    customClass: {
      popup: "rounded-3xl",
      confirmButton: "rounded-xl px-6 py-3",
      denyButton: "rounded-xl px-6 py-3",
    },
  });

  if (result.isConfirmed) {
    const { value: f } = await Swal.fire({
      title: "Login",
      html: `
                <input id="e" type="email" class="swal2-input rounded-xl" placeholder="Email Address">
                <input id="p" type="password" class="swal2-input rounded-xl" placeholder="Password">
            `,
      focusConfirm: false,
      preConfirm: () => ({
        email: document.getElementById("e").value,
        password: document.getElementById("p").value,
      }),
    });
    if (f) performAuth(`${AUTH_API}/login`, f);
  } else if (result.isDenied) {
    const { value: f } = await Swal.fire({
      title: "Create Admin Account",
      html: `
                <input id="n" class="swal2-input rounded-xl" placeholder="Full Name">
                <input id="e" type="email" class="swal2-input rounded-xl" placeholder="Email Address">
                <input id="p" type="password" class="swal2-input rounded-xl" placeholder="Password">
            `,
      preConfirm: () => ({
        fullName: document.getElementById("n").value,
        email: document.getElementById("e").value,
        password: document.getElementById("p").value,
      }),
    });
    if (f) performAuth(`${AUTH_API}/register`, f);
  }
}

async function performAuth(url, body) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      showTab("dashboard");
      Swal.fire({
        icon: "success",
        title: "Welcome",
        text: "Authentication successful",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      Swal.fire("Failed", data.message, "error");
    }
  } catch (err) {
    Swal.fire("Error", "Server connection failed", "error");
  }
}

async function addNewMed() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("mName").value;
  const brand = document.getElementById("mBrand").value;
  const expiryDate = document.getElementById("mExpiry").value;
  const description = document.getElementById("mDesc").value;

  if (!name || !expiryDate)
    return Swal.fire("Error", "Please fill name and expiry date", "error");

  const body = {
    name: name,
    brand: brand,
    expiryDate: expiryDate,
    description: description,
    dateAdded: new Date().toISOString(),
  };

  try {
    const res = await fetch(`${MED_API}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire("Saved", "Medicine added successfully", "success");
      document.getElementById("mName").value = "";
      document.getElementById("mBrand").value = "";
      document.getElementById("mExpiry").value = "";
      loadMedicines();
      loadStats();
    }
  } catch (e) {
    Swal.fire("Error", "Failed to add medicine", "error");
  }
}

async function loadMedicines() {
  const tableBody = document.getElementById("medsTableBody");
  const loader = document.getElementById("loader");

  if (loader) loader.classList.remove("hidden");
  tableBody.innerHTML = "";

  try {
    const res = await fetch(`${MED_API}/all`);
    const data = await res.json();

    if (data.success) {
      data.data.forEach((med) => {
        const dateSource = med.createdAt || med.dateAdded || new Date();
        const formattedDate = new Date(dateSource).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        const isExpired = new Date(med.expiryDate) < new Date();

        const row = `
    <tr class="glass bg-white/40 mb-2 border-b border-slate-100 hover:bg-white/60 transition-all">
        <td class="p-4 font-bold text-slate-800">${med.name}</td>
        <td class="p-4 text-xs font-mono text-blue-600">${med.serialNumber}</td>
        <td class="p-4 text-xs text-slate-500">${formattedDate}</td>
        <td class="p-4">
            <div class="flex items-center gap-3">
                <button onclick="openEditModal('${med._id}', '${med.name}', '${med.brand}', '${med.expiryDate}')" 
                        class="text-blue-500 hover:text-blue-700 hover:scale-110 transition bg-transparent border-none">
                    <i class="fas fa-pen-to-square"></i>
                </button>
                
                <button onclick="deleteMed('${med._id}')" 
                        class="text-red-400 hover:text-red-600 hover:scale-110 transition bg-transparent border-none">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </td>
    </tr>
`;
        tableBody.innerHTML += row;
      });
    }
  } catch (err) {
    console.error("Error loading medicines:", err);
  } finally {
    if (loader) loader.classList.add("hidden");
  }
}

async function deleteMed(id) {
  const token = localStorage.getItem("token");
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This medicine will be permanently deleted",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });

  if (confirm.isConfirmed) {
    const res = await fetch(`${MED_API}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      Swal.fire("Deleted!", "Record removed successfully", "success");
      loadMedicines();
      loadStats();
    }
  }
}

async function verifyMed() {
  const serial = document.getElementById("serial").value.trim();
  if (!serial)
    return Swal.fire("Alert", "Please enter a code to verify", "info");

  Swal.fire({
    title: "Verifying...",
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading(),
  });

  try {
    const res = await fetch(`${MED_API}/verify/${serial}`);
    const data = await res.json();

    if (data.success) {
      const expiryDate = new Date(data.data.expiryDate);
      const today = new Date();
      const isExpired = expiryDate < today;

      if (isExpired) {
        Swal.fire({
          icon: "warning",
          title: "Expired Medicine! ❌",
          html: `
                <div class="text-left glass p-4 mt-4 border-l-4 border-red-500 bg-red-50/50">
                    <p class="text-red-700 font-bold mb-2">Danger: This medicine is expired.</p>
                    <p><b>Product:</b> ${data.data.name}</p>
                    <p><b>Expired on:</b> ${expiryDate.toLocaleDateString("en-GB")}</p>
                </div>`,
          confirmButtonText: "I Understand",
          confirmButtonColor: "#ef4444",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Authentic & Active ✅",
          html: `
                <div class="text-left glass p-4 mt-4 border-l-4 border-green-500 bg-green-50/50">
                    <p class="text-green-700 font-bold mb-2">Success: Safe for use.</p>
                    <p><b>Product:</b> ${data.data.name}</p>
                    <p><b>Expires on:</b> ${expiryDate.toLocaleDateString("en-GB")}</p>
                    <p class="text-xs text-slate-500 mt-2">Standards Compliant</p>
                </div>`,
          confirmButtonText: "Excellent",
          confirmButtonColor: "#22c55e",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Warning: Fake Product ⚠️",
        text: "This code is not in our official records. Please do not use this package.",
        confirmButtonText: "Understood",
      });
    }
  } catch (err) {
    Swal.fire("Error", "Communication process failed", "error");
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${MED_API}/all`);
    const data = await res.json();
    if (data.success)
      document.getElementById("statTotal").innerText = data.data.length;
  } catch (e) {}
}

function logout() {
  Swal.fire({
    title: "Logout",
    text: "Do you want to end the current session?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Stay",
  }).then((r) => {
    if (r.isConfirmed) {
      localStorage.removeItem("token");
      location.reload();
    }
  });
}

window.onload = () => {
  if (localStorage.getItem("token")) showTab("dashboard");
};

function openEditModal(id, name, brand, expiry) {
  document.getElementById("editId").value = id;
  document.getElementById("editName").value = name;
  document.getElementById("editBrand").value = brand;

  const date = new Date(expiry);
  document.getElementById("editExpiry").value = date
    .toISOString()
    .split("T")[0];

  const modal = document.getElementById("editModal");
  modal.classList.remove("hidden");
  modal.querySelector(".glass").classList.add("scale-100");
}

function closeEditModal() {
  const modal = document.getElementById("editModal");
  modal.querySelector(".glass").classList.remove("scale-100");
  setTimeout(() => modal.classList.add("hidden"), 200);
}

async function submitEdit() {
  const id = document.getElementById("editId").value;
  const token = localStorage.getItem("token");

  const updatedData = {
    name: document.getElementById("editName").value,
    brand: document.getElementById("editBrand").value,
    expiryDate: document.getElementById("editExpiry").value,
  };

  try {
    const res = await fetch(`${MED_API}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (data.success) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Medicine updated successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      closeEditModal();
      loadMedicines();
    }
  } catch (error) {
    Swal.fire("Error", "Could not update the record", "error");
  }
}
// كود البحث الفوري
document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'medSearchInput') {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("#medsTableBody tr");

        rows.forEach(row => {
            const name = row.cells[0]?.textContent.toLowerCase() || "";
            const serial = row.cells[1]?.textContent.toLowerCase() || "";

            if (name.includes(searchTerm) || serial.includes(searchTerm)) {
                row.style.display = ""; 
            } else {
                row.style.display = "none";
            }
        });
    }
});

async function aiSuggestMed() {

  // Show loading spinner
  Swal.fire({
    title: "AI is generating...",
    html: '<i class="fas fa-robot fa-spin text-3xl text-purple-500"></i>',
    allowOutsideClick: false,
    showConfirmButton: false,
  });

  try {
    // Call backend to generate and save a random medicine
    const response = await fetch("/api/ai/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!data.success) {
      return Swal.fire("Error", data.message, "error");
    }

    const aiText = data.advice || "Medicine added successfully.";

    Swal.close();

    // If on dashboard, refresh the medicine table and stats
    const tableBody = document.getElementById("medsTableBody");
    if (tableBody) {
      loadMedicines(); // Refresh the table
      loadStats();     // Refresh the counter
    }

    // Show success popup
    Swal.fire({
      title: "🤖 AI Suggestion Added!",
      html: `<div class="text-left text-sm leading-relaxed p-2">${aiText.replace(/\n/g, "<br>")}</div>`,
      confirmButtonText: "Great!",
      confirmButtonColor: "#7c3aed",
      customClass: { popup: "rounded-3xl" }
    });

  } catch (err) {
    Swal.fire("Error", "Failed to connect to AI. Please try again.", "error");
  }
}