async function deletePost(postId) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        const response = await fetch(`/writer/delete/${postId}`, {
        method: 'DELETE', // Đây là phương thức cần sử dụng
        });

        if (response.ok) {
          alert('Bài viết đã được xóa');
          // Tải lại trang hoặc cập nhật lại danh sách bài viết
          window.location.href = 'writer/listPosts';
        } else {
          alert('Lỗi khi xóa bài viết');
        }
      } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        alert('Lỗi kết nối');
      }
    }
  }