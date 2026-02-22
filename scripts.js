function isWeChat() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
}

function detectBrowser() {
    const userAgentString = navigator.userAgent;

    let isChrome = !!window.chrome;
    let isSafari = userAgentString.indexOf("Safari") > -1 && userAgentString.indexOf("Chrome") === -1;
    
    if (isChrome) {
        return "Chrome";
    } else if (isSafari) {
        return "Safari";
    } else {
        return "Other";
    }
}


if (isWeChat()) {
  document.getElementById('splash').innerHTML = `
<div class="slideshow">
  <div class="slides">
    <div class="slide"><img src="images/h1.jpg"></div>
    <div class="slide"><img src="images/h2.jpg"></div>
    <div class="slide"><img src="images/h3.jpg"></div>
    <div class="slide"><img src="images/h4.jpg"></div>
  </div>
</div>
  `;
}

const book = document.getElementById('book');
const pages = document.querySelectorAll('.page');
let currentIdx = 0;

function updateState(direction) {
  if (currentIdx == 0) {
    book.classList.add('front-cover');
  } else if (currentIdx == pages.length) {
    book.classList.add('back-cover');
  } else {
    book.classList.remove('front-cover');
    book.classList.remove('back-cover');
  }

  pages.forEach((page, index) => {
    // hack to prevent "underneath" images from popping in too early during flipping
    if ((index <= currentIdx) || (direction === 'prev')) {
      page.style.visibility = 'visible';
    } else {
      page.style.visibility = 'hidden';
    }

    if (index < currentIdx) {
      // Page is flipped to the LEFT
      page.classList.add('flipped');
      // Immediate high z-index for flipped pages to stay on top
      page.style.zIndex = detectBrowser() == "Safari"? 10 + index : pages.length + index;

      page.style.transform = `rotateY(-180deg)`;
    } else {
      // Page is unflipped on the RIGHT
      page.classList.remove('flipped');

      // This prevents the "underneath" images from popping in too early
      setTimeout(() => {
        page.style.zIndex = pages.length - index;
      }, 100);

      page.style.transform = `rotateY(0deg)`;
    }

  });

}

function goNext() { if (currentIdx < pages.length) { currentIdx++; updateState(direction='next'); } }
function goPrev() { if (currentIdx > 0) { currentIdx--; updateState(direction='prev'); } }

updateState();


let startX = 0;
let startY = 0;
const thresholdX = 30; // Reduced threshold for more sensitivity
const thresholdY = 45; // Reduced threshold for more sensitivity

function handleStart(e, x, y) {
  // Prevent mouse emulation on touch devices to stop "double clicks"
  if (e.type === 'touchstart') e.preventDefault();
  startX = x;
  startY = y;
}

function handleEnd(e, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;
  if ((Math.abs(diffX) > thresholdX) && (Math.abs(diffX) > Math.abs(diffY))) {
    diffX > 0 ? goPrev() : goNext();
  } //else if (Math.abs(diffY) > thresholdY){
    //diffY > 0 ? goPrev() : goNext();
  } else {
    // CLICK LOGIC:
    // Left half of screen -> Previous
    // Right half of screen -> Next
    endX < window.innerWidth / 2 ? goPrev() : goNext();
  }
}

const viewport = document.querySelector('.viewport');
// Event Listeners
viewport.addEventListener('touchstart', e => handleStart(e, e.touches[0].clientX, e.touches[0].clientY), { passive: false });
viewport.addEventListener('touchend', e => handleEnd(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: false });
viewport.addEventListener('mousedown', e => handleStart(e, e.clientX, e.clientY));
viewport.addEventListener('mouseup', e => handleEnd(e, e.clientX, e.clientY));


// 2. Define what happens when it reaches the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      goNext();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 1 });

// 3. Start observing
observer.observe(viewport);