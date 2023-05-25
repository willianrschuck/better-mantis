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

function CommentForm() {
  const [ text, setText ] = useState('');
  const { commentForm } = Mantis.task;

  const setWraper = (text) => {
    console.log(text);
    setText(text);
  }

  const submit = async () => {
    const params = {
      ...commentForm.hiddenAttributes,
      bugnote_text: text
    }
    post(commentForm.action, params);
  }

  return <div className="flex flex-col items-start">
    <TipTap value={ text } onChange={ setWraper } className="w-full"/>
    <Button value="Comentar" className="my-2 px-3 py-1 text-sm border border-white border-opacity-10 rounded hover:bg-gray-900"
            onClick={ () => submit() }/>
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
    <div className="w-full h-full bg-stone-950 text-zinc-100">
      <div className="flex mx-auto h-full">
        <div className="basis-3/4 flex-grow p-5 overflow-y-auto">
          <TaskDescription/>

          { (Mantis.task.attachments?.length > 0 || Mantis.task.uploadAttachmentAction) &&
            <div className="py-3 border-t-2 border-white border-opacity-10">
              <h2 className="text-lg">Anexos</h2>

              <UploadDropzone/>

              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                { Mantis.task.attachments.map((attachment) => (
                  <div
                    className="flex items-center justify-between border-2 border-white border-opacity-10 rounded-xl px-3 py-2">
                    <div className="flex items-center min-w-0">
                      <div className="pr-2">
                        <i className="fa-solid fa-paperclip"></i>
                      </div>
                      <a href={ attachment.url } className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <div className="truncate" title={ attachment.name }>{ attachment.name }</div>
                          <span className="text-zinc-400">{ DateUtil.format(attachment.date) }</span>
                        </div>
                      </a>
                    </div>
                    { attachment.actionRemove &&
                      <ActionButton
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

            { Mantis.task.commentForm && <CommentForm/> }

            { Mantis.task.bugnotes.map(bugnote => (
              <div key={ bugnote.id } className="flex flex-col my-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm">{ bugnote.user } - { DateUtil.format(bugnote.date) }</span>
                  </div>
                  <div className="flex gap-1 py-1">
                    {
                      bugnote.actionEdit && <ActionButton
                        value="Editar"
                        action={ bugnote.actionEdit.action }
                        parameters={ bugnote.actionEdit.properties }
                        className="px-2 py-1 text-xs border border-white border-opacity-10 rounded hover:bg-gray-900"
                      />
                    }
                    {
                      bugnote.actionDelete && <ActionButton
                        value="Remover"
                        action={ bugnote.actionDelete.action }
                        parameters={ bugnote.actionDelete.properties }
                        className="px-2 py-1 text-xs border border-white border-opacity-10 rounded hover:bg-rose-950"
                      />
                    }
                  </div>
                </div>
                <TipTap value={ bugnote.content } className={ "ml-10" }/>
              </div>
            )) }
          </div>
        </div>
        <div className="bg-stone-950 basis-1/4 flex-grow border-l border-white border-opacity-10 text-sm">
          <div className="p-5 flex items-center border-b border-white border-opacity-10">
            <div className="flex-grow text-xl">
              <span className="font-bold italic opacity-40">#</span>&nbsp;
              { Mantis.task.summary.substring(0, 7) }
            </div>
            <div>
              { Mantis.task.actions.edit &&
                <ActionButton value={ <i className="fa-solid fa-pencil"></i> }
                              action={ Mantis.task.actions.edit.action }
                              parameters={ Mantis.task.actions.edit.properties }
                              className="btn-primary"/>
              }
            </div>
          </div>
          <div className="p-5">

            <TaskStatus name="Prioridade" icon="fa-flag" value={ Mantis.task.priority }/>
            <TaskStatus name="Relator" icon="fa-user-pen" value={ Mantis.task.reporter }/>

            <div className="flex flex-wrap items-center py-2">
              <div className="flex items-center gap-x-2 sm:basis-1/2">
                <i className="fa-solid fa-user px-2"></i>
                Atribuído a
              </div>
              <div>
                <span className="px-2 py-1 bg-gray-900 rounded">{ Mantis.task.responsible }</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center py-2">
              <div className="flex items-center gap-x-2 sm:basis-1/2">
                <i className="fa-solid fa-person-digging px-2"></i>
                Estimativa
              </div>
              <div>
                <span className="px-2 py-1 bg-gray-900 rounded">{ Mantis.task.estimate || 'não pontuado' }</span>
              </div>
            </div>

          </div>
          <div>
            <TimeTracking taskId={Mantis.task.summary.substring(0, 7)} />
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}