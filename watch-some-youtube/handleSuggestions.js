

document.getElementById("suggestion-form").addEventListener("submit", function(event) {
  event.preventDefault();
  let author;
  if ( localStorage.getItem('google_name' ) ) {
    author = localStorage.getItem('google_name').split(" ")[0] // ONLY FIRST NAME
  } else {
    author = "Anonymous"
  }
  const message = document.querySelector("#suggestion-input").value;
  sendSuggestion("watch-some-youtube", author, message);
});
