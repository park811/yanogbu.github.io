import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase 설정
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

// 관리자 로그인
window.adminLogin = function () {
  const pw = prompt("관리자 비밀번호를 입력하세요");
  if (pw === "섹스") document.getElementById("adminArea").classList.remove("hidden");
  else alert("비밀번호 틀림");
};

// 공지 추가
window.addNotice = async function () {
  const input = document.getElementById("noticeInput");
  if (!input.value) return;
  await addDoc(collection(db, "notices"), { text: input.value, created: Date.now() });
  input.value = "";
  loadNotices();
};

// 공지 불러오기
window.loadNotices = async function () {
  const list = document.getElementById("noticeList");
  list.innerHTML = "";
  const snap = await getDocs(query(collection(db, "notices"), orderBy("created", "desc")));
  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d.data().text;
    list.appendChild(li);
  });
};

// 공지 전체 삭제
window.deleteAllNotices = async function () {
  if (!confirm("정말 삭제할까요?")) return;
  const snap = await getDocs(collection(db, "notices"));
  snap.forEach(d => deleteDoc(doc(db, "notices", d.id)));
  loadNotices();
};

// 사진 업로드
window.uploadImage = async function () {
  const file = document.getElementById("imgInput").files[0];
  if (!file) return alert("파일을 선택하세요!");

  try {
    const storageRef = ref(storage, 'gallery/' + Date.now() + '_' + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "gallery"), { url, created: Date.now() });
    alert("업로드 성공!");
    loadGallery();
  } catch (e) {
    console.error("업로드 실패:", e);
    alert("업로드 실패! 콘솔 확인");
  }
};

// 사진 불러오기
window.loadGallery = async function () {
  const box = document.getElementById("galleryBox");
  box.innerHTML = "";
  const snap = await getDocs(query(collection(db, "gallery"), orderBy("created", "desc")));
  snap.forEach(d => {
    const img = document.createElement("img");
    img.src = d.data().url;
    box.appendChild(img);
  });
};

// 초기 로드
loadNotices();
loadGallery();