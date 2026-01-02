function show(id) {
  document.getElementById('notice').classList.add('hidden');
  document.getElementById('gallery').classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

function addNotice() {
  const input = document.getElementById('noticeInput');
  if (!input.value) return;
  const li = document.createElement('li');
  li.textContent = input.value;
  document.getElementById('noticeList').appendChild(li);
  input.value = '';
}

document.getElementById('imgInput').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    const img = document.createElement('img');
    img.src = r.result;
    document.getElementById('galleryBox').appendChild(img);
  };
  r.readAsDataURL(file);
});
