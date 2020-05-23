function mdreader(path) {
  return new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText);
      }
    };
    xhr.send(null);
  });
}
