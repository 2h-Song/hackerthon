import React, { useEffect, useState } from "react";

import "../css/main.css";

export default function Map() {
  const [map, setMap] = useState(null);

  const displayMarkerAndInfo = (position, message) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const locPosition = new window.kakao.maps.LatLng(lat, lon);

    const marker = new window.kakao.maps.Marker({
      map: map,
      position: locPosition,
    });

    const iwContent = message;
    const iwRemoveable = true;

    const infowindow = new window.kakao.maps.InfoWindow({
      content: iwContent,
      removable: iwRemoveable,
    });

    infowindow.open(map, marker);
    map.setCenter(locPosition);
  };

  useEffect(() => {
    const mapScript = document.createElement('script');

    mapScript.async = true;
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=594faadaf48a7be30529e06eb286efd9&autoload=false`;

    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const mapOption = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
        };
        new window.kakao.maps.Map(mapContainer, mapOption);
      });
    };
    mapScript.addEventListener('load', onLoadKakaoMap);
  }, []);

  useEffect(() => {
    if (map) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const message = '<div style="padding:5px;">여기에 계신가요?!</div>';
            displayMarkerAndInfo(position, message);
          },
          () => {
            const locPosition = new window.kakao.maps.LatLng(33.450701, 126.570667);
            const message = "현재 위치를 사용할 수 없어요..";
            displayMarkerAndInfo(locPosition, message);
          }
        );
      }
    }
  }, [map]);

  return (
    <div id="map-container" className="w-full h-screen">
      <div id="map" className="w-full h-full"></div>
    </div>
  );
}