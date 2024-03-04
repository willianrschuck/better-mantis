import Button from "../Button";

const renderElement = (element, formId) => {
  switch (element.type) {
    case 'input':
      return <input form={ formId } type={ element.inputType } name={ element.name } placeholder={ element.placeholder }
                    value={ element.value }/>;
    case 'select':
      return (
        <select form={ formId } name={ element.name } className="bg-stone-950 rounded-md border border-secondary text-opacity-70 text-white border-opacity-30 hover:border-opacity-70 hover:text-opacity-100">
          { element.options.map(option => (
            <option value={ option.value }>{ option.label }</option>
          )) }
        </select>
      );
    default:
      return null;
  }
};

function SelectAction({ elements, value, variant, ...form }) {

  return (
    <div className="inline-flex gap-x-1">
      <form id={ form.action } { ...form } className="hidden"></form>
      <Button type="submit" size="sm" variant={variant} form={ form.action }>{ value || "Enviar" }</Button>
      { elements.map(element => renderElement(element, form.action)) }
    </div>
  );
}

export default SelectAction;