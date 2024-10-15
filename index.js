import Text from "./text.md";

const pages = ['', '医学の歴史'];
const indices = [0];

function createColumn(title) {
  const column = document.createElement('div');
  column.style.backgroundColor = 'gray';
  const cell = document.createElement('div');
  cell.style.backgroundColor = 'white';
  cell.innerHTML = Text[title].h;
  column.append(cell);
  return column;
}

function fillLeft(row) {
  if (pages.length >= 3) {
    row.append(document.createElement('div'));
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
      row.children[i + 1].style.backgroundColor = 'gray';
      row.children[i + 1].onclick = moveLeft;
    } else {
      row.children[i + 1].onclick = null;
    }
  }
}

function fillMid(row) {
  row.append(document.createElement('div'));
  for (const page of Text[pages[pages.length - 2]].c) {
    row.append(createColumn(page));
  }
  setMid(row);
}

function setMid(row) {
  row.style.width = '70%';
  for (let i = 0; i < Text[pages[pages.length - 2]].c.length; i++) {
    if (i === indices[pages.length - 2] - 1) {
      row.children[i + 1].onclick = moveUp;
    } else if (i === indices[pages.length - 2] + 1) {
      row.children[i + 1].onclick = moveDown;
    } else {
      row.children[i + 1].onclick = null;
    }
  }
}

function fillRight(row) {
  row.append(document.createElement('div'));
  for (const page of Text[pages[pages.length - 1]].c) {
    row.append(createColumn(page));
  }
  setRight(row);
}

function setRight(row) {
  row.style.width = '15%';
  for (let i = 0; i < Text[pages[pages.length - 1]].c.length; i++) {
    row.children[i + 1].onclick = () => moveRight(i);
  }
}

function moveLeft() {
  pages.pop();
  indices.pop();
  fillLeft(main.children[0]);
  setMid(main.children[1]);
  setRight(main.children[2]);
  main.children[3].style.width = 0;
  main.children[3].innerHTML = '';
  main.children[4].remove();
  const row = document.createElement('div');
  main.prepend(row);
}

function moveUp() {
  const index = --indices[pages.length - 2];
  pages[pages.length - 1] = Text[pages[pages.length - 2]].c[index];
  setMid(main.children[2]);
  main.children[3].innerHTML = '';
  fillRight(main.children[3]);
}

function moveDown() {
  const index = ++indices[pages.length - 2];
  pages[pages.length - 1] = Text[pages[pages.length - 2]].c[index];
  setMid(main.children[2]);
  main.children[3].innerHTML = '';
  fillRight(main.children[3]);
}

function moveRight(i) {
  pages.push(Text[pages[pages.length - 1]].c[i]);
  indices.push(i);
  fillRight(main.children[4]);
  setMid(main.children[3]);
  setLeft(main.children[2]);
  main.children[1].style.width = 0;
  main.children[1].innerHTML = '';
  main.children[0].remove();
  const row = document.createElement('div');
  main.append(row);
}

fillLeft(main.children[1]);
fillMid(main.children[2]);
fillRight(main.children[3]);
