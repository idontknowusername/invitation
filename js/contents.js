// --- 1. 실시간 D-Day 카운터 ---
const weddingDate = new Date("2026-07-11T12:30:00");
const dDayElement = document.getElementById("dDayCounter");

function updateTimer() {
    const now = new Date();
    const diff = weddingDate - now;

    const days = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((Math.abs(diff) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((Math.abs(diff) % (1000 * 60)) / 1000);

    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");

    let prefix = diff > 0 ? "함께하기까지" : "함께한지";

    // 깔끔한 줄바꿈과 영문 폰트 스타일 적용을 위한 HTML 구성
    dDayElement.innerHTML = `
        <div class="timer-prefix">${prefix}</div>
        <div class="timer-numbers">
            <span class="num">${days}</span><span class="label">DAYS</span>
            <span class="colon">:</span>
            <span class="num">${h}</span><span class="label">HOUR</span>
            <span class="colon">:</span>
            <span class="num">${m}</span><span class="label">MIN</span>
            <span class="colon">:</span>
            <span class="num">${s}</span><span class="label">SEC</span>
        </div>
    `;
}
setInterval(updateTimer, 1000);
updateTimer();

// --- 2. 캘린더 생성 (2026년 7월 고정) ---
function generateCalendar() {
    const calendarArea = document.getElementById('calendar');
    if (!calendarArea) return;

    // 2026년 7월 1일은 수요일(3)
    const startDay = 3;
    const lastDate = 31;
    const weddingDay = 11;

    let html = '<table class="calendar-table">';
    html += '<thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead>';
    html += '<tbody><tr>';

    let day = 1;
    // 첫 주 공백 채우기
    for (let i = 0; i < startDay; i++) {
        html += '<td></td>';
    }

    // 날짜 채우기
    for (let i = startDay; i < 7; i++) {
        let content = day === weddingDay ? `<span class="wedding-day">${day}</span>` : day;
        html += `<td>${content}</td>`;
        day++;
    }
    html += '</tr>';

    while (day <= lastDate) {
        html += '<tr>';
        for (let i = 0; i < 7 && day <= lastDate; i++) {
            let content = day === weddingDay ? `<span class="wedding-day">${day}</span>` : day;
            html += `<td>${content}</td>`;
            day++;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    calendarArea.innerHTML = html;
}
generateCalendar();


// --- 3. 갤러리 생성 ---
const galleryGrid = document.getElementById('galleryGrid');
if (galleryGrid) {
    const imageUrls = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/500/500?random=${i}`);
    imageUrls.forEach(url => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.onclick = () => openLightbox(url);
        const img = document.createElement('img');
        img.src = url; img.loading = "lazy";
        div.appendChild(img);
        galleryGrid.appendChild(div);
    });
}

// --- 4. 모달 제어 ---
window.openModal = function (id) { document.getElementById(id).classList.add('active'); };
window.closeModal = function (id) { document.getElementById(id).classList.remove('active'); };
window.openLightbox = function (src) {
    document.getElementById('lightboxImg').src = src;
    document.getElementById('lightbox').classList.add('active');
};
window.closeLightbox = function () { document.getElementById('lightbox').classList.remove('active'); };


// --- 5. Entrance & Scroll Animation ---
document.addEventListener("DOMContentLoaded", () => {
    // Entrance
    const entrance = document.getElementById('entranceScreen');
    const content = document.getElementById('mainContent');
    let isOpened = false;

    const params = new URLSearchParams(window.location.search);
    if (params.has('visit')) {
        const acc = document.getElementById('accountArea');
        if (acc) acc.style.display = 'none';
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

    // Scroll Animation (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 한 번 나타나면 관찰 중지 (원하면 주석 처리)
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.scroll-animate');
    animateElements.forEach(el => observer.observe(el));
});