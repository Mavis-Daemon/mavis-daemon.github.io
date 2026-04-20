const DATA = "project-list.json";
let projects = [];
let sortedProjects = [];
let filteredProjects = [];
let previousScreenSize = window.innerWidth;
const SECTION = document.getElementById("main-section-project-list");

main();
window.addEventListener("resize", updateMasonryGrid);

async function main() {
  projects = await getData();
  sortedProjects = projects.sort((a, b) => b.year - a.year);
  filteredProjects = sortedProjects.filter((project) =>
    handleFilterProjects(project),
  );

  initialMasonryGrid();
}

async function getData() {
  const res = await fetch(DATA);
  const data = await res.json();
  return data;
}

function handleFilterProjects(project) {
  const PAGE_FILTER_OPTION = document
    .getElementById("main-section-project-list")
    .classList[0].replace("filter-", "")
    .toLowerCase();
  if (PAGE_FILTER_OPTION === "all") return true;

  return project.tags
    .map((tag) => tag.toLowerCase())
    .includes(PAGE_FILTER_OPTION);
}

function initialMasonryGrid() {
  if (previousScreenSize < 550) {
    generateMasonryGrid(1);
  } else if (previousScreenSize >= 550 && previousScreenSize < 984) {
    generateMasonryGrid(2);
  } else if (previousScreenSize >= 984) {
    generateMasonryGrid(3);
  }
}

function updateMasonryGrid() {
  if (window.innerWidth < 550 && previousScreenSize >= 550) {
    generateMasonryGrid(1);
    console.log("update Grid 1");
  } else if (
    window.innerWidth >= 550 &&
    window.innerWidth < 984 &&
    (previousScreenSize < 550 || previousScreenSize >= 984)
  ) {
    generateMasonryGrid(2);
    console.log("update Grid 2");
  } else if (window.innerWidth >= 984 && previousScreenSize < 984) {
    generateMasonryGrid(3);
    console.log("update Grid 3");
  }
  previousScreenSize = window.innerWidth;
}
function generateMasonryGrid(numberOfColumn) {
  // clear section
  SECTION.innerHTML = "";
  // create columns
  let colArraysObj = {};
  for (let i = 0; i < numberOfColumn; i++) {
    colArraysObj[`col${i}`] = [];
  }
  // add post to columns
  for (let i = 0; i < filteredProjects.length; i++) {
    const COL = i % numberOfColumn;
    colArraysObj[`col${COL}`].push(filteredProjects[i]);
  }

  handleCreateElement(colArraysObj, numberOfColumn);
}
function handleCreateElement(colArraysObj, numberOfColumn) {
  for (let i = 0; i < numberOfColumn; i++) {
    let currentCol = colArraysObj[`col${i}`];
    let colUl = document.createElement("ul");
    colUl.classList.add("col", "ul-style-none");

    SECTION.appendChild(colUl);
    currentCol.forEach((proj) => {
      if (proj.tags.map((tag) => tag.toLowerCase()).includes("project")) {
        createProjectCard(proj, colUl);
      } else {
        createImageCard(proj, colUl);
      }
    });
  }
}
function createProjectCard(proj, colUl) {
  let projLi = document.createElement("li");
  let article = document.createElement("article");
  article.classList.add("card", "project");
  let section = document.createElement("section");
  let h2 = document.createElement("h2");
  h2.classList.add("f-title-m");
  h2.innerText = proj.title;

  let img = document.createElement("img");
  img.src = proj.imagePath;
  img.alt = proj.imageAlt;
  img.width = proj.imageWidth;
  img.height = proj.imageHeight;
  img.loading = "lazy";
  img.style.objectPosition = proj.imageOffset;
  let p = document.createElement("p");
  p.classList.add("f-body");
  p.innerText = proj.description;
  let tagUl = document.createElement("ul");
  tagUl.classList.add("ul-style-none");
  let tagLi = document.createElement("li");

  let a = document.createElement("a");
  a.classList.add("fs-h6", "link-style-none", "card-button");
  a.href = proj.path;
  a.innerText = "Go to project";

  colUl.appendChild(projLi);
  projLi.appendChild(article);
  article.append(section, a);
  section.append(h2, img);
  if (proj.description !== "") {
    section.appendChild(p);
  }
  section.appendChild(tagUl);

  proj.tags.forEach((tag) => {
    let tagLi = document.createElement("li");
    tagLi.classList.add("tag", "f-tag");
    tagLi.innerHTML = tag;

    tagUl.appendChild(tagLi);
  });
}
function createImageCard(proj, colUl) {
  let projLi = document.createElement("li");
  let article = document.createElement("article");
  article.classList.add("card", "image");
  let section = document.createElement("section");
  let img = document.createElement("img");
  img.src = proj.imagePath;
  img.alt = proj.imageAlt;
  img.width = proj.imageWidth;
  img.height = proj.imageHeight;
  img.loading = "lazy";
  img.style.objectPosition = proj.imageOffset;
  let h2 = document.createElement("h2");
  h2.classList.add("f-title-s");
  h2.innerText = proj.title;
  let tagUl = document.createElement("ul");
  tagUl.classList.add("ul-style-none");
  let tagLi = document.createElement("li");

  let a = document.createElement("a");
  a.classList.add("fs-h6", "link-style-none", "card-button");
  a.href = proj.path;
  a.innerText = "View full";

  colUl.appendChild(projLi);
  projLi.appendChild(article);
  article.append(section, a);
  section.append(img, h2, tagUl);

  proj.tags.forEach((tag) => {
    let tagLi = document.createElement("li");
    tagLi.classList.add("tag", "f-tag");
    tagLi.innerHTML = tag;

    tagUl.appendChild(tagLi);
  });
}
