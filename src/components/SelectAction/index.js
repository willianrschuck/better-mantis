import Button from "../Button";

const renderElement = (element, key, formId) => {
  switch (element.type) {
    case 'input':
      if (element.inputType === 'hidden') {
        return (<input key={ key } form={ formId } type={ element.inputType } name={ element.name }
                      placeholder={ element.placeholder } hidden
                      value={ element.value }/>);
      }

      return (<input key={ key } form={ formId } type={ element.inputType } name={ element.name } placeholder={ element.placeholder }
                    className="bg-stone-950 rounded-md border border-secondary text-opacity-70 text-white border-opacity-30 hover:border-opacity-70 hover:text-opacity-100"/>);
    case 'select':
      return (
        <select key={ key } form={ formId } name={ element.name } className="bg-stone-950 rounded-md border border-secondary text-opacity-70 text-white border-opacity-30 hover:border-opacity-70 hover:text-opacity-100">
          { element.options.map(option => (
            <option key={ option.value + option.label } value={ option.value }>{ option.label }</option>
          )) }
        </select>
      );
    default:
      return null;
  }
};

function FormAction({ id, elements, value, variant, buttonAtEnd, className, ...form }) {

  return (
    <div className={"inline-flex gap-x-1 " + className}>
      <form id={ id } { ...form } className="hidden"></form>
      {!buttonAtEnd && <Button type="submit" size="sm" variant={variant} form={ id }>{ value || "Enviar" }</Button>}
      { elements.map(element => renderElement(element, element.name, id)) }
      {buttonAtEnd && <Button type="submit" size="sm" variant={variant} form={ id }>{ value || "Enviar" }</Button>}
    </div>
  );
}

export default FormAction;