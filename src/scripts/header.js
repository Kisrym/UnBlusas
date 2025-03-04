document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.endsWith("index.html")) {
        fetch("../components/header.html").then(response => response.text()).then(data => {
            document.getElementById("header-container").innerHTML = data;
        });
    }
});