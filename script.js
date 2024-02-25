// document.getElementById("loadNotice").addEventListener("click", function () {
//   fetch("http://localhost:4005/api/notices")
//     .then((response) => response.json())
//     .then((data) => {
//       const noticeList = document.getElementById("noticeList");
//       noticeList.innerHTML = ""; // 목록 초기화
//       data.forEach((notices) => {
//         const li = document.createElement("li");
//         li.textContent = `제목: ${notices.title}, 등록일: ${notices.date_posted}`;
//         noticeList.appendChild(li);
//       });
//     })
//     .catch((error) => console.error("Error:", error));
// });
