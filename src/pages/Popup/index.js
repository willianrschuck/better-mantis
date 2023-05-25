import { useAllChromeData, useChromeStorage } from "../../hooks/storage";
import { useEffect, useState } from "react";
import { TimeTracking } from "../Task/timeTracking";

export default function Popup() {
  const [ data ] = useAllChromeData();
  const [ tasks, setTasks ] = useState([])
  const regex = /timetrack-([0-9]{7})/

  useEffect(() => {
    let filteredTasks = [];
    for (let [ key, value ] of Object.entries(data)) {
      const res = regex.exec(key);
      if (res) {
        filteredTasks.push(res[1]);
      }
    }
    setTasks(filteredTasks);
  }, [ data ]);

  return (
    <div className="flex flex-col bg-stone-950 text-zinc-100">
      { tasks.map((task) => <PopupTimeTracking key={ task } task={ task }/>) }
    </div>
  );

}

function PopupTimeTracking({ task }) {
  const [ entries ] = useChromeStorage(`timetrack-${ task }`, []);

  useEffect(() => {}, [ entries ]);

  if (!entries || entries.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="px-5 pt-3"><span className="font-bold italic opacity-40">#</span> { task }</div>
      <TimeTracking taskId={ task }/>
    </div>
  );
}