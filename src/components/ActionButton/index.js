import Button from "../Button";
import { post } from "../../service/utils";

const ActionButton = ({ action, parameters, value, ...props }) => {
  const submit = () => {
    post(action, parameters);
  }
  return (
    <Button onClick={ () => submit() } { ...props }>{ value }</Button>
  );
}

export default ActionButton;