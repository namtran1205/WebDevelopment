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

//slide-show
let list = document.querySelector('.slide-show .list-slide');
let items = document.querySelectorAll('.slide-show .list-slide .item');
let banner = document.querySelector('.slide-show .banner-menu');
let info = document.querySelectorAll('.slide-show .banner-menu .info');
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
  let switchBanner = info[active].offsetLeft;
  for (i=0; i<lengthItem; i++){
    info[i].style.display = 'none';
  }
  info[active].style.display = 'flex';
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

// top 10 views most

let mostView = document.querySelector(".most-view-1");
let mostItem = document.querySelectorAll(".most-view-1 .list-item .item");
let listButton1 = document.querySelectorAll(".case-button-1 li");

let indexView = 0;
let lengthMost = mostItem.length - 1;

listButton1.forEach((button, i) => {
    button.addEventListener("click", () => {
    // Calculate the new index based on the button clicked
        if (indexView > lengthMost) {
            indexView = lengthMost; // Ensure the index does not exceed the number of items
        }
        if (indexView - i*2 <= 0){
          indexView = i*2 - indexView;
          let moveLeft = mostItem[indexView].offsetLeft; 
          let scrollStep = moveLeft;
          mostView.scrollBy({ left: scrollStep, behavior: 'smooth' });
          indexView = i*2;
        }
        else {
          indexView = indexView - 2*i; 
          let moveLeft = mostItem[indexView].offsetLeft; 
          let scrollStep = moveLeft;
          mostView.scrollBy({ left: -scrollStep, behavior: 'smooth' });
          indexView = 2*i;
        }


        // Update active button
        listButton1.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

// top 10 new post

let newPost = document.querySelector(".most-view-2");
let newItem = document.querySelectorAll(".most-view-2 .list-item .item");
let listButton2 = document.querySelectorAll(".case-button-2 li");

let indexNew = 0;
let lengthNew = mostItem.length - 1;

listButton2.forEach((button, i) => {
    button.addEventListener("click", () => {
    // Calculate the new index based on the button clicked
        if (indexNew > lengthNew) {
          indexNew = lengthNew; // Ensure the index does not exceed the number of items
        }
        if (indexNew - i*2 <= 0){
          indexNew = i*2 - indexNew;
          let moveLeft = newItem[indexNew].offsetLeft; 
          let scrollStep = moveLeft;
          newPost.scrollBy({ left: scrollStep, behavior: 'smooth' });
          indexNew = i*2;
        }
        else {
          indexNew = indexNew - 2*i; 
          let moveLeft = newItem[indexNew].offsetLeft; 
          let scrollStep = moveLeft;
          newPost.scrollBy({ left: -scrollStep, behavior: 'smooth' });
          indexNew = 2*i;
        }


        // Update active button
        listButton2.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });
});

const scrollable = document.getElementById('scrollable');
let isDragging = false;
let startX;
let scrollLeft;

scrollable.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - scrollable.offsetLeft;
    scrollLeft = scrollable.scrollLeft;
});

scrollable.addEventListener('mouseleave', () => {
    isDragging = false;
});

scrollable.addEventListener('mouseup', () => {
    isDragging = false;
});

scrollable.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollable.offsetLeft;
    const walk = (x - startX) * 1.2; // tốc độ cuộn
    scrollable.scrollLeft = scrollLeft - walk;
});

document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.menu li a');
  const contentDiv = document.getElementById('home-page-content');

  menuItems.forEach(item => {
      item.addEventListener('click', function(event) {
          event.preventDefault();
          const id = this.getAttribute('data-id');
          fetch(`/${id}`)
              .then(response => response.text())
              .then(data => {
                  contentDiv.innerHTML = data;
                  paginate()
              })
              .catch(error => console.error('Error loading content:', error));
      });
  });
});


function paginate() {
  const container = document.querySelector('.box-item');
  if (!container) {
    console.error('Container not found. Make sure .box-item exists in your HTML.');
    return;
  }

  const newsItems = document.querySelectorAll('.news-item');
  const itemsPerPage = 8;
  const listNumber = document.querySelector('.list-number');
  let currentPage = 1;
  const totalPages = Math.ceil(newsItems.length / itemsPerPage);


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

}

function createPage(pageNum) {
  const newPage = document.createElement('div');
  newPage.classList.add('list-news');
  newPage.id = `page-${pageNum}`;
  newPage.classList.add('hidden');
  return newPage;
}

