var container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
var options = { //지도를 생성할 때 필요한 기본 옵션
	center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
	level: 3 //지도의 레벨(확대, 축소 정도)
};

var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
var ps = new kakao.maps.services.Places(); // 지도 검색 기능
//마스크 데이터 api 주소
let base_mask_url = "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?";

// 버튼 누르거나 enter 눌렀을 때 검색이 되도록 만들기
let search_btn = document.querySelector(".search-btn");
let search_bar = document.querySelector("#search-bar");
console.log(search_bar);
console.log(search_btn);

search_btn.addEventListener("click", () => {
    let keyword = search_bar.value;
    if(keyword) {
        console.log(keyword + " 검색하셨습니다.");
        keywordSearch(keyword);
    } else {
        alert("검색어를 입력해주세요.");
    }
});

search_bar.addEventListener("keyup", () => {
     //keycode 13 = Enter key
     if(event.keyCode === 13) {
         search_btn.click();
     }
})

function keywordSearch(keyword) {
    ps.keywordSearch(keyword, keywordSearchCallback);
}

async function keywordSearchCallback (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        const center = new kakao.maps.LatLng(data[0].y, data[0].x);
        map.setCenter(center);
        const maskData = await getMaskData(data[0].y, data[0].x);

        // 마커를 그리는 부분
        for(const data of maskData) {
            drawMarker(data);
        }
    } 
}

async function getMaskData(Lat, Lng) {
    let request_url = '${base_mask_url}lat=${Lat}&lng=${Lng}';
    let response = await fetch(request_url);
    let result = await response.json();
    console.log(result.stores);
    return result.Lating
}

// 지도에 마커를 표시하는 함수입니다
function drawMarker(maskData) {
    let image = {
        green: "./green.png",
        yellow: "./yellow,png",
        grey: "./red.png",
        red: "./grey.png",
    }

    let imageSize = new kakao.maps.Size(32, 32);
    let imageOption = { offset : new kakao.maps.Point(10,15)};

    // 마커 정보를 담은 맠 ㅓ이미지를 생성
    let marker image = new kakao.maps.MakerImage(image.green, imageSize, imageOption);

    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(maskData.lat, maskData.lng) 
        image: markerImage,
    });
}