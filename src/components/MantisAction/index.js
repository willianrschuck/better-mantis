const MantisAction = ({ id, action, properties, className, children }) => {
  return (
    <button id={ "btn_" + id } className={ className } type="submit" form={ id }>
      <form id={ id } action={ action } method="post">
        { Object.entries(properties).map(([ k, v ]) =>
          <input type="hidden" key={ k } name={ k } value={ v }/>
        ) }
      </form>
      { children }
    </button>
  );
}

export default MantisAction;