// import the toast function from toast.js

function sendSuggestion(game, author, message) {
  if (game === "watch-some-youtube") {
    const payload = {
      content: `New video suggestion for **${game.replace(/-/g, " ")}** by **${author}**:\n${message}`,
    };
    sendToDiscord(payload);
  } else {
    const payload = {
      content: `New suggestion for **${game.replace(/-/g, " ")}** by **${author}**:\n${message}`,
    };
    sendToDiscord(payload);
  }
}

function sendToDiscord(payload) {
  const webhookUrl = "https://discord.com/api/webhooks/1424282769978167328/b5oBH8n9zYgTIC9CFiuY0-0gaM9ErY3F2vrjXUD5RpvrjOZufHMtD0L0th7eWELFdFX5";
  fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    console.log("Success:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
    showToast("Failed to send suggestion. Please try again later.", "error");
  });
}
