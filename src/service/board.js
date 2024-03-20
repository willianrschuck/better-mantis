import { formToObject } from "./utils";

let scrumColumnTitles = document.querySelectorAll('.scrumboard .scrumcolumn');
let scrumColumns = document.querySelectorAll('.scrumboard .scrumcolumn');

const columnIdRegex = /scrumcolumn_([\s\S]+)/g;

function extractColumnId(scrumColumn) {
  const matches = Array.from(scrumColumn.getAttribute("id").matchAll(columnIdRegex), m => m[1]);
  return matches[0].toLowerCase().replaceAll(/\s/g, "_");
}

function extractColumnName(scrumColumn) {
  const matches = Array.from(scrumColumn.getAttribute("id").matchAll(columnIdRegex), m => m[1]);
  return matches[0];
}

function extractCardType(element) {
  const classes = Array.from(element.classList);
  const classNamePrefix = 'scrumblock-';
  const cardType = classes.find(className => className.startsWith(classNamePrefix));

  return cardType ? cardType.slice(classNamePrefix.length) : null;
}

let columns = Array.from(scrumColumns).map(scrumColumn => {
  const mantisCards = Array.from(scrumColumn.querySelectorAll(".scrumblock"))

  const cards = mantisCards.map(scrumCard => {
    const type = extractCardType(scrumCard);
    const bugId = scrumCard.getAttribute("bugid");
    const title = scrumCard.querySelector(".summary").textContent;
    const priorityUrl = scrumCard.querySelector(".priority img").getAttribute("src");
    const priority = priorityUrl.split('/').pop().replace(".png", "");
    const handlerImageUrl = scrumCard.querySelector(".handler img")?.getAttribute("src").replace("?s=28&d=mm", "");
    const points = scrumCard.querySelector(".card-estimate")?.textContent

    const card = {
      bugId,
      type,
      priority,
      title,
      points
    };

    if (handlerImageUrl) {
      card.handler = {
        imageUrl: handlerImageUrl
      }
    }

    return card
  })

  return {
    id: extractColumnId(scrumColumn),
    name: extractColumnName(scrumColumn),
    mantisId: scrumColumn.getAttribute("columnstatus"),
    cards
  }
});

const username = document.querySelector('.login-info-left .italic').textContent;

const links = Array.from(document.querySelectorAll(".menu a")).map((a) => {
  return {
    title: a.textContent,
    href: a.href,
  }
});

let forms = {}

const setProject = document.querySelector('form[action="/set_project.php"]');
if (setProject) {
  forms.setProject = formToObject(setProject);
}

const jumpToBug = document.querySelector('form[action="/jump_to_bug.php"]');
if (jumpToBug) {
  forms.jumpToBug = formToObject(jumpToBug);
}

const filter = document.querySelector('form[action="/plugin.php?page=Scrum/board"]');
if (filter) {
  forms.filter = formToObject(filter);
}

document.head.innerHTML = ''
document.body.innerHTML = '<div id="app"></div>';

export { username, columns, links, forms }