const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".sidebar .dropbtn").forEach((link) => {
    const hrefPage = link.getAttribute("href");
    if (hrefPage === currentPage) {
        link.classList.add("current");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    hamburger.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
});