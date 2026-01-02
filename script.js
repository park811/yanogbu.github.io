// 처음 로드될 때 저장된 데이터 불러오기
window.onload = () => {
  const notices = JSON.parse(localStorage.getItem("notices")) || [];
  notices.forEach(text => addNoticeToList(text));

  const images = JSON.parse(localStorage.getItem("images")) || [];
  images.forEach(src => addImageToGallery(src));
};

function show(id) {
  document.getElementById('notice').classList.add('hidden');
  document.getElementById('gallery').classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

// 공지 추가
function addNotice() {
  const input = document.getElementById('noticeInput');
  if (!input.value) return;

  addNoticeToList(input.value);

  const notices = JSON.parse(localStorage.getItem("notices")) || [];
  notices.push(input.value);
  localStorage.setItem("notices", JSON.stringify(notices));

  input.value = '';
}

function addNoticeToList(text) {
  const li = document.createElement('li');
  li.textContent = text;
  document.getElementById('noticeList').appendChild(li);
}

// 이미지 업로드
document.getElementById('imgInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    addImageToGallery(reader.result);

    const images = JSON.parse(localStorage.getItem("images")) || [];
    images.push(reader.result);
    localStorage.setItem("images", JSON.stringify(images));
  };
  reader.readAsDataURL(file);
});

function addImageToGallery(src) {
  const img = document.createElement('img');
  img.src = src;
  document.getElementById('galleryBox').appendChild(img);
}
