const scrollBox = document.querySelector('.scroll_box');

let isDragging = false; 
let startX; 
let scrollLeft; 

scrollBox.addEventListener('mousedown', (e) => {
  isDragging = true;
  scrollBox.classList.add('active');
  startX = e.pageX - scrollBox.offsetLeft; 
  scrollLeft = scrollBox.scrollLeft; 
});

scrollBox.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollBox.offsetLeft;
  const walk = (x - startX) * 1.5; 
  scrollBox.scrollLeft = scrollLeft - walk; 
});

scrollBox.addEventListener('mouseup', () => {
  isDragging = false;
  scrollBox.classList.remove('active');
});

scrollBox.addEventListener('mouseleave', () => {
  isDragging = false;
  scrollBox.classList.remove('active');
});


const webTitle = document.querySelector('.web-title');
const eventElement = document.querySelector('.event');
const santaImage = document.querySelector('.santa'); 

window.addEventListener('scroll', function() {
  webTitle.classList.add('fixed');
  const scrollPosition = window.scrollY;

  let newHeight = Math.max(200 - scrollPosition*5, 0); 

  eventElement.style.height = newHeight + 'px';

  if (newHeight === 0) {
    webTitle.classList.add('fixed');
    scrollBox.classList.add('fixed-nav');
  } else {
    webTitle.classList.remove('fixed');
    scrollBox.classList.remove('fixed-nav');
  }
});