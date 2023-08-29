import React, { useEffect, useState } from "react";
import "../css/main.css";
import axios from 'axios';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:8080"); // 서버의 주소로 변경

export default function Map() {
  const [map, setMap] = useState(null);
  const [reports, setReports] = useState([]); // 받아온 데이터를 저장할 상태

  useEffect(() => {
    const mapScript = document.createElement("script");
    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=594faadaf48a7be30529e06eb286efd9&libraries=services,clusterer,drawing&autoload=false`;
    document.head.appendChild(mapScript);

    mapScript.addEventListener("load", () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const mapOption = {
          center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
          level: 2,
        };
        const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
        setMap(newMap);
        displayUserMarker(newMap);

        socket.on('reportUpdate', (newReport)=> {
          setReports(prevReports => [...prevReports, newReport]);
        })
      });
      return () => {
        socket.disconnect();
      }
    });
  }, []);

  const displayUserMarker = (map) => {
    if (map && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const userPosition = new window.kakao.maps.LatLng(lat, lon);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: userPosition,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: "현재 여기 계시나요?",
          });

          window.kakao.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
          });
         infowindow.open(map, marker);
          map.setCenter(userPosition);
        },
        (error) => {
          console.error("Error getting current position:", error);
          const defaultPosition = new window.kakao.maps.LatLng(37.566826, 126.9786567);
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: defaultPosition,
          });

          const infowindow = new window.kakao.maps.InfoWindow({
            content: "현재 위치를 사용할 수 없어요..",
          });

          infowindow.open(map, marker);
          map.setCenter(defaultPosition);
        }
      );
    }
  };

  const displayMarker = (place) => {
    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      map: map,
      position: new window.kakao.maps.LatLng(place.y, place.x)
    });
  
    // 인포윈도우 생성
    const infowindow = new window.kakao.maps.InfoWindow({
      zIndex: 1,
      content: '<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>'
    });
  
    // 인포윈도우 상태 추적
    let infowindowVisible = false;
  
    // 마커에 클릭 이벤트 리스너 설정
    window.kakao.maps.event.addListener(marker, 'click', function () {
      if (infowindowVisible) {
        infowindow.close();
        infowindowVisible = false;
      } else {
        infowindow.open(map, marker);
        infowindowVisible = true;
      }
    });
  };

  const handleSearchPoliceStations = () => {
    if (map) {
      const currentLevel = map.getLevel(); // 현재 지도 레벨 얻기
      const currentCenter = map.getCenter(); // 현재 지도 중심 좌표 얻기
  
      const ps = new window.kakao.maps.services.Places();
  
      // 주변 경찰서를 검색하고 검색 완료 후 호출되는 콜백함수
      ps.keywordSearch('지구대', (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
  
          // 검색된 경찰서 위치를 기준으로 마커 표시 및 지도 범위 재설정
          for (let i = 0; i < data.length; i++) {
            const place = data[i];
            const placeLatLng = new window.kakao.maps.LatLng(place.y, place.x);
  
            // 현재 지도 범위 내에서만 마커 표시 및 지도 범위 설정
            if (map.getBounds()) {
              displayMarker(place);
              bounds.extend(placeLatLng);
            }
          }
  
          // 검색된 경찰서 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
        }
      });
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8080/get-reports')
      .then((res) => {
        setReports(res.data);
        console.log(JSON.stringify(res));
      })
      .catch((e) => console.log(e));
  }, []); // 컴포넌트가 마운트 될 때 한 번만 실행되도록 설정

  return (
    <div className="relative flex">
      <div id="map-container" className="w-3/4 h-screen z-10">
        <button onClick={handleSearchPoliceStations}>주위 경찰서</button>
        <div id="map" className="w-full h-full"></div>
      </div>
      <div className="w-1/4 p-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <div>실시간 사건 신고 위치</div>
          <ul>
            {reports.map((report, index) => (
              <li key={index}>
                위도: {report.latitude}, 경도: {report.longitude}, 사건 내용: {report.reportText}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
