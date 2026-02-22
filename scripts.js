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
const threshold_swipe = 45;

function handleStart(e, x) {
  startX = x;
}

let freezed = false;
function handleEnd(e, endX) {
  if(freezed) return;

  // prevent double firing of touch and mouse events
  freezed = true;
  setTimeout(() => {
    freezed = false;
  }, 100);

  const diffX = endX - startX;
  if ((Math.abs(diffX) > threshold_swipe)) {
    // swipe logic
    diffX > 0 ? goPrev() : goNext();
  } else if (Math.abs(diffX) == 0){
    // click logic
    endX < window.innerWidth / 2 ? goPrev() : goNext();
  }
}

const viewport = document.querySelector('.viewport');
// Event Listeners
viewport.addEventListener('touchstart', e => handleStart(e, e.touches[0].clientX));
viewport.addEventListener('touchend', e => handleEnd(e, e.changedTouches[0].clientX));
viewport.addEventListener('mousedown', e => handleStart(e, e.clientX));
viewport.addEventListener('mouseup', e => handleEnd(e, e.clientX));


// 2. Define what happens when it reaches the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      goNext();
      for (let i = 0; i < 3; i++) {
        if (Math.random() < 0.5) {
          setTimeout(() => {
            goNext();
          }, 300 * (i + 1)); 
        }
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.9 });

// 3. Start observing
observer.observe(viewport);