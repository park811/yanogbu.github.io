// 🔥 Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔑 Firebase 설정 (yanogbu 프로젝트)
const firebaseConfig = {
  apiKey: "AIzaSyDK7LdFb1ZzxjfLHbHWgD3TvIDBxESSp6M",
  authDomain: "yanogbu.firebaseapp.com",
  projectId: "yanogbu",
  storageBucket: "yanogbu.firebasestorage.app",
  messagingSenderId: "383928455310",
  appId: "1:383928455310:web:2f1890e588fdb67c8979df",
  measurementId: "G-C6X972MNHN"
};

// 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================
// 🔐 관리자 로그인
// =============================
window.adminLogin = function () {
  const pw = prompt("관리자 비밀번호를 입력하세요");
  if (pw === "1234") { // ← 필요하면 바꿔도 됨
    document.getElementById("adminArea").classList.remove("hidden");
    alert("관리자 로그인 성공");
  } else {
    alert("비밀번호 틀림");
  }
};

// =============================
// 📝 공지 추가
// =============================
window.addNotice = async function () {
  const input = document.getElementById("noticeInput");
  if (!input.value) return;

  await addDoc(collection(db, "notices"), {
    text: input.value,
    created: Date.now()
  });

  input.value = "";
  loadNotices();
};

// =============================
// 📋 공지 불러오기
// =============================
window.loadNotices = async function () {
  const list = document.getElementById("noticeList");
  list.innerHTML = "";

  const q = query(
    collection(db, "notices"),
    orderBy("created", "desc")
  );

  const snap = await getDocs(q);

  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d.data().text;
    list.appendChild(li);
  });
};

// =============================
// 🗑️ 공지 전체 삭제 (관리자용)
// =============================
window.deleteAllNotices = async function () {
  if (!confirm("정말 모든 공지를 삭제할까요?")) return;

  const snap = await getDocs(collection(db, "notices"));
  snap.forEach(d => deleteDoc(doc(db, "notices", d.id)));

  loadNotices();
};

// =============================
// 🚀 페이지 열리면 자동 실행
// =============================
loadNotices();