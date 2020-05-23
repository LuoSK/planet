function Wave(method = "get", path = "", data = null) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, path, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        resolve(xhr.responseText)
      }
      if (xhr.status >= 400) {
        reject(xhr.status);
      }
    };
    xhr.send(data);
  });
}
