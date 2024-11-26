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
