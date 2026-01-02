/* =============================
   Firebase 설정 (네 값으로 교체)
============================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "네_API_KEY",
  authDomain: "네_AUTH_DOMAIN",
  projectId: "네_PROJECT_ID",
  storageBucket: "네_STORAGE_BUCKET",
  messagingSenderId: "네_SENDER_ID",
  appId: "네_APP_ID"
};

/* =============================
   Firebase 초기화
============================= */
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* =============================
   관리자 비밀번호
============================= */
const ADMIN_PASSWORD = "yanogbu123";

/* =============================
   관리자 로그인 (⭐ 핵심)
============================= */
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
  document.getElementById("adminArea")?.classList.remove("hidden");
  document.getElementById("adminGallery")?.classList.remove("hidden");
}

/* =============================
   공지 추가
============================= */
window.addNotice = async function () {
  alert("addNotice 실행됨"); // 테스트용

  const input = document.getElementById("noticeInput");
  if (!input.value) {
    alert("입력값 없음");
    return;
  }

  await addDoc(collection(db, "notices"), {
    text: input.value,
    created: Date.now()
  });

  alert("Firestore에 저장 시도 끝");
};
/* =============================
   공지 불러오기
============================= */
async function loadNotices() {
  const list = document.getElementById("noticeList");
  list.innerHTML = "";

  const snapshot = await getDocs(collection(db, "notices"));
  snapshot.forEach(docu => {
    const li = document.createElement("li");
    li.textContent = docu.data().text;
    list.appendChild(li);
  });
}

/* =============================
   공지 전체 삭제 (관리자만)
============================= */
window.deleteAllNotices = async function () {
  if (!confirm("공지 전부 삭제할까요?")) return;

  const snapshot = await getDocs(collection(db, "notices"));
  snapshot.forEach(async d => {
    await deleteDoc(doc(db, "notices", d.id));
  });

  loadNotices();
};

/* =============================
   페이지 로드 시
============================= */
window.onload = () => {
  loadNotices();
  if (localStorage.getItem("admin") === "true") {
    enableAdmin();
  }
};

/* =============================
   섹션 전환 (공지 / 사진)
============================= */
window.show = function (id) {
  document.getElementById("notice").classList.add("hidden");
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
};