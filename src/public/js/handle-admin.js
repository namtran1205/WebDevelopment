function showContent(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
      section.style.display = 'none';
    });
  
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
      selectedSection.style.display = 'block';
    }
  }
  
const subCategoriesData = {
    1: [
      { id: 101, name: 'Chính Trị', description: 'Tin tức chính trị' },
      { id: 102, name: 'Kinh Tế', description: 'Tin tức kinh tế' },
    ],
    2: [
      { id: 201, name: 'AI', description: 'Trí tuệ nhân tạo' },
      { id: 202, name: 'IoT', description: 'Internet of Things' },
    ],
    3: [
      { id: 301, name: 'Âm Nhạc', description: 'Tin tức âm nhạc' },
      { id: 302, name: 'Phim Ảnh', description: 'Tin tức phim ảnh' },
    ],
  };
  
  function loadSubCategories(mainCategoryId) {
    const subCategoryTable = document.getElementById('sub-category-table');
    subCategoryTable.innerHTML = ''; 
  
    const subCategories = subCategoriesData[mainCategoryId] || [];
    subCategories.forEach((subCategory) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${subCategory.id}</td>
        <td>${subCategory.name}</td>
        <td><button class="remove-btn" onclick="removeMainCategory(3)">X</button></td>
      `;
      subCategoryTable.appendChild(row);
    });
  }
  
  // Dữ liệu mẫu
const postsData = {
    1: {
      title: 'Bài Viết 1',
      content: "Nội dung chi tiết của Bài Viết 1.",
      date: '2024-11-30',
      category: 'Thời Sự',
      status: 'Chưa Duyệt',
    },
    2: {
      title: 'Bài Viết 2',
      content: 'Nội dung chi tiết của Bài Viết 2.',
      date: '2024-11-28',
      category: 'Công Nghệ',
      status: 'Đã Duyệt',
    },
    3: {
      title: 'Bài Viết 3',
      content: 'Nội dung chi tiết của Bài Viết 3.',
      date: '2024-11-27',
      category: 'Giải Trí',
      status: 'Chưa Duyệt',
    },
  };
  
  function viewPost(postId, status) {
    const post = postsData[postId];
    if (!post) return;
  
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-content').textContent = post.content;
    document.getElementById('post-date').textContent = post.date;
    document.getElementById('post-category').textContent = post.category;
    const approveBtn = document.getElementById("approve-btn");
    if (status === "Chưa được duyệt") {
        approveBtn.style.display = "inline-block";
    } else {
        approveBtn.style.display = "none";
    }
    document.getElementById('post-details').style.display = 'block';
  }
  
  function hidePostDetails() {
    document.getElementById('post-details').style.display = 'none';
  }
  
  function assignCategory(userId) {
    // Hiển thị form phân công chuyên mục
    document.getElementById("assign-category-form").style.display = "block";
    document.getElementById("editor-name").innerText = `Biên Tập Viên ${userId}`;
  }
  
  function saveAssignment() {
    const category = document.getElementById("category-select").value;
    if (!category) {
      alert("Vui lòng chọn chuyên mục!");
      return;
    }
  
    alert(`Đã phân công chuyên mục ${category} cho biên tập viên.`);
    closeAssignForm();
  }
  
  function closeAssignForm() {
    document.getElementById("assign-category-form").style.display = "none";
  }
  
  function renewAccount(userId) {
    // Hiển thị form gia hạn tài khoản
    document.getElementById("renew-account-form").style.display = "block";
    document.getElementById("reader-name").innerText = `Độc Giả ${userId}`;
  }
  
  function confirmRenewal() {
    const duration = document.getElementById("renew-duration").value;
    if (!duration) {
      alert("Vui lòng chọn thời gian gia hạn!");
      return;
    }
  
    alert(`Đã gia hạn tài khoản thêm ${duration} tháng.`);
    closeRenewForm();
  }
  
  function closeRenewForm() {
    document.getElementById("renew-account-form").style.display = "none";
  }
  