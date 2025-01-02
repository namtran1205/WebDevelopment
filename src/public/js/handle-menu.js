let listCate = document.querySelector('.list_category');

let isDragging = false; 
let startX; 
let scrollLeft; 

if(listCate) {
  listCate.addEventListener('mousedown', (e) => {
    isDragging = true;
    listCate.classList.add('active');
    startX = e.pageX - listCate.offsetLeft;
    scrollLeft = listCate.scrollLeft; 
  });
  
  listCate.addEventListener('mousemove', (e) => {
    if (!isDragging) return; 
    e.preventDefault();
    
    const x = e.pageX - listCate.offsetLeft; 
    const walk = (x - startX) * 1.5; 
    
    listCate.scrollLeft = scrollLeft - walk; 
  });
  
  listCate.addEventListener('mouseup', () => {
    isDragging = false; 
    listCate.classList.remove('active');
  });
  
  listCate.addEventListener('mouseleave', () => {
    isDragging = false; 
    listCate.classList.remove('active');
  });
}



const toggleButton = document.querySelector('.toggle i');
const categoryDropdown = document.querySelector('.category-dropdown');
const navList = document.querySelector('.list-nav');
const body = document.body; 

if (toggleButton) {
  toggleButton.addEventListener('click', () => {
    if (toggleButton.classList.contains('bx-menu')) {
      toggleButton.classList.remove('bx-menu');
      toggleButton.classList.add('bx-x');
      categoryDropdown.classList.toggle('show');
      navList.style.display = "none";
      body.style.overflow = 'hidden';
    } else {
      toggleButton.classList.remove('bx-x');
      toggleButton.classList.add('bx-menu');
      categoryDropdown.classList.toggle('show');
      navList.style.display = "flex";
      body.style.overflow = 'auto';
    }
  });
}


const webTitle = document.querySelector('.web-title');
const eventElement = document.querySelector('.event');
const santaImage = document.querySelector('.santa'); 
const noel = document.querySelector('.noel'); 
const scrollBox = document.querySelector('.scroll_box'); 


// window.addEventListener('scroll', function() {
//   webTitle.classList.add('fixed');
//   const scrollPosition = window.scrollY;

//   let newHeight = Math.max(120 - scrollPosition*4, 0); 

//   eventElement.style.height = newHeight + 'px';

//   if (newHeight < 10 ) {
//     noel.style.display = 'none';
//   }
//   else {
//     noel.style.display = 'block';
//   }
//   if (newHeight === 0) {
//     webTitle.classList.add('fixed');
//     scrollBox.classList.add('fixed-nav');
//   } else {
//     webTitle.classList.remove('fixed');
//     scrollBox.classList.remove('fixed-nav');
//   }
// });

function toggleSubCategories(categoryId) {
  const moreSubCategories = document.getElementById(categoryId);
  const button = moreSubCategories.previousElementSibling.querySelector('.view-more-btn');
  
  if (moreSubCategories.style.display === "none") {
      moreSubCategories.style.display = "block";
      button.textContent = "Thu gọn"; 
  } else {
      moreSubCategories.style.display = "none";
      button.textContent = "Xem thêm"; 
  }
}