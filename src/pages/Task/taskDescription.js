import { Mantis } from "../../service/task.service";

export function TaskDescription() {

  let copyToClipboard = async () => {
    console.log('window.location', window.location)
    let url = window.location.protocol + "//" + window.location.hostname + window.location.pathname + window.location.search;
    let text = `${ Mantis.task.summary.replace(/"/g, '') }\n${ url }`;
    let textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }

  return <div>
    <h1 className="text-xl my-5 px-3"
        onClick={ copyToClipboard }>{ Mantis.task.summary }</h1>
    <div className="my-5 p-3 border rounded border-opacity-10 border-white whitespace-pre-line">
      { Mantis.task.description }
    </div>
  </div>;
}