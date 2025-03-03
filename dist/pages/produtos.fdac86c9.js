document.addEventListener('DOMContentLoaded', function() {
    fetch("../components/header.html").then((response)=>response.text()).then((data)=>{
        document.getElementById("header-container").innerHTML = data;
    });
});

//# sourceMappingURL=produtos.fdac86c9.js.map
