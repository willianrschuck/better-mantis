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