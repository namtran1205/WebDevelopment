// // Handle form submission
// document.querySelector('form').addEventListener('submit', function(e) {
//   e.preventDefault(); // Prevent default form submission
  
//   // Get content from Quill editor
//   const content = quill.root.innerHTML; 
  
//   // Prepare form data
//   const formData = new FormData(this);
//   formData.append('content', content);

//   // Send form data to backend
//   fetch('/api/posts', {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//     alert('Post created successfully!');
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//     alert('Failed to create post!');
//   });
// });