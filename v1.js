(function(){
    const d = document;
    const s = d.createElement("iframe");

    s.src = "./index.html";
    s.frameborder = 0;
    s.style = "position: fixed; top: 0px; left: 0px; z-index: 2147483647; border: none; opacity: 1; width: 100%; height: 100%;";
    s.name = "Fidia Widget";
    d.getElementsByTagName("body")[0].appendChild(s);
})()