const video = document.getElementById('video');
const loader = document.getElementById('loader');
const mainContent = document.getElementById('main-content');

// Use the 'canplaythrough' event for the best result
video.addEventListener('canplaythrough', function() {
    // Hide the loader
    loader.style.display = 'none';

    // Show the main content
    mainContent.classList.remove('content-hidden');

    // Optional: Start playing the video automatically once loaded (must be muted in most modern browsers)
    // video.muted = true;
    // video.play(); 
});