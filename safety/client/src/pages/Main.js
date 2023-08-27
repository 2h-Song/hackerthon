import React, { useEffect } from "react";

export default function MapComponent() {
  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_API_KEY}`;
      script.onload = () => {
        // API 로드 완료 후 실행할 코드
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        new window.kakao.maps.Map(container, options);
      };
      document.head.appendChild(script);
    };

    loadMapScript();
  }, []);

  return <div id="map" style={{ width: "500px", height: "400px" }}></div>;
}
