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
      page.style.zIndex = detectBrowser() == "Safari" ? 10 + index : pages.length + index;

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

function goNext() { if (currentIdx < pages.length) { currentIdx++; updateState(direction = 'next'); } }
function goPrev() { if (currentIdx > 0) { currentIdx--; updateState(direction = 'prev'); } }

updateState();


let startX = 0;
let startY = 0;
const threshold_swipe = 30;
const threshold_click = 5;

function handleStart(e, x, y) {
  startX = x;
  startY = y;
}

let freezed = false;
function handleEnd(e, endX, endY) {
  if (freezed) return;

  // prevent double firing of touch and mouse events
  freezed = true;
  setTimeout(() => {
    freezed = false;
  }, 100);

  const diffX = endX - startX;
  const diffY = endY - startY;
  if (Math.abs(diffX) > threshold_swipe) {
    // swipe logic
    diffX > 0 ? goPrev() : goNext();
  } else if ((Math.abs(diffX) < threshold_click) && (Math.abs(diffY) < threshold_click)) {
    // click logic
    endX < window.innerWidth / 2 ? goPrev() : goNext();
  }
}

const viewport = document.querySelector('.viewport');
// Event Listeners
viewport.addEventListener('touchstart', e => handleStart(e, e.touches[0].clientX, e.touches[0].clientY));
viewport.addEventListener('touchend', e => handleEnd(e, e.changedTouches[0].clientX, e.changedTouches[0].clientY));
viewport.addEventListener('mousedown', e => handleStart(e, e.clientX, e.clientY));
viewport.addEventListener('mouseup', e => handleEnd(e, e.clientX, e.clientY));

// book page auto flip
const observer_book = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      random_page_flip_count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < random_page_flip_count; i++) {
        setTimeout(() => {
          goNext();
        }, 300 * i);
      }

      observer_book.unobserve(entry.target);
    }
  });
}, { threshold: 1.0 });

observer_book.observe(viewport);


// image overlay fade in
const observer_overlay = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('is-visible');
      }, Math.floor(Math.random() * 500));
    } else {
      setTimeout(() => {
        entry.target.classList.remove('is-visible');
      }, Math.floor(Math.random() * 500));
    }
  });
}, { threshold: 0.75 });

observer_overlay.observe(document.getElementById('overlay1'));
observer_overlay.observe(document.getElementById('overlay2'));
observer_overlay.observe(document.getElementById('overlay3'));