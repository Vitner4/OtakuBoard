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