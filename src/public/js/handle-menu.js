const menuWrapper = document.getElementById('menuWrapper');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const scrollStep = 100; 

rightBtn.addEventListener('click', () => {
  menuWrapper.scrollBy({ left: scrollStep, behavior: 'smooth' });
});

leftBtn.addEventListener('click', () => {
  menuWrapper.scrollBy({ left: -scrollStep, behavior: 'smooth' });
});



