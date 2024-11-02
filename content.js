let currentlyViewedImage = null;

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const img = entry.target.querySelector('img');
            if (img && img.src) {
                currentlyViewedImage = img.src;
                console.log("Current image updated:", currentlyViewedImage);
            }
        }
    });
}, {
    root: null,  // meaning the viewport is the root
    threshold: 0.7 // meaning the image is 70% visible
});
// setting the observer to watch for all the _aagv classes
function setupObserver() {
    const posts = document.querySelectorAll('._aagv');
    console.log("Found posts:", posts.length);
    posts.forEach((post) => observer.observe(post));
}
// the first time
setupObserver();

//because the page keeps refreshing and dynamically loading new content
const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            setupObserver();
        }
    });
});

bodyObserver.observe(document.body, { childList: true, subtree: true });

// this receives the message from the background.js and sends the currentlyViewedImage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getImageSource") {
        console.log("Sending current image:", currentlyViewedImage);
        sendResponse({imageSource: currentlyViewedImage});
    }
    return true;
});
