function post(path, params, method='post') {

  const form = document.createElement('form');
  form.method = method;
  form.action = path;
  form.enctype = 'multipart/form-data'
  form.style.display = 'none';

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const hiddenField = document.createElement('input');
      const value = params[key];

      hiddenField.name = key;

      if (value instanceof FileList) {
        hiddenField.type = 'file';
        hiddenField.files = value;
      } else {
        hiddenField.type = 'hidden';
        hiddenField.value = value;
      }

      form.appendChild(hiddenField);
    }
  }

  document.body.appendChild(form);
  form.submit();
}

export {
  post
}