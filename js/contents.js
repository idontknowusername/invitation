// --- 1. 실시간 D-Day 카운터 (초단위) ---
// 기준일: 2026년 7월 11일 12시 30분
const weddingDate = new Date("2026-07-11T12:30:00");
const dDayElement = document.getElementById("dDayCounter");
const dDayLabel = document.querySelector(".d-day-label");

function updateTimer() {
    const now = new Date();
    const diff = weddingDate - now;

    // 시간 계산
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // 2자리 숫자 포맷팅 (01, 02...)
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    if (diff > 0) {
        // 결혼식 전
        dDayElement.innerText = `${days}일 ${h}:${m}:${s}`;
    } else {
        // 결혼식 후
        const pastDays = Math.abs(days);
        dDayLabel.innerText = "함께한지";
        dDayElement.innerText = `${pastDays}일 ${h}:${m}:${s}`;
    }
}

// 1초마다 실행
setInterval(updateTimer, 1000);
updateTimer(); // 로드 시 즉시 실행

// --- 2. 갤러리 생성 ---
const galleryGrid = document.getElementById('galleryGrid');
const imageUrls = Array.from({length: 12}, (_, i) => `https://picsum.photos/500/500?random=${i}`);
imageUrls.forEach(url => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.onclick = () => openLightbox(url);
    const img = document.createElement('img');
    img.src = url; img.loading = "lazy";
    div.appendChild(img);
    galleryGrid.appendChild(div);
});

// --- 3. 모달 제어 ---
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function openLightbox(src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }

// --- 4. Entrance 애니메이션 ---
document.addEventListener("DOMContentLoaded", () => {
    const entrance = document.getElementById('entranceScreen');
    const content = document.getElementById('mainContent');
    let isOpened = false;
    
    // URL에 visit 파라미터 체크 (계좌 숨김)
    const params = new URLSearchParams(window.location.search);
    if (params.has('visit')) {
        const acc = document.getElementById('accountArea');
        if(acc) acc.style.display = 'none';
    }

    const triggerOpening = () => {
        if (isOpened) return;
        isOpened = true;
        entrance.classList.add('open');
        content.style.opacity = '1';
        setTimeout(() => {
            entrance.style.display = 'none';
            content.style.overflowY = 'auto'; 
        }, 1500);
    };

    window.addEventListener('wheel', (e) => { if (e.deltaY > 0 && !isOpened) triggerOpening(); });
    let ts = 0;
    window.addEventListener('touchstart', (e) => ts = e.touches[0].clientY);
    window.addEventListener('touchmove', (e) => {
        if (!isOpened && ts - e.touches[0].clientY > 50) triggerOpening();
    }, { passive: true });
});