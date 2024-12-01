document.addEventListener('DOMContentLoaded', function () {
    tinymce.init({
      selector: '#content',
      plugins: 'image link media',
      toolbar: 'undo redo | bold italic | link image media',
      height: 400
    });
  });