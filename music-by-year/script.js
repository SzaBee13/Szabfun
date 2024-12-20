const yearSpan = document.getElementById('year');
const countrySpan = document.getElementById('country');

let year;
let country;

function fetchMusic() {
    year = document.getElementById('year').value;
    country = document.getElementById('country').value;
    updateURL();

    // Example: Construct the audio file URL (replace this logic with actual API or file fetching logic)
    const baseURL = 'https://example.com/music'; // Replace with your actual music source
    const musicURL = `${baseURL}/${country}/${year}.mp3`;

    const audioPlayer = document.getElementById('audioPlayer');
    const audioSource = document.getElementById('audioSource');

    audioSource.src = musicURL;
    audioPlayer.load();
    audioPlayer.hidden = false;
    audioPlayer.play().catch(error => {
        alert('Unable to play the selected track. Please ensure the file exists.');
        console.error(error);
    });
}

function updateURL() {
    const params = new URLSearchParams();
    params.set('country', country);
    params.set('year', year);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('year')) {
        year = parseInt(params.get('year'));
        yearSpan.value = year;
    }
    if (params.has('country')) {
        country = parseInt(params.get('country'));
        countrySpan.value = country;
    }
}


function init() {
    applyURLParams();
    updateURL();
    fetchMusic();
}