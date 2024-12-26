document.addEventListener('DOMContentLoaded', function () {
  const toolbarOptions = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline'],
    ['link', 'image', 'video', 'formula'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    [{ 'color': [] }, { 'background': [] }],
    ['clean']
  ];

  const handleQuillContent = (quillImage, quillContent, form) => {
    // Đồng bộ nội dung Quill vào các input ẩn trước khi submit
    const hiddenContentImage = form.querySelector('#hiddenContentImage');
    const hiddenContent = form.querySelector('#hiddenContent');

    if (quillImage && hiddenContentImage) {
      hiddenContentImage.value = quillImage.root.innerHTML;
    }
    if (quillContent && hiddenContent) {
      hiddenContent.value = quillContent.root.innerHTML;
    }
  };

  // Xử lý submit form với fetch
  const handleFormSubmit = (form, quillImage, quillContent, actionUrl) => {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        event.stopPropagation();
        return;
      }

      // Đồng bộ nội dung từ Quill
      handleQuillContent(quillImage, quillContent, form);

      const formData = new FormData(form);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      try {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Success:', result);
          alert('Thao tác thành công!');
          window.location.href = '/writer/posts';
        } else {
          console.error('Error:', response.statusText);
          alert('Có lỗi xảy ra.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi không mong muốn xảy ra.');
      }
    });
  };


  const createForm = document.querySelector('#createForm');
  const editForm = document.querySelector('#editForm');

  if (createForm) {
    const quillCreateImage = new Quill('#createForm #create_image', {
      modules: { toolbar: [['image']] },
      theme: 'snow',
    });
    const quillCreateContent = new Quill('#createForm #create_content', {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
    });
    handleFormSubmit(
      createForm,
      quillCreateImage,
      quillCreateContent,
      '/writer/createPost'
    );
  }

  if (editForm) {
    const quillEditImage = new Quill('#editForm #edit_image', {
      modules: { toolbar: [['image']] },
      theme: 'snow',
    });
    const quillEditContent = new Quill('#editForm #edit_content', {
      modules: { toolbar: toolbarOptions },
      theme: 'snow',
    });
    handleFormSubmit(
      editForm,
      quillEditImage,
      quillEditContent,
      `/writer/update/${editForm.dataset.postId}`
    );
  }
  
});

// // Initialize Quill editor  
// const toolimmageOptions = [
//   ['image'],
// ];


//   const toolbarOptions = [
//     [{ 'font': [] }],
//     ['bold', 'italic', 'underline'],        // toggled buttons
//     ['link', 'image', 'video', 'formula'],

//     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
//     [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
//     [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
//     [{ 'direction': 'rtl' }],                         // text direction

//     [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
//     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

//     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  
//     [{ 'align': [] }],

//     ['clean']                                         // remove formatting button
//   ];

      

      
//       document.addEventListener('DOMContentLoaded', function () {

//       const container_image = document.getElementById('editor_image');
      
//       const quill_image = new Quill('#editor_image', {
//         modules: {
//           toolbar: toolimmageOptions
//         },
//         theme: 'snow'
//       });

//       const container = document.getElementById('editor');
//       const quill_content = new Quill(container, {
//         modules: {
//         toolbar: toolbarOptions
//       },
//       placeholder: 'Nội dung',
//       theme: 'snow'
//       });


//       // Xử lý submit cho cả hai form
//       const handleFormSubmit = (form, quillImage, quillContent) => {
//         form.addEventListener('submit', function (event) {
//           if (!form.checkValidity()) {
//             event.preventDefault();
//             event.stopPropagation();
//             return;
//           }

//           // Cập nhật nội dung từ Quill vào input ẩn
//           if (quillImage) {
//             const contentImage = quillImage.root.innerHTML;
//             form.querySelector('#hiddenContentImage').value = contentImage;
//           }

//           if (quillContent) {
//             const content = quillContent.root.innerHTML;
//             form.querySelector('#hiddenContent').value = content;
//           }
//         });
//       };

//       // Handle form submission
//       const form = document.querySelector('#form');
//       form.addEventListener('submit', function (event) {
  
//         if (!form.checkValidity()) {
//           event.preventDefault(); // Ngăn chặn hành động submit mặc định
//           event.stopPropagation();

//           console.log("Form is not valid");
//           return;
//         }
//         console.log('Script is running'); // Kiểm tra xem script đã chạy chưa
//         // Lấy nội dung từ Quill editor
//         // const imgTags = quill.container.querySelectorAll('img');
//         //   imgTags.forEach((img, index) => {
//         //     const src = img.src;
//         //     if (src.startsWith('data:image/')) {
//         //       // Gửi ảnh Base64 cùng với FormData
//         //       formData.append(`image_${index}`, src);
//         //     }
//         //   });
//         const content_image = quill_image.root.innerHTML;
//         document.getElementById('hiddenContentImage').value = content_image; // Đặt nội dung vào input ẩn
//         const content = quill_content.root.innerHTML;
//         document.getElementById('hiddenContent').value = content; // Đặt nội dung vào input ẩn

//         // Chuẩn bị dữ liệu form
//         const formData = new FormData(form);
//         formData.append('image', content_image); // Append nội dung từ Quill vào formData
//         formData.append('content', content); // Append nội dung từ Quill vào formData

//         for (let [key, value] of formData.entries()) {
//           console.log(`${key}: ${value}`);
//         }
//         // Gửi dữ liệu form qua Fetch API
//         fetch('/createPage', {
//           method: 'POST',
//           body: formData,
//         })
//           .then(response => response.json())
//           .then(data => console.log('Success:', data))
//           .catch(error => console.error('Error:', error));
//       });
//     });
 