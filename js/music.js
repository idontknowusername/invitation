function initMusic() {
  var toggleBtn = document.getElementById('music-toggle');
  var youtubeId = 'GR6L_C0Ii6s'; 
  
  // 현재 환경이 로컬 파일(file://)인지 확인
  var isLocalFile = window.location.protocol === 'file:';

  if (!youtubeId && !isLocalFile) return;

  // 로컬 환경이거나 YouTube ID가 있으면 일단 버튼을 보여줌
  if (toggleBtn) {
    toggleBtn.style.display = 'flex';
  }

  var ytPlayer = null;
  var ytReady = false;
  var isPlaying = false;

  function createPlayer() {
    // 로컬 환경에서는 YouTube API가 정상 작동하지 않을 수 있으므로 생성 스킵 가능
    if (isLocalFile) return; 

    ytPlayer = new YT.Player('yt-player', {
      height: '0',
      width: '0',
      videoId: youtubeId,
      playerVars: {
        autoplay: 1,
		mute: 1,
        loop: 1,
        playlist: youtubeId,
        controls: 0,
        disablekb: 1,
        playsinline: 1
      },
      events: {
        onReady: function (event) {
          ytReady = true;
          event.target.setVolume(50);
          tryPlay();
        },
        onStateChange: function (event) {
          if (event.data === 1) {
            isPlaying = true;
          } else if (event.data === 2 || event.data === 0) {
            isPlaying = false;
          }
        },
        onError: function () {
          // 로컬이 아닐 때만 에러 시 버튼 숨김
          if (!isLocalFile && toggleBtn) toggleBtn.style.display = 'none';
        }
      }
    });
  }

  function tryPlay() {
    if (!ytReady || !ytPlayer || isLocalFile) return;
    try {
      ytPlayer.playVideo();
    } catch (e) { /* ignore */ }
  }

  function addUserGestureListeners(playFn) {
    // 수정됨: scroll 제외. 브라우저가 오디오 재생을 허락하는 명시적 제스처만 포함.
	var events = ['click', 'touchstart', 'scroll'];
    //var events = ['click', 'touchend', 'keydown'];
    var triggered = false;

    function handler(e) {
      if (triggered) return;
      triggered = true;
      playFn();
      
      // 한 번 실행된 후에는 모든 전역 리스너 해제
      events.forEach(function (evt) {
        document.removeEventListener(evt, handler, { capture: true });
      });
    }

    events.forEach(function (evt) {
      // passive: true는 스크롤 성능을 위한 것이므로 click/keydown 등에는 굳이 필요하지 않습니다.
      document.addEventListener(evt, handler, { capture: true, once: false });
    });
  }

  addUserGestureListeners(function () {
    if (!isLocalFile && ytPlayer && ytReady && !isPlaying) {
	  ytPlayer.unMute()
      tryPlay();
    }
  });

  window.onYouTubeIframeAPIReady = function () {
    createPlayer();
  };

  // [버튼 클릭 이벤트] 로컬 환경 예외처리 포함
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      // 1. 로컬 환경일 때: API 상관없이 클래스만 토글 (디자인 확인용)
      if (isLocalFile) {
        isPlaying = !isPlaying; // 로컬용 가상 상태 스위칭
        toggleBtn.classList.toggle('stopped');
        console.log("로컬 환경: 버튼 클래스 제어만 동작합니다.");
        return; 
      }

      // 2. 서버 환경일 때: 실제 플레이어 제어
      if (!ytPlayer || !ytReady) return;

      if (isPlaying) {
        ytPlayer.pauseVideo();
        toggleBtn.classList.add('stopped');
      } else {
        ytPlayer.playVideo();
        toggleBtn.classList.remove('stopped');
      }
    });
  }
}

initMusic();