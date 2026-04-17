function initMusic() {
  var toggleBtn = document.getElementById('music-toggle');
  var icon = toggleBtn ? toggleBtn.querySelector('.music-icon') : null;

  // ★ 여기에 원하는 YouTube 영상 ID를 입력하세요
  var youtubeId = '54skB_t06xY'; 

  if (!youtubeId) return; // ID가 없으면 종료

  // 설정된 ID가 있으면 버튼을 화면에 표시
  if (toggleBtn) toggleBtn.style.display = 'flex';

  var ytPlayer = null;
  var ytReady = false;
  var isPlaying = false; // 현재 재생 상태

  // [UI 업데이트] 재생 상태에 따라 아이콘을 교체하는 함수
  function updateIcon() {
    if (!icon) return;
    if (isPlaying) {
      icon.style.display = 'inline';
    } /*else {
      icon.style.display = 'none';
    }*/
  }

  // [플레이어 생성] YouTube API 설정
  function createPlayer() {
    ytPlayer = new YT.Player('yt-player', {
      height: '0',
      width: '0',
      videoId: youtubeId,
      playerVars: {
        autoplay: 1,      // 제스처 우회를 위해 자동재생 옵션 켬
        loop: 1,          // 반복 재생
        playlist: youtubeId,
        controls: 0,
        disablekb: 1,
        playsinline: 1
      },
      events: {
        onReady: function (event) {
          ytReady = true;
          event.target.setVolume(50);
          tryPlay(); // 준비 완료 시 재생 시도
        },
        // ★ 중요: 플레이어의 실제 상태가 변할 때마다 호출됨 (상태 동기화)
        onStateChange: function (event) {
          // 1: 재생 중, 2: 일시정지, 0: 종료
          if (event.data === 1) {
            isPlaying = true;
          } else if (event.data === 2 || event.data === 0) {
            isPlaying = false;
          }
		  console.log("재생중? "+isPlaying);
          updateIcon(); // 상태 변경 후 UI 업데이트
        },
        onError: function () {
		  console.log('onError 발생!!');
          // 영상 삭제, 비공개 등으로 로드 실패 시 버튼 숨기기
          if (toggleBtn) toggleBtn.style.display = 'none';
        }
      }
    });
  }

  // [재생 시도] 에러 방지를 위한 래퍼 함수
  function tryPlay() {
    if (!ytReady || !ytPlayer) return;
    try {
      ytPlayer.playVideo();
    } catch (e) { /* ignore */ }
  }

  // [제스처 우회] 사용자의 첫 터치/스크롤 시 강제 재생
  function addUserGestureListeners(playFn) {
    var events = ['click', 'touchstart', 'scroll'];
    var triggered = false;

    function handler() {
      if (triggered) return;
      triggered = true; // 한 번만 실행되도록 락(Lock)
      playFn();
      
      // 실행 후 이벤트 리스너 해제 (자원 최적화)
      events.forEach(function (evt) {
        document.removeEventListener(evt, handler, true);
      });
    }

    events.forEach(function (evt) {
      document.addEventListener(evt, handler, { capture: true, passive: true, once: false });
    });
  }

  // 제스처 리스너 등록 (상호작용 발생 시 재생 시도)
  addUserGestureListeners(function () {
    if (ytPlayer && ytReady && !isPlaying) {
      tryPlay();
    }
  });

  // YouTube 스크립트가 로드되면 실행되는 전역 콜백
  window.onYouTubeIframeAPIReady = function () {
    createPlayer();
  };

  // [버튼 클릭 이벤트] 사용자가 직접 버튼을 눌렀을 때의 동작 (음소거 대신 재생/일시정지)
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (!ytPlayer || !ytReady) return;

      if (isPlaying) {
        ytPlayer.pauseVideo(); // 일시정지
      } else {
        ytPlayer.playVideo();  // 다시 재생
      }
      // 참고: 여기서 isPlaying을 직접 변경하지 않아도 onStateChange 이벤트가 발생하여 updateIcon이 호출됩니다.
    });
  }
}

// 스크립트 초기화
initMusic();