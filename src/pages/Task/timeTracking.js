import { useChromeStorage } from "../../hooks/storage";
import moment from "moment";
import 'moment-duration-format';
import { useEffect, useState } from "react";
import Button from "../../components/Button";

export function TimeTracking({ taskId }) {

  const [ timeEntries, setTimeEntries ] = useChromeStorage(`timetrack-${ taskId }`, []);
  const [ totalTime, setTotalTime ] = useState(0);
  const [ counting, setCounting ] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      updateTotalTime();
    }, 1000);

    const hasIncompleteEntry = timeEntries.find(entry => !entry.endTime);
    setCounting(hasIncompleteEntry);

    updateTotalTime();

    return () => clearInterval(interval);
  }, [ timeEntries ]);

  function updateTotalTime() {
    let time = timeEntries.reduce((acumulator, value) => {
      let endTime = value.endTime || moment.now();
      return acumulator + (endTime - value.startTime);
    }, 0);
    setTotalTime(time);
  }

  const addTimeEntry = () => {
    const now = moment().valueOf();
    const currentEntry = timeEntries.find(entry => !entry.endTime);
    if (currentEntry) {
      currentEntry.endTime = now;
    } else {
      timeEntries.push({ startTime: now });
    }
    setTimeEntries(timeEntries);
  }

  const clear = () => {
    setTimeEntries([]);
  }

  return (
    <div className="flex items-center gap-5 justify-between p-5">
      <div className="text-xl font-mono whitespace-nowrap">
        <i className="fa-regular fa-clock"></i> { moment.duration(totalTime, 'millisecond').format("mm:ss", { trim: false }) }
      </div>
      <div className="flex gap-1">
        <Button onClick={ () => addTimeEntry() }>
          { counting ? "Parar" : "Iniciar" }
        </Button>
        <Button variant="danger" onClick={ () => clear() }>Limpar</Button>
      </div>
    </div>
  );
}