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
    "sus": {
        url: "https://www.youtube.com/shorts/vdu8Jeu2IS0",
        randomName: "AChUi5ut",
        title: "among us imposter sound effect"
    },
    "english-or-spanish": {
        url: "https://www.youtube.com/watch?v=gQk8SrLjqvg",
        randomName: "7fCNGW6U",
        title: "English or Spanish?"
    },
    "learn": {
        url: "https://www.duolingo.com/learn",
        randomName: "qkJ9LwGd",
        title: "Duolingo"
    },
    "corn": {
        url: "https://cornhub.website",
        randomName: "0DjDqKRg",
        title: "CornHub",
    },
    "x": {
        url: "https://x.com",
        randomName: "MSC3ktz8",
        title: "X (Twitter)"
    },
    "technoblade": {
        url: "https://www.youtube.com/watch?v=R_fZjGm2OrM",
        randomName: "yN4BgDaG",
        title: "Technoblade Never Dies"
    },
    "i-am-not-a-robot": {
        url: "https://www.youtube.com/watch?v=j8BjGMt2IgQ",
        randomName: "gMCSaeYk",
        title: "Hmmmmmm........."
    },
    "search": {
        url: "https://www.google.com",
        randomName: "20zjkeSQ",
        title: "Google"
    }
};

// const apiUrl = "https://api-fun.szabee.me/sus-link"; // Update this to your API URL if needed
const apiUrl = "http://localhost:3000"; // For local development, change to your backend URL if different
const tableBody = document.getElementById("table-body");
const customLinkTableBody = document.getElementById("custom-link-table-body");
const customLinkForm = document.getElementById("custom-link-form");

// Store custom links fetched from the backend
let customLinks;

// Get the query parameter from the URL
const params = new URLSearchParams(window.location.search);
const linkKey = params.get("l");
const target = params.get("target") || "_self"; // Default to _self if target is not provided

async function handleLinkRedirection() {
    const params = new URLSearchParams(window.location.search);
    const linkKey = params.get("l");
    const target = params.get("target") || "_self"; // Default to _self if target is not provided

    if (!linkKey) return; // Exit if no 'l' parameter is provided

    // Check if the linkKey matches a key in linkList
    if (linkList[linkKey]) {
        const url = linkList[linkKey].url;
        window.open(url, target);
        return;
    }

    // Check if the linkKey matches a randomName in linkList
    const predefinedLink = Object.values(linkList).find(link => link.randomName === linkKey);
    if (predefinedLink) {
        window.open(predefinedLink.url, target);
        return;
    }

    // Check custom links from the already fetched customLinks variable
    if (customLinks) {
        const customLink = customLinks.find(link => link.randomShortVersion === linkKey);
        if (customLink) {
            window.open(customLink.endpoint, target);
            return;
        }
    }

    // Fallback to backend search so private/generated short codes also resolve.
    try {
        const response = await fetch(`${apiUrl}/search?l=${encodeURIComponent(linkKey)}`);
        if (response.ok) {
            const result = await response.json();
            if (result.url) {
                window.open(result.url, target);
                return;
            }
        }
    } catch (error) {
        console.error("Error searching link by short code:", error.message);
    }

    console.error("Link not found for the provided key.");
}

async function createRandomShort(endpoint) {
    const response = await fetch(`${apiUrl}/create-random-short`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
    });

    if (!response.ok) {
        throw new Error("Failed to create random short link.");
    }

    return response.json();
}

function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }

    const tempInput = document.createElement("textarea");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    return Promise.resolve();
}

// Populate the table with predefined links
Object.entries(linkList).forEach(([key, { url, title }]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${key}</td>
        <td><a href=${url} target="_blank">${title}</a></td>
        <td class="link-cell">
            <button class="copy-link" data-link="https://fun.szabee.me/sus-link?l=${key}">Copy Normal</button>
            <button class="generate-random-link" data-endpoint="${url}">Generate Random</button>
        </td>
    `;
    if (tableBody) {
        tableBody.appendChild(row);
    } else {
        console.error("tableBody element not found!");
    }
});

// Fetch custom links from the server on page load
async function fetchCustomLinks() {
    try {
        const response = await fetch(`${apiUrl}/get-custom`);
        if (!response.ok) {
            throw new Error("Failed to fetch custom links from the server.");
        }
        customLinks = await response.json();
        populateCustomTable(customLinks);
    } catch (error) {
        console.error("Error fetching custom links:", error.message);
    }
}

// Populate the custom links table
function populateCustomTable(customLinks) {
    customLinkTableBody.innerHTML = ""; // Clear existing rows
    customLinks.forEach(({ randomShortVersion, endpoint, name, author }) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><a href="${endpoint}" target="_blank">${name}</a></td>
            <td>${randomShortVersion}</td>
            <td>${author}</td>
            <td class="link-cell">
                <button class="copy-link" data-link="https://fun.szabee.me/sus-link?l=${randomShortVersion}">Copy Short</button>
            </td>
        `;
        customLinkTableBody.appendChild(row);
    });
}

// Handle form submission to create a custom link
customLinkForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("custom-link").value;
    const endpoint = document.getElementById("custom-link-endpoint").value;
    const author = document.getElementById("custom-link-author").value;

    try {
        const response = await fetch(`${apiUrl}/create-custom-link`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, endpoint, author }),
        });

        const result = await response.json();
        if (response.ok) {
            showToast(`Custom link created! Random Short Version: ${result.randomShortVersion}`, "success");
            fetchCustomLinks(); // Refresh the custom links table
        } else {
            showToast(`Error: ${result.error}`, "error");
        }
    } catch (error) {
        console.error("Error creating custom link:", error.message);
        showToast("Failed to create custom link. Please try again.", "error");
    }
});

// Add event listener to copy the link when a button is clicked
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("copy-link")) {
        const link = event.target.getAttribute("data-link");
        copyToClipboard(link).catch((err) => {
            console.error("Failed to copy link:", err);
            showToast("Failed to copy link.", "error");
        });
    }
});

document.addEventListener("click", async (event) => {
    if (!event.target.classList.contains("generate-random-link")) return;

    const endpoint = event.target.getAttribute("data-endpoint");
    if (!endpoint) {
        showToast("Missing endpoint for random link generation.", "error");
        return;
    }

    event.target.disabled = true;
    const originalText = event.target.textContent;
    event.target.textContent = "Generating...";

    try {
        const result = await createRandomShort(endpoint);
        const generatedLink = `https://fun.szabee.me/sus-link?l=${result.randomShortVersion}`;
        await copyToClipboard(generatedLink);
        showToast(`Generated and copied: ${result.randomShortVersion}`, "success");
    } catch (error) {
        console.error("Error generating random short link:", error.message);
        showToast("Failed to generate random short link.", "error");
    } finally {
        event.target.disabled = false;
        event.target.textContent = originalText;
    }
});

(async function initialize() {
    await fetchCustomLinks(); // Wait for custom links to be fetched
    await handleLinkRedirection(); // Call redirection after fetching is complete
})();