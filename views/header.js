// header.js
const headerContainer = document.getElementById("header");
const headerURL = "header.html";

fetch(headerURL)
    .then(response => response.text())
    .then(data => {
        headerContainer.innerHTML = data;
    });
