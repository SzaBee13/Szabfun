// import the toast function from toast.js

function sendSuggestion(game, message) {
  const googleId = localStorage.getItem('google_id');
  
  if (!googleId) {
    showToast("You must be logged in to send a suggestion.", "error");
    return;
  }

  const payload = {
    game: game,
    message: message
  };

  const apiUrl = "https://fun.szabee.me/suggestions/create";
  // For local testing, use: const apiUrl = "http://localhost:3000/suggestions/create";

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${googleId}`
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
    console.log("Suggestion saved successfully:", data);
    showToast("Thank you for your suggestion!", "success");
    // Clear the form
    document.getElementById("suggestion-input").value = "";
    document.getElementById("game-select").value = "";
  })
  .catch((error) => {
    console.error("Error:", error);
    showToast("Failed to send suggestion. Please try again later.", "error");
  });
}
