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

function formToObject(formElement) {
  const elements = Array.from(formElement.elements);
  return {
    action: formElement.action,
    method: formElement.method,
    elements: elements.map(element => {
      const { tagName, type, name, value } = element;

      if (!name) return null;

      const baseElement = { name, value };

      if (tagName.toLowerCase() === 'input') {
        Object.assign(baseElement, {
          type: 'input',
          inputType: type,
        });

        if (type === 'hidden') {
          return baseElement;
        }

        if (element.placeholder) {
          baseElement.placeholder = element.placeholder;
        }

        return baseElement;
      } else if (tagName.toLowerCase() === 'select') {
        const options = Array.from(element.options).map(option => ({
          value: option.value,
          label: option.text
        }));

        return {
          type: 'select',
          name,
          options
        };
      }

      return null;
    }).filter(element => element !== null)
  }
}

export {
  post, formToObject
}