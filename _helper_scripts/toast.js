function showToast(message, type = "success") {
    const container = document.getElementById("toaster-container");
    if (!container) return;
    const toast = document.createElement("div");
    toast.className = `toaster ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}