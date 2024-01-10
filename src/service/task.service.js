const Mantis = {
  task: {
    summary: "",
    description: "",
    additionalInformation: "",
    responsible: "",
    reporter: "",
    estimate: "",
    priority: "",
    steps: "",
    minutes: "",
    attachments: [],
    bugnotes: []
  }
}

const aliases = {
  "Resumo": "summary",
  "Descrição": "description",
  "Informações Adicionais": "additionalInformation",
  "Atribuído a": "responsible",
  "Relator": "reporter",
  "Estimativa": "estimate",
  "Prioridade": "priority",
  "Passos para Reproduzir": "steps",
  "Arquivos Anexados": "attachments",
  "Minutos em Desenv.": "minutes"
}

const regexData = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;

let tableTarefa = document.querySelector("body > table:nth-child(7)");
if (tableTarefa) {

  /**
   * @returns {Node[][]}
   */
  function groupByAttachment(elements) {
    let result = [];
    let currentGroup = [];

    for (let e of elements) {
      if (e instanceof HTMLElement && e.querySelector("img[src*='fileicons']")) {
        if (currentGroup.length > 0) {
          result.push(currentGroup)
          currentGroup = []
        }
      } else {
        currentGroup.push(e);
      }
    }

    if (currentGroup.length > 0) {
      result.push(currentGroup);
    }

    return result;
  }

  let tds = document.evaluate("//td[@class='category']", tableTarefa, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

  let td;
  while (td = tds.iterateNext()) {

    if (td.textContent === "Arquivos Anexados") {

      let nodesByAttachment = groupByAttachment(td.nextElementSibling.childNodes);

      Mantis.task[aliases[td.textContent]] = nodesByAttachment.map((elements) => {
        let attachment = {};

        for (let e of elements) {

          if (!(e instanceof Element)) {
            continue;
          }

          let isFileIcon = e.matches('a img[src*="fileicon"]');
          if (isFileIcon) continue;

          let isFileName = e.matches('a[href*="file_download.php"]:not([target="_blank"]):not(:has(*)):not(:empty)');
          if (isFileName) {
            attachment.name = e.textContent;
            attachment.url = e.getAttribute("href");
            continue;
          }

          let isRemoveUrl = e.matches('a.small[href*="bug_file_delete"]');
          if (isRemoveUrl) {
            const removeUrl = new URL(e.getAttribute("href"), document.baseURI);
            attachment.actionRemove = {
              action: removeUrl.pathname,
              parameters: {
                file_id: removeUrl.searchParams.get("file_id"),
                bug_file_delete_token: removeUrl.searchParams.get("bug_file_delete_token"),
                _confirmed: 1
              }
            }
            continue;
          }

          let isSpan = e.matches('span')
          if (isSpan) {
            if (regexData.test(e.textContent)) {
              attachment.date = e.textContent;
            }
            continue;
          }

          let imagePreview = e.querySelector('a img[src*="show_inline"]');
          if (imagePreview) {
            attachment.previewImgUrl = imagePreview.getAttribute("src");
          }

        }

        return attachment;
      });

    } else if (td.textContent in aliases) {
      Mantis.task[aliases[td.textContent]] = td.nextElementSibling.textContent.trim();
    }
  }


  Mantis.task.actions = {};

  const formEditarCartao = tableTarefa.querySelector('form[action="bug_update_page.php"]');
  if (formEditarCartao) {
    Mantis.task.actions.edit = extractFormAction(formEditarCartao);
  }

}

function extractFormAction(form) {
  const hiddenInputs = form.querySelectorAll('input[type="hidden"]');
  const data = {
    properties: {}
  };

  data.action = form.action;
  hiddenInputs.forEach(input => {
      data.properties[input.name] = input.value;
  });

  return data;
}

let eBugNotes = document.querySelectorAll("#bugnotes .bugnote")
if (eBugNotes) {

  for (let e of eBugNotes) {

    console.log(e)

    let userElement = e.querySelector("a[href*='view_user_page.php']");
    let contentElement = e.querySelector(".bugnote-note-public")

    let id = e.getAttribute("id");
    let user = userElement.textContent;
    let date = '';
    let content = contentElement.textContent.trimStart();

    for (let span of e.querySelectorAll(".bugnote-public span.small")) {
      if (regexData.test(span.textContent)) {
        date = span.textContent;
      }
    }

    let buttons = e.querySelectorAll('.bugnote-public input[type=submit]');
    for (let button of buttons) {
      if (button.value === "Tornar Privado") {
        button.remove();
      } else {
        button.classList.add('btn');
        button.classList.add('btn-outline-secondary');
        button.classList.add('btn-sm');
      }
    }

    let bugnote = {
      id, user, date, content
    }

    let formEdicao = e.querySelector('form[action*="bugnote_edit_page.php"]');
    if (formEdicao) {
      bugnote.actionEdit = {
        action: formEdicao.getAttribute('action'),
        properties: {
          bugnote_edit_page_token: formEdicao['bugnote_edit_page_token'].value
        }
      }
    }

    let formDelete = e.querySelector('form[action*="bugnote_delete.php"]');
    if (formDelete) {
      console.log("formDelete", formDelete)
      bugnote.actionDelete = {
        action: formDelete.getAttribute('action'),
        properties: {
          bugnote_delete_token: formDelete['bugnote_delete_token'].value,
          _confirmed: 1
        }
      }
    }

    Mantis.task.bugnotes.unshift(bugnote);

  }

}

let annotationForm = document.querySelector("form[action='bugnote_add.php']");
console.log(annotationForm)
if (annotationForm) {
  Mantis.task.commentForm = {
    action: annotationForm.action,
    hiddenAttributes: {},
    required: [ 'bugnote_text' ]
  };
  let elements = annotationForm.querySelectorAll("input[type='hidden']");
  for (let element of elements) {
    Mantis.task.commentForm.hiddenAttributes[element.name] = element.value;
  }
}

let uploadForm = document.querySelector("form[action='bug_file_add.php']");
if (uploadForm) {

  Mantis.task.uploadAttachmentAction = {
    action: uploadForm.action,
    hiddenAttributes: {}
  }

  let elements = uploadForm.querySelectorAll("input[type='hidden']");
  for (let element of elements) {
    Mantis.task.uploadAttachmentAction.hiddenAttributes[element.name] = element.value;
  }

}

document.head.innerHTML = ''
document.body.innerHTML = '<div id="app"></div>';

console.log(Mantis)

console.log(await chrome.storage.local.get());

export { Mantis }