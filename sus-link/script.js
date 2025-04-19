const linkList = {
    "send-to-friend": {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        randomName: "4QpRNYUH",
        title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    },
    "impastor": {
        url: "https://www.google.com/search?q=download+among+us",
        randomName: "p4CmUyJ5",
        title: "Google - Download Among Us",
    },
    "iknow": {
        url: "https://whatismyipaddress.com",
        randomName: "g6fKDcVt",
        title: "What Is My IP Address?",
    },
    "you-spelled-it-wrong": {
        url: "https://guthib.com",
        randomName: "NJHibeNK",
        title: "You Spelled It Wrong",
    },
    "nerd": {
        url: "https://hackertyper.net",
        randomName: "M5VuMzDm",
        title: "Hackertyper"
    },
    "infinity": {
        url: "https://neal.fun/infinite-craft/",
        randomName: "mH7t5570",
        title: "Infinite Craft",
    },
    "alma": {
        url: "https://almalang.pages.dev",
        randomName: "4vW5Wtre",
        title: "Alma Lang"
    },
    "valkon": {
        url: "https://valkonclient.pages.dev",
        randomName: "YGCXPMAX",
        title: "ValkonClient" 
    },
};

// Get the query parameter from the URL
const params = new URLSearchParams(window.location.search);
const linkKey = params.get("l");
const target = params.get("target") || "_self"; // Default to _self if target is not provided
const tableBody = document.getElementById("table-body");

// Check if the key exists in the linkList
if (linkKey) {
    // Check if the linkKey matches a normal key
    if (linkList[linkKey]) {
        // Redirect to the corresponding URL
        window.open(linkList[linkKey].url, target);
    } else {
        // Check if the linkKey matches a randomName
        const matchingEntry = Object.values(linkList).find(entry => entry.randomName === linkKey);
        if (matchingEntry) {
            // Redirect to the corresponding URL for the randomName
            window.open(matchingEntry.url, target);
        } else {
            // If no match is found, handle the error
            alert("Invalid link key!");
        }
    }
}

// Populate the table with links
Object.entries(linkList).forEach(([key, { url, randomName, title }]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${key}</td>
        <td><a href=${url}>${title}</a></td>
        <td class="link-cell">
            <button class="copy-link" data-link="https://szabfun.pages.dev/sus-link?l=${key}">Copy Normal</button>
            <button class="copy-link" data-link="https://szabfun.pages.dev/sus-link?l=${randomName}">Copy Random</button>
        </td>
    `;
    if (tableBody) {
        tableBody.appendChild(row);
    } else {
        console.error("tableBody element not found!");
    }
});

// Add event listener to copy the link when a button is clicked
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-link")) {
        const link = event.target.getAttribute("data-link");
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