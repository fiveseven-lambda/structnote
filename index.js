import Text from "./text.md";

const pages = [''];
const indices = [];

const searchParams = new URLSearchParams(location.search);
for (const index of (searchParams.get('i') ?? '0').split('.').map(Number)) {
  const page = Text[pages[pages.length - 1]].c[index];
  if (page) {
    pages.push(page);
    indices.push(index);
  } else {
    break;
  }
}

const columnPadding = 6;
const collapseHeight = '6em';

function createRow() {
  const row = document.createElement('div');
  row.style.width = 0;
  return row;
}

function createColumn(title) {
  const page = document.createElement('div');
  page.classList.add('page');
  page.innerHTML = '<h2>' + title + '</h2>' + Text[title].h;

  const cell = document.createElement('div');
  cell.classList.add('cell');
  cell.append(page);

  return cell;
}

function fillLeft(row) {
  if (pages.length >= 3) {
    for (const page of Text[pages[pages.length - 3]].c) {
      row.append(createColumn(page));
    }
    setLeft(row);
  } else {
    row.style.width = '15%';
  }
}

function setLeft(row) {
  row.style.width = '15%';
  for (let i = 0; i < Text[pages[pages.length - 3]].c.length; i++) {
    if (i === indices[pages.length - 3]) {
      observer.observe(row.children[i].children[0]);
      row.children[i].classList.add('collapsed');
      row.children[i].onclick = moveLeft;
    } else {
      row.children[i].style.height = 0;
      row.children[i].onclick = null;
    }
  }
}

function fillMid(row) {
  for (const page of Text[pages[pages.length - 2]].c) {
    row.append(createColumn(page));
  }
  setMid(row);
}

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    entry.target.parentElement.style.height = entry.contentBoxSize[0].blockSize + 2 * columnPadding + 'px';
  }
});

function setMid(row) {
  row.style.width = '70%';
  observer.disconnect();
  for (let i = 0; i < Text[pages[pages.length - 2]].c.length; i++) {
    if (i === indices[pages.length - 2]) {
      observer.observe(row.children[i].children[0]);
      row.children[i].classList.remove('collapsed');
      row.children[i].onclick = null;
    } else if (i === indices[pages.length - 2] - 1) {
      row.children[i].style.height = collapseHeight;
      row.children[i].classList.add('collapsed');
      row.children[i].onclick = moveUp;
    } else if (i === indices[pages.length - 2] + 1) {
      row.children[i].style.height = collapseHeight;
      row.children[i].classList.add('collapsed');
      row.children[i].onclick = moveDown;
    } else {
      row.children[i].style.height = 0;
    }
  }
}

function fillRight(row) {
  for (const page of Text[pages[pages.length - 1]].c) {
    row.append(createColumn(page));
  }
  setRight(row);
}

function setRight(row) {
  row.style.width = '15%';
  for (let i = 0; i < Text[pages[pages.length - 1]].c.length; i++) {
    row.children[i].style.height = collapseHeight;
    row.children[i].classList.add('collapsed');
    row.children[i].onclick = () => moveRight(i);
  }
}

function moveLeft() {
  pages.pop();
  indices.pop();
  window.history.pushState(null, '', '?i=' + indices.join('.'));
  fillLeft(main.children[0]);
  setMid(main.children[1]);
  setRight(main.children[2]);
  main.children[3].style.width = 0;
  main.children[3].innerHTML = '';
  main.children[4].remove();
  main.prepend(createRow());
}

function moveUp() {
  const index = --indices[pages.length - 2];
  pages[pages.length - 1] = Text[pages[pages.length - 2]].c[index];
  window.history.pushState(null, '', '?i=' + indices.join('.'));
  setMid(main.children[2]);
  main.children[3].innerHTML = '';
  fillRight(main.children[3]);
}

function moveDown() {
  const index = ++indices[pages.length - 2];
  pages[pages.length - 1] = Text[pages[pages.length - 2]].c[index];
  window.history.pushState(null, '', '?i=' + indices.join('.'));
  setMid(main.children[2]);
  main.children[3].innerHTML = '';
  fillRight(main.children[3]);
}

function moveRight(i) {
  pages.push(Text[pages[pages.length - 1]].c[i]);
  indices.push(i);
  window.history.pushState(null, '', '?i=' + indices.join('.'));
  fillRight(main.children[4]);
  setMid(main.children[3]);
  setLeft(main.children[2]);
  main.children[1].style.width = 0;
  main.children[1].innerHTML = '';
  main.children[0].remove();
  main.append(createRow());
}

main.children[0].style.width = 0;
fillLeft(main.children[1]);
fillMid(main.children[2]);
fillRight(main.children[3]);
main.children[4].style.width = 0;

document.addEventListener("keydown", event => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'h':
    case 'a':
      moveLeft();
      break;
    case 'ArrowUp':
    case 'k':
    case 'w':
      moveUp();
      break;
    case 'ArrowDown':
    case 'j':
    case 's':
      moveDown();
      break;
    case 'ArrowRight':
    case 'l':
    case 'd':
      moveRight(0);
      break;
  }
})
