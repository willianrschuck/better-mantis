
function extractTaskInfo() {
    let obj = {
        "Resumo": "",
        "Descrição": "",
        "Informações Adicionais": "",
        "Atribuído a": "",
        "Relator": "",
        "Estimativa": "",
        "Prioridade": "",
        "Passos para Reproduzir": "",
        "Arquivos Anexados": []
    }

    let tableTarefa = document.querySelector("body > table:nth-child(7)");
    let tds = document.evaluate("//td[@class='category']", tableTarefa, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);

    let td;
    while (td = tds.iterateNext()) {

        if (td.textContent === "Arquivos Anexados") {

            let anexos = [];
            let node = td.nextSibling;
            let links = document.evaluate("a[count(@*) = 1 and @href and not(*) and normalize-space(text())]", node, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
            let link;
            while (link = links.iterateNext()) {
                anexos.unshift({
                    name: link.textContent,
                    href: link.href
                });

                let img = document.evaluate("a/img[contains(@src, '"+ link.getAttribute('href') +"')]", node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (img) {
                    anexos.at(0).img = img.src;
                }

            }

            obj["Arquivos Anexados"] = anexos;

        } else if (td.textContent in obj) {

            obj[td.textContent] = td.nextSibling.textContent.trim();

        }
    }
    return obj;
}

function extractAnnotations() {

    let bugnotes = [];

    let eBugNotes = document.querySelectorAll("#bugnotes .bugnote")
    for (let e of eBugNotes) {

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

        let forms = e.querySelectorAll('.bugnote-public form');

        for (let form of forms) {
            form.classList.add('d-inline-block');
        }

        bugnotes.unshift({
            user: e.querySelector('.bugnote-public').innerHTML,
            text: e.querySelector('.bugnote-note-public').textContent
        })

    }

    return bugnotes;

}

function extractAnnotationFormTokens() {
    let anotationForm = document.getElementById("bugnote_add_open");
    if (anotationForm) {
        let iBugAddToken = anotationForm.querySelector("input[name='bugnote_add_token']");
        let iBugId = anotationForm.querySelector("input[name='bug_id']");

        return {
            token: iBugAddToken.value,
            bugId: iBugId.value
        };
    }

    return {};

}

function extractUploadFormTokens() {

    let uploadForm = document.getElementById("upload_form_open");
    let token = uploadForm.querySelector("input[name='bug_file_add_token']").value;
    let bugId = uploadForm.querySelector("input[name='bug_id']").value;
    let maxFileSize = uploadForm.querySelector("input[name='max_file_size']").value;

    return { token, bugId, maxFileSize };

}

let annotationForm = extractAnnotationFormTokens();
let taskInfo = extractTaskInfo();
let bugnotes = extractAnnotations()

let linkBootstrap = document.createElement("link");
linkBootstrap.href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css";
linkBootstrap.rel="stylesheet";

let styles = document.querySelectorAll("link[rel=stylesheet]");
for (let style of styles) style.remove();


document.head.appendChild(linkBootstrap);
let s = document.createElement('script');
s.src = chrome.runtime.getURL('scripts/bootstrap.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

let formUpdate = document.querySelector("form[action='bug_update_page.php']");
formUpdate.querySelector("input[type=submit]").remove();
formUpdate.id = "formUpdate";
formUpdate.visibility = "hidden"

let formAssign = document.querySelector("form[action='bug_assign.php']");
formAssign.querySelector("input[type=submit]").remove();
formAssign.id = "formAssign";
formAssign.visibility = "hidden"

let assignOptions = formAssign.querySelector("select");
assignOptions.setAttribute("form", "formAssign");
assignOptions.className = "form-select form-select-sm";
assignOptions.remove();

let formClone = document.querySelector("form[action='bug_report_page.php']");
formClone.querySelector("input[type=submit]").remove();
formClone.id = "formClone";
formClone.visibility = "hidden"




document.body.innerHTML = `

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,500;0,700;1,500;1,700&display=swap');

:root {
    --bs-font-monospace: "JetBrains Mono",SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}

pre {
    white-space: pre-wrap;
}
</style>

<nav class="navbar bg-dark navbar-expand-lg" data-bs-theme="dark">
    <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-link" href="/plugin.php?page=Scrum/board">Quadro</a>
                ${annotationForm ? `<a class="ml-auto nav-link" href="#anotacoes">Anotações</a>` : ''}
            </div>
        </div>
    </div>
</nav>

<div class="container mt-5">
    <div class="row">
        <div class="col-12">

            <div class="border-bottom">
                <h1 class="cursor-copy font-monospace h3" role="button"
                    onclick="(async () => {
                        let text = \`${taskInfo["Resumo"].replace(/"/g, '')}\n${window.location.href}\`;
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
                    })()">
                    ${taskInfo["Resumo"].replace(/"/g, '')}
                </h1>
            </div>

            <div class="my-3 font-monospace " style="font-size: 14px">
                <pre>${taskInfo["Descrição"]}</pre>
                <pre>----</pre>
                <pre>${taskInfo["Informações Adicionais"].replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;")}</pre>
                <pre>${taskInfo["Passos para Reproduzir"]}</pre>
            </div>

            <div>

                ${ taskInfo["Arquivos Anexados"] ? `
                <div class="row">
                    <div class="col">
                        <div id="anexos" class="h3 border-bottom d-flex justify-content-between">
                            <span class="d-inline-block">Anexos</span>
                            <a class="btn btn-outline-primary btn-sm mb-1 ml-auto" data-bs-toggle="collapse" href="#collapseAnexos" role="button" aria-expanded="false" aria-controls="collapseAnexos">
                                Exibir/Ocultar
                            </a>
                        </div>
                    </div>
                </div>
                <div id="collapseAnexos" class="row collapse">
                    ${ taskInfo["Arquivos Anexados"].map(anexo => `
                    <div class="col-12">
                        ${ anexo.name }: <a href="${ anexo.href }">Baixar</a>
                        ${ anexo.img ? `<img src="${ anexo.img }" style="width: 100%" />` : '' }
                    </div>
                    `).join('') }
                </div>
                ` : ''
                }

                <div class="row">
                    <div class="d-flex gap-2 mb-2">
                        <button type="submit" form="formAssign" class="btn btn-sm btn-primary">Atribuir&nbsp;a</button>
                        ${assignOptions.outerHTML}
                        <button type="submit" form="formClone" class="btn btn-sm btn-primary">Clonar</button>
                        <button type="submit" form="formUpdate" class="btn btn-sm btn-primary">Editar</button>
                    </div>
                </div>

                <div class="row collapse">
                    <div class="col">
                        <div id="anotacoes" class="h3 border-bottom">
                            Anotações
                        </div>
                    </div>
                </div>

                ${
                bugnotes.length > 0 ? `
                <div class="row gy-4 mt-2 mb-5">
                    ${
                    bugnotes.map(b => `
                        <div class="col-2">
                            ${b.user}
                        </div>
                        <div class="col-10 pl-2 border-start">
                            <pre>${b.text.trim()}<pre>
                        </div>
                    `).join('')
                    }
                </div>
                ` : ''
                }

                ${
                annotationForm ? `
                <form name="bugnoteadd" method="post" action="bugnote_add.php" class="row g-2 mb-3">
                    <input type="hidden" name="bug_id" value="${annotationForm.bugId}" />
                    <input type="hidden" name="bugnote_add_token" value="${annotationForm.token}" />
                    <div class="col-12">
                        <div class="form-floating">
                            <textarea class="form-control" name="bugnote_text" placeholder="Adicione sua anotação aqui" style="height: 100px"></textarea>
                            <label for="floatingTextarea">Nova anotação</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <input type="submit" class="btn btn-primary mx-auto" value="Adicionar Anotação" onclick="this.disabled=1;document.bugnoteadd.submit();">
                    </div>
                </form>
                ` : ''
                }

            </div>

        </div>
    </div>
</div>

`;

document.body.append(formAssign, formClone, formUpdate);
