import ReactDOM from "react-dom";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";

import "../css/main.css";

export default function Header() {
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isInquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [reportText, setReportText] = useState("");
  const [reports, setReports] = useState([]); // 받아온 데이터를 저장할 상태


  const openReportModal = () => {
    // 신고 및 제보하기
    setReportModalOpen(true);
  };

  const openInquiryModal = () => {
    // 문의하기
    setInquiryModalOpen(true);
  };

  const closeModal = () => {
    setReportModalOpen(false);
    setInquiryModalOpen(false);
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting current position:", error);
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };
  


  const handleComplete = async () => {
    try {
      const position = await getCurrentPosition(); // 사용자의 현재 위치를 얻는 함수 (아래에 구현)
      console.log(position);
      const response = await fetch("http://localhost:8080/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportText, latitude: position.latitude, longitude: position.longitude }),
      });
  
      if (response.ok) {
        console.log("Report submitted successfully");
        closeModal(); // 모달 닫기 등의 동작
      } else {
        console.error("Error submitting report");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  

  return (
    <div>
      <header>
        <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" className="flex items-center">
              {/* <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> */}
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Safety Hawkeye
              </span>
            </a>
            <div className="flex items-center lg:order-2">
              <button
                onClick={openReportModal}
                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                신고 및 제보하기
              </button>
            </div>
            <div
              className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
              id="mobile-menu-2"
            >
              <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    지도
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    관리자
                  </a>
                </li>
                <li>
                  <button
                    onClick={openInquiryModal}
                    className="z-10 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    문의하기
                  </button>
                  {isInquiryModalOpen && (
                    <div className="modal fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75 overflow-y-auto z-50">
                      <div className="modal-content bg-white w-1/2 p-6 rounded-lg">
                        <a>Email : abc@gmail.com</a>
                        <br />
                        <a>유선 연락처 : 010-1234-5678</a>
                        <button
                          onClick={closeModal}
                          className="block mx-auto mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                        >
                          닫기
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {isReportModalOpen && (
        <div className="modal fixed inset-0 flex justify-center items-center bg-gray-700 bg-opacity-75 overflow-y-auto z-50">
          <div className="modal-content bg-white w-11/12 md:w-1/2 lg:w-1/3 p-6 rounded-lg overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">긴급 상황 신고하기</h2>
            <p>긴급 상황엔 제출만 눌러도 됩니다</p>
            <a className="text-red-500">
              허위 신고의 경우 제재나 법적 처벌이 이루어질 수 있습니다.
            </a>
            {/* {selectedOption === 'yes' && ( */}
            <div className="mt-4">
              <textarea
                rows="4"
                className="w-full p-2 border rounded-md mb-4"
                placeholder="신고할 내용을 입력하세요"
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
              ></textarea>
              <div className="flex flex-col md:flex-row md:justify-between">
                <button
                  onClick={handleComplete}
                  className="block md:w-1/4 mx-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md mb-2 md:mb-0"
                >
                  제출
                </button>
                <button
                  onClick={closeModal}
                  className="block md:w-1/4 mx-auto px-4 py-2 bg-blue-300 hover:bg-blue-500 text-white rounded-md"
                >
                  닫기
                </button>
              </div>
            </div>
            {/* // )} */}
          </div>
        </div>
      )}
    </div>
  );
}
