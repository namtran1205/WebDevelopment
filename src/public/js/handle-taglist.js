const scrollContainer = document.querySelector('.tag-list');

let isDragging1 = false; 
let startX1; 
let scrollLeft1; 

scrollContainer.addEventListener('mousedown', (e) => {
  isDragging1 = true;
  scrollContainer.classList.add('active'); 
  startX1 = e.pageX - scrollContainer.offsetLeft; 
  scrollLeft1 = scrollContainer.scrollLeft; 
});

scrollContainer.addEventListener('mousemove', (e) => {
  if (!isDragging1) return; 
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const distance = x - startX1; 
  scrollContainer.scrollLeft = scrollLeft1 - distance; 
});

scrollContainer.addEventListener('mouseup', () => {
  isDragging1 = false;
  scrollContainer.classList.remove('active');
});