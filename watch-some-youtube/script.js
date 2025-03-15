let api = {};

async function loadJSON(file) {
    const response = await fetch(`./${file}.json`);
    api = await response.json();
}
  
let musicVideoIds;

let memeVideoIds;

let topVideoIds;

let allVideoIds;

let videoIds;

function init() {
    applyURLParams();
    selectOption("all");
    if (currentVideoId) {
        setVideo(currentVideoId);
    } else {
        loadRandomVideo();
    }
}

(async () => {
    await loadJSON("api");

    musicVideoIds = api.musicVideoIds;

    memeVideoIds = api.memeVideoIds;

    topVideoIds = api.topVideoIds;

    allVideoIds = musicVideoIds.concat(memeVideoIds).concat(topVideoIds);

    videoIds = allVideoIds;

    init()
})();


// List of video IDs
let currentVideoId = ""; // Id of the current video

function selectOption(optionId) {
    // Remove the "active" class from all options
    document.querySelectorAll('.slider h3').forEach(option => {
        option.classList.remove('active');
    });

    // Add the "active" class to the clicked option
    const selectedOption = document.getElementById(optionId);
    selectedOption.classList.add('active');

    if (optionId === "all") {
        videoIds = allVideoIds;
    } else if (optionId === "music") {
        videoIds = musicVideoIds;
    } else if (optionId === "meme") {    
        videoIds = memeVideoIds;
    } else if (optionId === "top5") {
        videoIds = topVideoIds;
    }

    return optionId;
}

function loadRandomVideo() {
    // Filter out the current video ID from the list of available video IDs
    const availableVideoIds = videoIds.filter(id => id !== currentVideoId);
    
    // Select a random video ID from the filtered list
    const randomIndex = Math.floor(Math.random() * availableVideoIds.length);
    const videoId = availableVideoIds[randomIndex];
    
    currentVideoId = videoId;
    setVideo(videoId); // Set the video to the iframe
}

function setVideo(videoId) {
    const iframe = document.getElementById("youtube-video");
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    updateURL();
}

function updateURL() {
    const params = new URLSearchParams();
    params.set('videoId', currentVideoId);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('videoId')) {
        currentVideoId = params.get('videoId');
    }
    if (params.has('type')) {
        selectOption(params.get('type'));
    }
}
