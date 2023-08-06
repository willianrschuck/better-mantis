import { useRef, useState } from "react";
import { Mantis } from "../../service/task.service";
import { post } from "../../service/utils";

export function UploadDropzone() {
  const [ isDragging, setIsDragging ] = useState(false);
  const counter = useRef(0);
  const fileInputRef = useRef(null);

  if (!Mantis.task.uploadAttachmentAction) {
    return;
  }

  const handleDragEnter = (e) => {
    e.preventDefault();
    counter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    counter.current--;
    if (counter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    counter.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer.files;
    upload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    upload(files);
  };

  function handleClick() {
    fileInputRef.current.click();
  }

  function upload(files) {
    const { action, hiddenAttributes } = Mantis.task.uploadAttachmentAction;
    console.log("Mantis.task.uploadAttachmentAction", Mantis.task.uploadAttachmentAction)
    hiddenAttributes["ufile[]"] = files;
    post(action, hiddenAttributes);
  }

  return (
    <div
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
      onDragOver={ handleDragOver }
      onDrop={ handleDrop }
      className={
        "px-8 py-4 cursor-pointer text-sm text-op text-center rounded border border-dashed hover:border-opacity-30 "
        + (isDragging ? 'border-fuchsia-900' : 'border-white border-opacity-10')
      }
    >
      <input
        type="file"
        style={ { display: 'none' } }
        onChange={ handleFileInput }
        ref={ fileInputRef }
      />
      <p onClick={ handleClick }>
        { isDragging ? 'Solte os arquivos aqui!' : 'Arraste e solte arquivos aqui ou clique para selecionar.' }
      </p>
    </div>
  );
}