function isWeChat() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('micromessenger') !== -1;
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

function updateState() {
  if (currentIdx == 0) {
    book.classList.add('front-cover');
  } else if (currentIdx == pages.length) {
    book.classList.add('back-cover');
  } else {
    book.classList.remove('front-cover');
    book.classList.remove('back-cover');
  }
  pages.forEach((page, index) => {
    if (index <= currentIdx) {
      page.style.visibility = 'visible';
    } else {
      page.style.visibility = 'hidden';
    }

    if (index < currentIdx) {
      // Page is flipped to the LEFT
      page.classList.add('flipped');
      // Immediate high z-index for flipped pages to stay on top
      page.style.zIndex = 10 + index;
      page.style.transform = `rotateY(-180deg) translateX(-1px)`;
    } else {
      // Page is unflipped on the RIGHT
      page.classList.remove('flipped');

      // This prevents the "underneath" images from popping in too early
      setTimeout(() => {
        page.style.zIndex = pages.length - index;
      }, 100);

      // Stacked offset on the right
      const offset = (index - currentIdx) * 3;
      page.style.transform = `rotateY(0deg) translateX(${offset}px)`;
    }

  });

}

function goNext() { if (currentIdx < pages.length) { currentIdx++; updateState(); } }
function goPrev() { if (currentIdx > 0) { currentIdx--; updateState(); } }

updateState();


let startX = 0;
const threshold = 30; // Reduced threshold for more sensitivity

function handleStart(e, x) {
  // Prevent mouse emulation on touch devices to stop "double clicks"
  if (e.type === 'touchstart') e.preventDefault();
  startX = x;
}

function handleEnd(e, endX) {
  const diff = endX - startX;
  if (Math.abs(diff) > threshold) {
    // NATURAL BOOK LOGIC:
    // Pulling Right (diff > 0) -> Previous Page
    // Pulling Left (diff < 0) -> Next Page
    diff > 0 ? goPrev() : goNext();
  } else {
    // CLICK LOGIC:
    // Left half of screen -> Previous
    // Right half of screen -> Next
    endX < window.innerWidth / 2 ? goPrev() : goNext();
  }
}

const viewport = document.querySelector('.viewport');
// Event Listeners
viewport.addEventListener('touchstart', e => handleStart(e, e.touches[0].clientX), { passive: false });
viewport.addEventListener('touchend', e => handleEnd(e, e.changedTouches[0].clientX), { passive: false });
viewport.addEventListener('mousedown', e => handleStart(e, e.clientX));
viewport.addEventListener('mouseup', e => handleEnd(e, e.clientX));