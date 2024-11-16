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

// Chia trang
const newsItems = document.querySelectorAll('.news-item');
const itemsPerPage = 8;
let currentPage = 1;
const totalPages = Math.ceil(newsItems.length / itemsPerPage);
const listNumber = document.querySelector('.list-number');

function createPage(pageNum) {
const newPage = document.createElement('div');
newPage.classList.add('list-news');
newPage.id = `page-${pageNum}`;
newPage.classList.add('hidden');
return newPage;
}

function paginate() {
    const container = document.querySelector('.box-item'); 
  
    let page = createPage(currentPage);
    container.appendChild(page);
    
    newsItems.forEach((item, index) => {
      if (index % itemsPerPage === 0 && index !== 0) {
        page = createPage(currentPage);
        const num = document.createElement('li');
        num.textContent = currentPage;
        listNumber.appendChild(num);
        currentPage++;
      }
      page.appendChild(item);
    });
    const num = document.createElement('li');
    num.textContent = currentPage;
    listNumber.appendChild(num);
  }


paginate();

let numberPage = 1;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

prevBtn.addEventListener('click', () => {
    if (numberPage > 1 ) {
        let currentPage = document.getElementById(`page-${numberPage}`);
        const container = document.querySelector('.box-item');
        container.removeChild(currentPage);
        numberPage--;
        nextPage = createPage(numberPage);
        let count = 1;
        newsItems.forEach((item, index) => {
            if (index % itemsPerPage === 0 && index !== 0) {
              count++;
            }
            if (numberPage == count){
                nextPage.appendChild(item);
            }
          });
        container.appendChild(nextPage);
    }
});



nextBtn.addEventListener('click', () => {
    if (numberPage < totalPages) {
        let currentPage = document.getElementById(`page-${numberPage}`);
        const container = document.querySelector('.box-item');
        container.removeChild(currentPage);
        numberPage ++;
        let count = 1;
        nextPage = createPage(numberPage);
        newsItems.forEach((item, index) => {
            if (index % itemsPerPage === 0 && index !== 0) {
              count++;
            }
            if (numberPage == count){
                nextPage.appendChild(item);
            }
          });
        container.appendChild(nextPage);
    }
});

//slide-show
let list = document.querySelector('.slide-show .list-slide');
let items = document.querySelectorAll('.slide-show .list-slide .item');
let dots = document.querySelectorAll('.slide-show .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 0;
let lengthItem = items.length - 1;

prev.addEventListener('click', () => {
  if(active - 1 < 0){
    active = lengthItem;
  }else{
    active = active - 1;
  }
  reloadSlider();
});

next.onclick = function(){
  if(active + 1 > lengthItem){
    active = 0;
  }else{
    active += 1;
  }
  reloadSlider();
}

let refreshSlider = setInterval(()=> {next.click()},3000);

function reloadSlider() {
  let checkLeft = items[active].offsetLeft;
  list.style.left = -checkLeft + 'px';

  let lastActiveDot = document.querySelector('.slide-show .dots li.active');
  lastActiveDot.classList.remove('active');
  dots[active].classList.add('active');
}
dots.forEach((li, key) => {
  li.addEventListener('click', function(){
    active = key;
    reloadSlider();
  })
})
