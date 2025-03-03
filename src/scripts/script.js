document.addEventListener('DOMContentLoaded', function() {
    fetch("../../public/components/header.html").then(response => response.text()).then(data => {
        document.getElementById("header-container").innerHTML = data;
    });
});