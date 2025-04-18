const linkList = {
    "send-to-friend": { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up (Official Music Video)" },
    "impastor": { url: "https://www.google.com/search?q=download+among+us", title: "Google - Download Among Us" },
    "iknow": { url: "https://whatismyipaddress.com", title: "What Is My IP Address?" },
    "you-spelled-it-wrong": { url: "https://guthib.com", title: "You Spelled It Wrong" },
    "nerd": { url: "https://hackertyper.net", title: "Hackertyper" },
    "infinity": { url: "https://neal.fun/infinite-craft/", title: "Infinite Craft" },
    "alma": { url: "https://almalang.pages.dev", title: "Alma Lang" },
    "valkon": { url: "https://valkonclient.pages.dev", title: "ValkonClient" },
};

// Get the query parameter from the URL
const params = new URLSearchParams(window.location.search);
const linkKey = params.get("l");
const target = params.get("target") || "_self"; // Default to _self if target is not provided
const tableBody = document.getElementById("table-body");

// Check if the key exists in the linkList
if (linkKey && linkList[linkKey]) {
    // Redirect to the corresponding URL
    window.open(linkList[linkKey].url, target); // Access the 'url' property
} else if (linkKey) {
    // If there's no match, redirect to a default page or handle the error
    alert("Invalid link key!");
}

// Populate the table with links
Object.entries(linkList).forEach(([key, { url, title }]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="copy-key" data-key="${key}">${key}</td>
        <td><a href="${url}" target="_blank">${title}</a></td>
    `;
    if (tableBody) {
        tableBody.appendChild(row);
    } else {
        console.error("tableBody element not found!");
    }
});

// Add event listener to copy the link when a key is clicked
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-key")) {
        const key = event.target.getAttribute("data-key");
        const link = `https://szabfun.pages.dev/sus-link?l=${key}`;
        console.log(`Copying link: ${link}`); // Debugging log

        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Use Clipboard API if available
            navigator.clipboard.writeText(link).then(() => {
            }).catch((err) => {
                console.error("Failed to copy text: ", err);
            });
        } else {
            // Fallback: Use a temporary <textarea> element
            const tempInput = document.createElement("textarea");
            tempInput.value = link;
            document.body.appendChild(tempInput);
            tempInput.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback copy failed: ", err);
            }
            document.body.removeChild(tempInput);
        }
    }
});