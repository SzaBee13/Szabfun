const currentPage = window.location.pathname.split("/").pop();
document.querySelectorAll(".sidebar .dropbtn").forEach((link) => {
    const hrefPage = link.getAttribute("href");
    if (hrefPage === currentPage) {
        link.classList.add("current");
    }
});
