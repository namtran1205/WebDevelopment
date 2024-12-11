
  document.addEventListener('DOMContentLoaded', async () => {
    const draftsTableBody = document.getElementById('drafts');
    //const loadingSpinner = document.getElementById('loading');

    // Hiển thị spinner
    //loadingSpinner.style.display = 'block';

    try {
      // Gọi API
      const response = await fetch('/editor/get', { method: 'GET' });
      console.log(response);  
      if (!response.ok) throw new Error('Không thể lấy danh sách bài viết.');

      // Chuyển dữ liệu sang JSON
      const drafts = await response.json();

      // Ẩn spinner
      //loadingSpinner.style.display = 'none';

      // Kiểm tra dữ liệu
      if (drafts.length === 0) {
        draftsTableBody.innerHTML = '<tr><td colspan="3">Không có bài viết nào.</td></tr>';
        return;
      }

      // Render bài viết
      drafts.forEach((draft) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${draft.title}</td>
          <td>${draft.reporter?.name || 'Không rõ'}</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="approveDraft('${draft._id}')">Duyệt</button>
            <button class="btn btn-danger btn-sm" onclick="rejectDraft('${draft._id}')">Từ chối</button>
          </td>
        `;
        draftsTableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Lỗi:', error);
      draftsTableBody.innerHTML = '<tr><td colspan="3">Đã xảy ra lỗi.</td></tr>';
      //loadingSpinner.style.display = 'none';
    }
  });

  // Hàm duyệt bài viết
  async function approveDraft(postId) {
    try {
      const response = await fetch(`/editor/approve/${postId}`, { method: 'POST' });
      if (response.ok) {
        alert('Bài viết đã được duyệt.');
        location.reload(); // Reload lại trang
      } else {
        alert('Lỗi khi duyệt bài viết.');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi duyệt bài viết.');
    }
  }

  // Hàm từ chối bài viết
  async function rejectDraft(postId) {
    const reason = prompt('Lý do từ chối:');
    if (!reason) {
      alert('Bạn cần nhập lý do từ chối.');
      return;
    }

    try {
      const response = await fetch(`/editor/reject/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      if (response.ok) {
        alert('Bài viết đã bị từ chối.');
        location.reload(); // Reload lại trang
      } else {
        alert('Lỗi khi từ chối bài viết.');
      }
    } catch (error) {
      alert('Đã xảy ra lỗi khi từ chối bài viết.');
    }
  }
