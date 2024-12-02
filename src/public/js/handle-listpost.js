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
        const link = document.createElement('a');
        link.textContent = currentPage;
        const currentUrl = window.location.href;
        link.href = `${currentUrl}`;
        num.appendChild(link);
        listNumber.appendChild(num);
        currentPage++;
      }
      page.appendChild(item);
    });
  
const num = document.createElement('li');
const link = document.createElement('a');
link.textContent = currentPage;
const currentUrl = window.location.href;
link.href = `${currentUrl}`;
num.appendChild(link);

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
  
paginate();