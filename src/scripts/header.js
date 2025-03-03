document.addEventListener("DOMContentLoaded", function () {
    const headerElement = document.querySelector("header");

    if (headerElement) {
        fetch("header.html",)
            .then(response => response.text())
            .then(data => {
                headerElement.innerHTML = data;
            })
            .catch(error => console.error("Erro ao carregar o header:", error));
    } else {
        console.error("Elemento <header> não encontrado no HTML.");
    }
});