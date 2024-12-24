const videoIds = [
    "3JZ_D3ELwOQ", "E7wJTI-1dvQ", "hY7m5jjJ9mM", "4eXtG3JhjIk", "iPNNc4O8N1E",
    "9bZkp7q19f0", "60ItHLz5WEA", "F6va6tg62qg", "9cPxh2DikIA", "lL9LcfSlPfA",
    "adQPOa5YQK4", "jNQXAC9IVRw", "PvB0kWs2IPQ", "3dgQcSn9wAs", "7e0-puVc3Qw",
    "nOJd3xoKMyI", "HtTUsOKjWyQ", "fcJAhAqhRww", "H10xp3u5AxE", "Eez7qWEQ2Ww",
    "frjtW6QY_mY", "mCh6VpxLubc", "do7psVA1K3g", "DUGN-12HHwQ", "FD8SgayyCv8",
    "VLP_tnnDGSQ", "n6R38pxcfdE", "dpKAnAO6vqw", "Fr0n1AHq0YA", "htlhY5BgrKU",
    "qvLjA1tytxo", "TqHqTFtH_pw", "1gFpXr5_eyM", "QSkAOTz-VAc", "L6ZkEWHoAPA",
    "M1lJwVMsi_Y", "uvvsvkHhE3M", "ull5YaEHvw0", "bN2rUoX7540", "ci6ZtPAN0PM",
    "kn271kr_ks0", "0YRTwHe4GsE", "8pq2AERG7dU", "dxrPgoBEXPA", "qP-7GNoDJ5c",
    "c3b6O8SmTpE", "BvwxPnHgV3Y", "At8v_Yc044Y", "UtF6Jej8yb4", "6dMjCa0nqK0",
    "dQw4w9WgXcQ", "AKNUORtuOnk", "ekr2nIex040", "sr-_Pfw-Hnc", "QURWqh0nt_A",
    "hjQCSLb9OXU", "_N_jY5ReQIU", "ViVIUjn54IA", "7dPc-6Ewhac", "7d0vfCThzYs",
    "xobNmldbWpo", "O2PXIRDwFxk", "2ApG8TOJOl0", "zDjEw_VULDM", "8hLQxph3cbM"
]; // List of video IDs
let currentVideoId = ""; // Id of the current video

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
}

function init() {
    applyURLParams();
    if (currentVideoId) {
        setVideo(currentVideoId);
    } else {
        loadRandomVideo();
    }
}

// Load a random video on initial page load
window.onload = init;