import { Mantis } from "../../service/task.service";

export function TaskDescription() {
  return (
    <div>
      <h1 className="text-xl my-5 px-3 select-all">
        { Mantis.task.summary }
      </h1>
      <div className="my-5 p-3 border rounded border-opacity-10 border-white whitespace-pre-line">
        { Mantis.task.description }
      </div>
    </div>
  );
}