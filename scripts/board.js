[
    '.mantisLogo',
    '.poserHeader'
].forEach(i => document.querySelector(i).remove());

let style = document.createElement('style');
style.innerHTML = `
tr.row-category {
    position: sticky;
    top: 0;
    z-index: 10;
}

tr.row-category td {
    white-space: nowrap;
    padding-top: 1rem;
    padding-bottom: 1rem;
}
`;
document.head.appendChild(style);


/* Ajusta o link dos cartões, para ser possível clicar em qualquer parte */
let cards = document.querySelectorAll('.scrumblock')

for (let card of cards) {
    let link = document.createElement('a');
    link.href = card.querySelector('.buglink a').href;
    link.innerHTML = card.outerHTML;
    card.replaceWith(link);
}


document.styleSheets[0].insertRule(`
div.scrumblock {
    border-radius: 5px !important;
    box-shadow: 0 3px 5px 0 rgba(0, 0, 0, .3) !important;
    position: relative;
    overflow: visible !important;
    transition: all 1s !important;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock .handler {
    top: 4px;
    right: -14px;
    margin: 0 !important;
    padding: 0 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock .handler img {
    border-radius: 50% !important;
    width: 28px;
    height: 28px;
    border: 1px solid white;
    box-sizing: border-box;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock .card-estimate {
    top: 2px;
    left: 2px;
    margin: 0 !important;
    padding: 0 !important;
    width: 1.3em;
    line-height: 1.3em;
    text-align: center;
    vertical-align: middle;
    aspect-ratio: 1 / 1;
    text-align: center;
    box-shadow: none !important;
    border-radius: 50%;
    border: none !important;
    text-shadow: none !important;
    background: rgba(0, 0, 0, .5) !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-improvement {
    background-color: #90CAF9 !important;
    border: 1px solid #64B5F6 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-task {
    background-color: #FFCC80 !important;
    border: 1px solid #FFB74D !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-defect {
    background-color: #EF9A9A !important;
    border: 1px solid #E57373 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-tests {
    background-color: #CE93D8 !important;
    border: 1px solid #BA68C8 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-feature {
    background-color: #A5D6A7 !important;
    border: 1px solid #81C784 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock-support {
    background-color: #FFAB91 !important;
    border: 1px solid #FF8A65 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.scrumblock {
    background: #B0BEC5;
    border: 1px solid #90A4AE !important;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock .buglink {
    margin: 0 !important;
    text-align: center;
    padding-top: 1px;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock .buglink a {
    color: rgba(0, 0, 0, .6) !important;
}
`, 0);

document.styleSheets[0].insertRule(`
.board {
    display: flex;
    justify-content: space-between;
    max-width: 100%;
    overflow-x: scroll;
}
`, 0);

document.styleSheets[0].insertRule(`
.column {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
`, 0);

document.styleSheets[0].insertRule(`
td.scrumcolumn, tr.row-1 {
    background: transparent !important;
}
`, 0);

document.styleSheets[0].insertRule(`
td.scrumcolumn {
    border-left: none !important;
    border-right: none !important;
    text-align: center;
    padding: 0 14px !important;
}
`, 0);

document.styleSheets[0].insertRule(`
tr > td.scrumcolumn + td.scrumcolumn {
    border-left: 1px solid rgba(0, 0, 0, .1) !important;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock {
    float: none !important;
    margin: 16px auto !important;
}
`, 0);

document.styleSheets[0].insertRule(`
body {
    background-image: url('https://images.unsplash.com/photo-1491002052546-bf38f186af56?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=adam-chang-IWenq-4JHqo-unsplash.jpg&w=1920') !important;
    background-size: cover !important;
    background-attachment: fixed !important;
    background-position: center !important;
}
`, 0);

document.styleSheets[0].insertRule(`
tr.row-category {
    background: none !important;
}
`, 0);

document.styleSheets[0].insertRule(`
tr.row-category td:first-child {
    border-radius: 8px 0 0 0 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
tr.row-category td:last-child {
    border-radius: 0 8px 0 0 !important;
}
`, 0);

document.styleSheets[0].insertRule(`
div.scrumblock:hover {
    opacity: 1 !important;
    transition: all 1s !important;
    box-shadow:
        inset 0 0 100px 100px rgba(255, 255, 255, 0.15),
        0 6px 8px 0 rgba(0, 0, 0, .3) !important;
}
`, 0);


//let scrumColumns = document.querySelectorAll('.scrumboard .scrumcolumn');
//let board = document.createElement('div');
//board.classList.add("board")
//
//document.body.appendChild(board);
//
//scrumColumns.forEach(scrumColumn => {
//    let column = document.createElement('div');
//    column.classList.add("column")
//    column.innerHTML = scrumColumn.innerHTML;
//    board.appendChild(column);
//});
//
//document.body.appendChild(board);
