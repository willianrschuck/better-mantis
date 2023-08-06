import Button from "../Button";
import { post } from "../../service/utils";

const ActionButton = ({ action, parameters, value, className }) => {
  const submit = () => {
    console.log("params", parameters)
    post(action, parameters);
  }
  return (
    <Button value={ value } onClick={ () => submit() } className={ className } />
  );
}

export default ActionButton;