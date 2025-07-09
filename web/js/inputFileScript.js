
// загрузка изображения
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');

uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.src = event.target.result;
            preview.style.display = 'block';
            uploadArea.querySelector('.upload-icon').style.display = 'none';
            uploadArea.querySelector('.upload-text').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
});

// выставление рейтигна
document.querySelectorAll('.star').forEach(star => {
  star.addEventListener('click', () => {
    const value = star.getAttribute('data-value');
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((s, i) => {
      s.classList.toggle('active', i < value);
    });
    
    document.querySelector('.rating-value').textContent = `${value} из 5`;
  });
});