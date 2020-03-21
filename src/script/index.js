(function() {
  var curWidth = 32;
  var curLeft = 0;
  var ul = document.querySelector("ul");
  var li = ul.children;
  li[0].firstChild.className = "highlight";
  var move = document.getElementsByClassName("move")[0];
  ul.addEventListener("mousemove", function(e) {
    if (e.target.nodeName == "A") {
      move.style.width = e.target.offsetWidth + "px";
      move.style.left = e.target.offsetLeft + "px";
    }
  });
  ul.addEventListener("mouseleave", function() {
    move.style.width = curWidth + "px";
    move.style.left = curLeft + "px";
  });
  ul.addEventListener("click", function(e) {
    if (e.target.nodeName == "A") {
      curWidth = e.target.offsetWidth;
      curLeft = e.target.offsetLeft;
      for (var i = 0; i < li.length - 1; i++) {
        var a = li[i].querySelector("a");
        a.className = "";
      }
      e.target.className = "highlight";
    }
  });
})();
