// Initialize Quill editor  
const toolimmageOptions = [
  ['image'],
];


  const toolbarOptions = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline'],        // toggled buttons
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

      

      
      document.addEventListener('DOMContentLoaded', function () {

      const container_image = document.getElementById('editor_image');
      
      const quill_image = new Quill('#editor_image', {
        modules: {
          toolbar: toolimmageOptions
        },
        theme: 'snow'
      });

      const container = document.getElementById('editor');
      const quill_content = new Quill(container, {
        modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Nội dung',
      theme: 'snow'
      });




      // Handle form submission
      const form = document.querySelector('#form');
      form.addEventListener('submit', function (event) {
  
        if (!form.checkValidity()) {
          event.preventDefault(); // Ngăn chặn hành động submit mặc định
          event.stopPropagation();

          console.log("Form is not valid");
          return;
        }
        console.log('Script is running'); // Kiểm tra xem script đã chạy chưa
        // Lấy nội dung từ Quill editor
        // const imgTags = quill.container.querySelectorAll('img');
        //   imgTags.forEach((img, index) => {
        //     const src = img.src;
        //     if (src.startsWith('data:image/')) {
        //       // Gửi ảnh Base64 cùng với FormData
        //       formData.append(`image_${index}`, src);
        //     }
        //   });
        const content_image = quill_image.root.innerHTML;
        document.getElementById('hiddenContentImage').value = content_image; // Đặt nội dung vào input ẩn
        const content = quill_content.root.innerHTML;
        document.getElementById('hiddenContent').value = content; // Đặt nội dung vào input ẩn

        // Chuẩn bị dữ liệu form
        const formData = new FormData(form);
        formData.append('image', content_image); // Append nội dung từ Quill vào formData
        formData.append('content', content); // Append nội dung từ Quill vào formData

        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }
        // Gửi dữ liệu form qua Fetch API
        fetch('/createPage', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => console.log('Success:', data))
          .catch(error => console.error('Error:', error));
      });
    });
 