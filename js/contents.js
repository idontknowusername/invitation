// --- 0. 환경설정 데이터 로드 ---
function loadConfigData() {
    // env.js가 로드되지 않았을 경우를 대비한 기본값 설정 (혹은 빈 문자열)
    const groomName = window.LOCAL_GROOM_NAME || "홍길동";
    const brideName = window.LOCAL_BRIDE_NAME || "홍길순";
    const groomNameEn = window.LOCAL_GROOM_NAME_EN || "John Doe";
    const brideNameEn = window.LOCAL_BRIDE_NAME_EN || "Jane Doe";
	const groomAccount = window.LOCAL_GROOM_ACC || "국민 123-456";
	const brideAccount = window.LOCAL_BRIDE_ACC || "국민 789-012";
	
	const groomDadName = window.LOCAL_GROOM_DAD_NAME || "김철수";
    const groomMomName = window.LOCAL_GROOM_MOM_NAME || "김영희";
	const groomDadAccount = window.LOCAL_GROOM_DAD_ACC || "IM뱅크 000-000";
	const groomMomAccount = window.LOCAL_GROOM_MOM_ACC || "IBK기업은행 000-000";
	const brideDadName = window.LOCAL_BRIDE_DAD_NAME || "이몽룡";
    const brideMomName = window.LOCAL_BRIDE_MOM_NAME || "성춘향";
	const brideDadAccount = window.LOCAL_BRIDE_DAD_ACC || "농협 000-000";
	const brideMomAccount = window.LOCAL_BRIDE_MOM_ACC || "뱅크오브아메리카 000-000";

    // 1. 텍스트 콘텐츠 교체
    document.querySelectorAll('.groom-name').forEach(el => el.textContent = groomName);
    document.querySelectorAll('.bride-name').forEach(el => el.textContent = brideName);
    document.querySelectorAll('.groom-name-en').forEach(el => el.textContent = groomNameEn);
    document.querySelectorAll('.bride-name-en').forEach(el => el.textContent = brideNameEn);
	document.querySelectorAll('.groom-account').forEach(el => el.textContent = groomAccount);
	document.querySelectorAll('.bride-account').forEach(el => el.textContent = brideAccount);
	
	document.querySelectorAll('.groom-dad-name').forEach(el => el.textContent = groomDadName);
    document.querySelectorAll('.groom-mom-name').forEach(el => el.textContent = groomMomName);
	document.querySelectorAll('.groom-dad-account').forEach(el => el.textContent = groomDadAccount);
	document.querySelectorAll('.groom-mom-account').forEach(el => el.textContent = groomMomAccount);
	document.querySelectorAll('.bride-dad-name').forEach(el => el.textContent = brideDadName);
    document.querySelectorAll('.bride-mom-name').forEach(el => el.textContent = brideMomName);
	document.querySelectorAll('.bride-dad-account').forEach(el => el.textContent = brideDadAccount);
	document.querySelectorAll('.bride-mom-account').forEach(el => el.textContent = brideMomAccount);

    // 2. 메타 태그 및 타이틀 교체 (SEO에는 반영되지 않을 수 있음)
    document.title = `${groomName}💖${brideName} 결혼합니다.`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = `${groomName}💖${brideName}, 결혼합니다.`;
}

// DOM 로드 시 즉시 실행 (contents.js는 body 끝에 있으므로 즉시 실행해도 됨)
loadConfigData();

// --- 0. 화면 파티클 ---
function initGreenLeaves() {
    var canvas = document.getElementById('particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var PARTICLE_COUNT = 10;
    var particles = [];

    // 여름 나뭇잎 색상 배열로 교체
    var tints = [
        { base: 'rgb(85, 170, 85)', tip1: 'rgb(120, 200, 100)', tip2: 'rgba(120, 200, 100, 0.7)', vein: 'rgba(50, 120, 50, 0.4)' },
        { base: 'rgb(60, 150, 60)', tip1: 'rgb(100, 180, 80)',  tip2: 'rgba(100, 180, 80, 0.7)',  vein: 'rgba(40, 100, 40, 0.4)' },
        { base: 'rgb(110, 190, 70)', tip1: 'rgb(150, 220, 90)', tip2: 'rgba(150, 220, 90, 0.7)', vein: 'rgba(70, 140, 40, 0.4)' }
    ];

    function resetParticle(p, isInitial) {
        p.x = Math.random() * canvas.width;
        p.y = isInitial ? Math.random() * canvas.height : -10 - Math.random() * 20;
        p.size = 10 + Math.random() * 12;
        p.speedY = 1.0 + Math.random() * 1.2; // 벚꽃보다 낙하 속도 증가
        p.speedX = -0.5 + Math.random() * 1.0;
        p.angle = Math.random() * Math.PI * 2;
        p.angleSpeed = 0.01 + Math.random() * 0.04; // 회전 속도 증가
        p.flipAngle = Math.random() * Math.PI * 2;
        p.flipSpeed = 0.04 + Math.random() * 0.06; // 펄럭임 속도 증가
        p.swingAmp = 30 + Math.random() * 50;
        p.swingSpeed = 0.008 + Math.random() * 0.015;
        p.swingOffset = Math.random() * Math.PI * 2;
        p.opacity = 0.7 + Math.random() * 0.3; // 투명도를 낮춤(더 선명하게)
        p.tint = Math.floor(Math.random() * 3);
        return p;
    }

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(resetParticle({}, true));
    }

    function drawParticle(p) {
        ctx.save();
        var swingX = Math.sin(p.swingOffset) * p.swingAmp * 0.3;
        ctx.translate(p.x + swingX, p.y);
        ctx.rotate(p.angle);

        var flipScale = Math.cos(p.flipAngle);
        ctx.scale(flipScale, 1);
        ctx.globalAlpha = p.opacity;

        var s = p.size;
        var t = tints[p.tint];

        // 기존 벚꽃잎 모양 유지 (나뭇잎으로도 자연스럽게 보임)
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * 0.45, -s * 0.25, s * 0.5, -s * 0.6, s * 0.2, -s * 0.9);
        ctx.quadraticCurveTo(s * 0.08, -s * 0.82, 0, -s * 0.85);
        ctx.quadraticCurveTo(-s * 0.08, -s * 0.82, -s * 0.2, -s * 0.9);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.6, -s * 0.45, -s * 0.25, 0, 0);
        ctx.closePath();

        var grad = ctx.createLinearGradient(0, 0, 0, -s);
        grad.addColorStop(0, t.base);
        grad.addColorStop(0.6, t.tip1);
        grad.addColorStop(1, t.tip2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -s * 0.1);
        ctx.quadraticCurveTo(s * 0.02, -s * 0.55, 0, -s * 0.85);
        ctx.strokeStyle = t.vein;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += p.angleSpeed;
            p.flipAngle += p.flipSpeed;
            p.swingOffset += p.swingSpeed;

            if (p.y > canvas.height + 20 || p.x < -50 || p.x > canvas.width + 50) {
                resetParticle(p, false); 
            }

            drawParticle(p);
        }
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}
initGreenLeaves();	// 파티클 init

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
    if (params.has('은행')) {
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
    // 3초 후 애니메이션 자동 재생
    setTimeout(triggerOpening, 3000);

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