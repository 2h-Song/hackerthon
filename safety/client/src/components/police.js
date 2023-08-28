import React, { useEffect, useState } from "react";
import Map from "./map"; // Map 컴포넌트 경로

export default function Police() {
  const [policeStations, setPoliceStations] = useState([]);

  useEffect(() => {
    // 경찰서 위치 정보를 가져오는 API 호출
    fetch(
      "http://api.odcloud.kr/api/15054711/v1/uddi:9097ad1f-3471-42c6-a390-d85b5121816a?page=1&perPage=10"
    )
      .then((response) => response.json())
      .then((data) => {
        // 경찰서 위치 정보를 가져와서 state에 저장
        setPoliceStations(data);
      })
      .catch((error) => {
        console.error("오류:", error);
      });
  }, []);

  return (
    <div>
      <h1>경찰서 위치</h1>
      {/* Map 컴포넌트에 경찰서 위치 정보를 전달 */}
      <Map policeStations={policeStations} />
    </div>
  );
}

//   const fetchPoliceStations = async () => {
//     try {
//       const response = await fetch("http://localhost:8080/api/police-stations");
//       const data = await response.json();
  
//       // 경찰서 정보를 사용하여 마커 표시
//       if (map && data && data.data) {
//         data.data.forEach(policeStation => {
//           const markerPosition = new window.kakao.maps.LatLng(
//             parseFloat(policeStation.위도), // 위도 필드에 맞게 수정
//             parseFloat(policeStation.경도) // 경도 필드에 맞게 수정
//           );
  
//           const marker = new window.kakao.maps.Marker({
//             map: map,
//             position: markerPosition,
//           });
  
//           const infowindowContent = `<div>${policeStation.경찰서}</div>`; // 경찰서 이름을 표시하도록 수정
  
//           const infowindow = new window.kakao.maps.InfoWindow({
//             content: infowindowContent,
//           });
  
//           window.kakao.maps.event.addListener(marker, "click", () => {
//             infowindow.open(map, marker);
//           });
//         });
//       }
//     } catch (error) {
//       console.error("Error fetching police stations:", error);
//     }
//   };