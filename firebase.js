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

// 🔑 Firebase 설정 (⚠️ 네 프로젝트 값으로 교체)
const firebaseConfig = {
  apiKey: "여기에_apiKey",
  authDomain: "여기에_authDomain",
  projectId: "여기에_projectId",
  storageBucket: "여기에_storageBucket",
  messagingSenderId: "여기에_messagingSenderId",
  appId: "여기에_appId"
};

// 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =============================
// 🔐 관리자 로그인
// =============================
window.adminLogin = function () {
  const pw = prompt("관리자 비밀번호를 입력하세요");
  if (pw === "1234") { // ← 여기 비밀번호 바꿔도 됨
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