const musicVideoIds = [
    "9bZkp7q19f0", "60ItHLz5WEA", "F6va6tg62qg", "7e0-puVc3Qw", "n6R38pxcfdE",
    "dpKAnAO6vqw", "L6ZkEWHoAPA", "qP-7GNoDJ5c", "c3b6O8SmTpE", "BvwxPnHgV3Y",
    "At8v_Yc044Y", "UtF6Jej8yb4", "dQw4w9WgXcQ", "AKNUORtuOnk", "ekr2nIex040",
    "sr-_Pfw-Hnc", "QURWqh0nt_A", "2ApG8TOJOl0", "zDjEw_VULDM", "0sLEmLVRB4c",
];

const memeVideoIds = [
    "3JZ_D3ELwOQ", "hY7m5jjJ9mM", "4eXtG3JhjIk", "iPNNc4O8N1E", "9cPxh2DikIA",
    "adQPOa5YQK4", "jNQXAC9IVRw", "PvB0kWs2IPQ", "3dgQcSn9wAs", "nOJd3xoKMyI",
    "HtTUsOKjWyQ", "fcJAhAqhRww", "H10xp3u5AxE", "Eez7qWEQ2Ww", "frjtW6QY_mY",
    "do7psVA1K3g", "DUGN-12HHwQ", "FD8SgayyCv8", "VLP_tnnDGSQ", "Fr0n1AHq0YA",
    "htlhY5BgrKU", "qvLjA1tytxo", "TqHqTFtH_pw", "QSkAOTz-VAc", "M1lJwVMsi_Y",
    "uvvsvkHhE3M", "ull5YaEHvw0", "bN2rUoX7540", "ci6ZtPAN0PM", "kn271kr_ks0",
    "0YRTwHe4GsE", "8pq2AERG7dU", "dxrPgoBEXPA", "6dMjCa0nqK0", "hjQCSLb9OXU",
    "_N_jY5ReQIU", "ViVIUjn54IA", "7dPc-6Ewhac", "7d0vfCThzYs", "xobNmldbWpo",
    "O2PXIRDwFxk", "ZA4m25i43Bw", "aS7qiu8T-4Q", "90O5JJgzu6E", "MnIRAGodAXA"
];

const topVideoIds = [
    "lL9LcfSlPfA", "mCh6VpxLubc", "1gFpXr5_eyM", "sUItmkUY-hY", "YoHj4v_P8V8",
    "tOOaPvEHIIw", "If-qOb4e2mU", "vTlyMLnUJHo", "qmxE9vOmSK4", "ccgepjmiNgA",
    "hkBnFAfgMuI", "1gFpXr5_eyM", "KemgZl9kHIs", "NvGweo5zICM", "SJrwc7QpE9s",
];

const allVideoIds = musicVideoIds.concat(memeVideoIds).concat(topVideoIds);

let videoIds = allVideoIds;

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
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    const videoId = videoIds[randomIndex];
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

function init() {
    applyURLParams();
    loadLocalStorage();
    if (currentVideoId) {
        setVideo(currentVideoId);
    } else {
        loadRandomVideo();
    }
}

// Load a random video on initial page load
window.onload = init;