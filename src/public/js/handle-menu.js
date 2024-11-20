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

const scrollables = document.querySelectorAll('#scrollable');

scrollables.forEach((scrollable, scrollableIndex) => {
    let isDragging = false;
    let startX;
    let scrollLeft;

    const buttons = document.querySelectorAll(`.case-button-${scrollableIndex + 1} li`);


    scrollable.addEventListener('mousedown', (e) => {
        e.preventDefault()
        isDragging = true;
        startX = e.pageX - scrollable.offsetLeft;
        scrollLeft = scrollable.scrollLeft;
    });

    document.querySelectorAll('.list-item .item img').forEach(img => {
      img.addEventListener('mousedown', (e) => {
          e.preventDefault();
      });
  });

    scrollable.addEventListener('mouseleave', () => {
      isDragging = false;
    });

    scrollable.addEventListener('mouseup', () => {
      isDragging = false;
    });

    scrollable.addEventListener('scroll', () => {
      updateActiveButton(scrollable, buttons);
  });

    scrollable.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollable.offsetLeft;
        const walk = (x - startX) * 2;
        scrollable.scrollLeft = scrollLeft - walk;
    });

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
          const items = scrollable.querySelectorAll('.item');
          if (!items) return;
          const itemWidth = items[0].offsetWidth + 20; 
          const scrollToPosition = index * itemWidth * 2;
          scrollable.scrollTo({
              left: scrollToPosition,
              behavior: 'smooth' 
          });

          buttons.forEach((btn, btnIndex) => {
              btn.classList.toggle('active', btnIndex === index);
          });
      });
  });
});

function updateActiveButton(scrollable, buttons) {
  const items = scrollable.querySelectorAll('.item');
  const itemWidth = items[0].offsetWidth + 10; 
  const scrollPosition = scrollable.scrollLeft;
  const itemsScrolled = Math.floor(scrollPosition / itemWidth);
  const buttonIndex = Math.floor(itemsScrolled / 2);
  
  buttons.forEach((button, index) => {
      button.classList.toggle('active', index === buttonIndex);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const menuItems = document.querySelectorAll('.menu-wrapper .menu li a');
  const contentDiv = document.getElementById('home-page-content');

  menuItems.forEach(item => {
      item.addEventListener('click', function(event) {
          const id = this.getAttribute('data-id');
          event.preventDefault();
          menuItems.forEach(menuItem => menuItem.classList.remove('active'));
          item.classList.add('active');
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
