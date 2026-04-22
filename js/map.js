// const NAVER_MAP_CLIENT_ID = "YOUR_CLIENT_ID";
let NAVER_MAP_CLIENT_ID = "YOUR_CLIENT_ID_HERE";

// 로컬 환경인지 확인 (window.LOCAL_NAVER_KEY가 존재하는지 체크)
if (typeof window.LOCAL_MAP_API_KEY !== 'undefined') {
    // 로컬 파일(apikey.js)이 있다면 그 값을 사용
    NAVER_MAP_CLIENT_ID = window.LOCAL_MAP_API_KEY;
    console.log("ENV: 로컬 개발 환경");
} else {
    console.log("ENV: 배포 환경");
}

// 1. 스크립트 태그 생성
const scriptMap = document.createElement("script");

// 2. src 속성에 백틱 변수 넣기
scriptMap.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`;
scriptMap.async = true; // 비동기 로딩 설정
scriptMap.defer = true; // defer 설정 (선택사항)

// 3. HTML(head 또는 body)에 붙이기
document.head.appendChild(scriptMap);

// 4. 로딩 완료 후 지도 실행
scriptMap.onload = () => {
    var mapOptions = {
		center: new naver.maps.LatLng(37.562495, 126.979730),
		zoom: 15,
		maxZoom: 15,
		minZoom: 15,
		logoControl: false,
		mapDataControl: false,
		scaleControl: false,
		draggable: false,
		pinchZoom: false,
		scrollWheel: false
	};

	var map = new naver.maps.Map(document.getElementById('map'), mapOptions);

	var marker = new naver.maps.Marker({
		position: new naver.maps.LatLng(37.562495, 126.979730),
		map: map,
		icon: {
			url: './img/marker01.png',
			size: new naver.maps.Size(48, 48),
			origin: new naver.maps.Point(0, 0),
			anchor: new naver.maps.Point(24, 32),
		},
		animation: naver.maps.Animation.BOUNCE
	});
		
	// 5. Floating 텍스트 추가
	var contentString = [
		'<div class="iw_inner">',
		'   <h4>한국은행</h4>',
		'   <h5>방문자센터</h5>',
		'</div>'
	].join('');
	
	var infowindow = new naver.maps.InfoWindow({
		content: contentString,
		maxWidth: 240,
		backgroundColor: "#ffffff00",
		borderColor: "#ffffff00",
		borderWidth: 1,
		//anchorSize: new naver.maps.Size(30, 30),
		anchorColor: "#ffffff00",
		pixelOffset: new naver.maps.Point(0, 115)
	});

	naver.maps.Event.addListener(marker, "click", function(e) {
		if (infowindow.getMap()) {
			infowindow.close();
		} else {
			infowindow.open(map, marker);
		}
	});
	infowindow.open(map, marker);
};

