import { Mantis } from "../../service/task.service";
import { TaskDescription } from "./taskDescription";
import { DateUtil } from "../../service/dataUtil";
import TipTap from "../../components/TipTap";
import { useState } from "react";
import { post } from "../../service/utils";
import Button from "../../components/Button";
import ActionButton from "../../components/ActionButton";
import { UploadDropzone } from "./uploadDropzone";
import { TimeTracking } from "./timeTracking";
import FormAction from "../../components/SelectAction";
import { Dialog, DialogContent, DialogTrigger } from "../../components/Dialog";
import { EyeOpenIcon } from "@radix-ui/react-icons";

const copyToClipboard = async () => {
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

function CommentForm() {
  const [ text, setText ] = useState('');
  const { commentForm } = Mantis.task;

  const setWraper = (text) => {
    setText(text);
  }

  const submit = async () => {
    const params = {
      ...commentForm.hiddenAttributes,
      bugnote_text: text
    }
    post(commentForm.action, params);
  }

  return <div className="flex flex-col items-start space-y-1">
    <TipTap value={ text } onChange={ setWraper } className="w-full"/>
    <Button size="sm" className="ml-auto" onClick={ () => submit() }>Comentar</Button>
  </div>;
}

function TaskStatus({ name, value, icon }) {
  return <div className="flex flex-wrap items-center py-2">
    <div className="flex items-center gap-x-2 sm:basis-1/2">
      { icon && <i className={ `fa-solid ${ icon } px-2` }></i> }
      { name }
    </div>
    <div>
      <span className="px-2 py-1 bg-gray-900 rounded">{ value }</span>
    </div>
  </div>;
}

export default () => {
  return (
    <div className="w-full h-full bg-stone-950 text-zinc-100 flex">
        <div className="basis-3/4 flex-grow p-5 overflow-y-auto">

          <TaskDescription />

          { (Mantis.task.attachments?.length > 0 || Mantis.task.uploadAttachmentAction) &&
            <div className="py-3 border-t-2 border-white border-opacity-10">
              <h2 className="text-lg">Anexos</h2>

              <UploadDropzone />

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                { Mantis.task.attachments.map((attachment) => (
                  <div key={ attachment.url }
                    className="flex items-center justify-between gap-2 border-2 border-white border-opacity-10 rounded-xl px-3 py-2">
                    <div className="flex items-center flex-grow min-w-0">
                      <div className="pr-2">
                        <i className="fa-solid fa-paperclip"></i>
                      </div>
                      <a href={ attachment.url } className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <div className="truncate" title={ attachment.name }>{ attachment.name }</div>
                          <span className="text-zinc-400">{ DateUtil.format(attachment.date) }</span>
                        </div>
                      </a>
                      { attachment.name.endsWith(".png") &&
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full ml-auto"><EyeOpenIcon className="h-4 w-4"/></Button>
                          </DialogTrigger>
                          <DialogContent className="p-0 overflow-hidden max-w-max max-h-screen">
                            <img src={ attachment.url } alt={ attachment.name } className="w-full h-full" />
                          </DialogContent>
                        </Dialog>
                      }

                    </div>
                    { attachment.actionRemove &&
                      <ActionButton
                        size="icon"
                        value={ <i className="fa-solid fa-xmark"></i> }
                        action={ attachment.actionRemove.action }
                        parameters={ attachment.actionRemove.parameters }/> }
                  </div>
                )) }
              </div>
            </div>
          }

          <div className="py-3 border-t-2 border-white border-opacity-10 text-zinc-300">
            <h2 className="mb-3 text-lg text-zinc-50">Comentários</h2>

            { Mantis.task.commentForm && <CommentForm /> }

            { Mantis.task.bugnotes.map(bugnote => (
              <div key={ bugnote.id } className="flex flex-col my-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm">{ bugnote.user } - { DateUtil.format(bugnote.date) }</span>
                  </div>
                  <div className="flex gap-1 py-1">
                    { bugnote.actionEdit && <ActionButton size="sm" value="Editar" { ...bugnote.actionEdit } /> }
                    { bugnote.actionDelete && <ActionButton size="sm" variant="danger" value="Remover" { ...bugnote.actionDelete } /> }
                  </div>
                </div>
                <TipTap value={ bugnote.content } className={ "ml-10" }/>
              </div>
            )) }
          </div>
        </div>
        <div className="bg-stone-950 basis-1/4 flex-grow border-l border-white border-opacity-10 text-sm">
          <div className="p-5 flex items-center border-b border-white border-opacity-10 gap-x-2">
            <div className="flex-grow text-xl">
              <span className="font-bold italic opacity-40">#</span>&nbsp;
              { Mantis.task.summary.substring(0, 7) }
            </div>
            <a href={ `${ window.location.protocol }//${ window.location.host }/plugin.php?page=Scrum/board` }>
              <Button size="icon">
                <i className="fa-solid fa-arrow-left-long"></i>
              </Button>
            </a>
            <Button size="icon" onClick={ copyToClipboard } title="Copiar mensagem de commit">
              <i className="fa-regular fa-clone"></i>
            </Button>
            { Mantis.task.actions.edit && <ActionButton size="icon" value={ <i className="fa-solid fa-pencil"></i> } { ...Mantis.task.actions.edit } /> }
          </div>
          <div className="p-5">
            <TaskStatus name="Prioridade" icon="fa-flag" value={ Mantis.task.priority } />
            <TaskStatus name="Relator" icon="fa-user-pen" value={ Mantis.task.reporter } />
            <TaskStatus name="Atribuído a" icon="fa-user" value={ Mantis.task.responsible } />
            <TaskStatus name="Estimatica" icon="fa-person-digging" value={ Mantis.task.estimate || 'não pontuado' } />
            <TaskStatus name="Minutos em Desenv." icon="fa-regular fa-keyboard" value={ Mantis.task.minutes } />
          </div>
          <div>
            <TimeTracking taskId={ Mantis.task.summary.substring(0, 7) }/>
          </div>
          <div className="flex flex-wrap justify-center gap-1 p-1">
            {Mantis.task.actions.assign && <FormAction id="assign" value="Atribuir a" { ...Mantis.task.actions.assign } />}
            {Mantis.task.actions.changeStatus && <FormAction id="changeStatus" value="Mudar Status" { ...Mantis.task.actions.changeStatus } />}
            {Mantis.task.actions.monitor && <FormAction id="monitor" value="Monitorar" { ...Mantis.task.actions.monitor } />}
            {Mantis.task.actions.stopMonitor && <FormAction id="stopMonitor" value="Parar de Monitorar" { ...Mantis.task.actions.stopMonitor } />}
            {Mantis.task.actions.clone && <FormAction id="clone" value="Clonar" { ...Mantis.task.actions.clone } />}
            {Mantis.task.actions.close && <FormAction id="close" value="Fechar" { ...Mantis.task.actions.close } />}
            {Mantis.task.actions.move && <FormAction id="move" value="Mover" { ...Mantis.task.actions.move } />}
            {Mantis.task.actions.remove && <FormAction id="remove" value="Remover" variant="danger" { ...Mantis.task.actions.remove } />}
          </div>
        </div>
    </div>
  );
}