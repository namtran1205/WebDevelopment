document.addEventListener('DOMContentLoaded', () => {
const navLinks = document.querySelectorAll('.nav-link');
const frames = document.querySelectorAll('.card');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
    e.preventDefault();

    navLinks.forEach(nav => nav.classList.remove('active'));

    frames.forEach(frame => frame.style.display = 'none');

    const targetFrameId = link.getAttribute('href').substring(1);
    const targetFrame = document.getElementById(targetFrameId);
    if (targetFrame) {
        targetFrame.style.display = 'block';
    }

    link.classList.add('active');
    });
});
});

document.getElementById('saveChanges').addEventListener('click', async () => {
    const formData = new FormData(document.getElementById('profileForm'));
    const data = Object.fromEntries(formData.entries());
    const userId = '<%= userId %>';

    try {
        const response = await fetch(`/profile/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            window.location.reload();
        } else {
            const error = await response.text();
            alert(`Error: ${error}`);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating the profile.');
    }
});

function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.reload();
        }
    })
    .catch(error => console.error('Error:', error));
}
