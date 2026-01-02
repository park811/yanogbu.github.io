import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDK7LdFb1ZzxjfLHbHWgD3TvIDBxESSp6M",
  authDomain: "yanogbu.firebaseapp.com",
  projectId: "yanogbu",
  storageBucket: "yanogbu.firebasestorage.app",
  messagingSenderId: "383928455310",
  appId: "1:383928455310:web:2f1890e588fdb67c8979df",
  measurementId: "G-C6X972MNHN"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// 공지 불러오기
const noticeList = document.getElementById("noticeList");

const q = query(collection(db, "notices"), orderBy("time", "desc"));
const snapshot = await getDocs(q);
snapshot.forEach(doc => {
  const li = document.createElement("li");
  li.textContent = doc.data().text;
  noticeList.appendChild(li);
});

// 공지 추가
window.addNotice = async function () {
  const input = document.getElementById("noticeInput");
  if (!input.value) return;

  await addDoc(collection(db, "notices"), {
    text: input.value,
    time: Date.now()
  });

  location.reload();
};

// 이미지 업로드
document.getElementById("imgInput").addEventListener("change", async e => {
  const file = e.target.files[0];
  if (!file) return;

  const imgRef = ref(storage, `images/${Date.now()}_${file.name}`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  const img = document.createElement("img");
  img.src = url;
  document.getElementById("galleryBox").appendChild(img);
});
import { deleteDoc, doc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.deleteAllNotices = async function () {
  const snapshot = await getDocs(collection(db, "notices"));
  snapshot.forEach(async d => {
    await deleteDoc(doc(db, "notices", d.id));
  });
  location.reload();
};
const ADMIN_PASSWORD = "yanogbu123";

window.adminLogin = function () {
  const pw = prompt("관리자 비밀번호를 입력하세요");
  if (pw === ADMIN_PASSWORD) {
    localStorage.setItem("admin", "true");
    enableAdmin();
    alert("관리자 로그인 완료");
  } else {
    alert("비밀번호가 틀렸습니다");
  }
};

function enableAdmin() {
  document.getElementById("adminArea").classList.remove("hidden");
  document.getElementById("adminGallery").classList.remove("hidden");
}

window.onload = () => {
  if (localStorage.getItem("admin") === "true") {
    enableAdmin();
  }
};