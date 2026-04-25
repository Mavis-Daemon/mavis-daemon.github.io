console.log("script.js loaded");

const DATA = "project-list.json";
let projects = [];
let sortedProjects = [];
let filteredProjects = [];
let previousScreenSize = window.innerWidth;
const SECTION = document.getElementById("main-section-project-list");
const multipleImageBoxes = document.querySelectorAll(".image-box.multiple");
let utcOffset = 2;

if (SECTION !== null) {
  main();
  window.addEventListener("resize", updateMasonryGrid);
}
multipleImageBoxes.forEach((multiImageBox) => {
  initializeMultiImageBox(multiImageBox);
});
if (document.getElementById("current-time")) {
  updateTime();
  setInterval(updateTime, 1000);
}

async function main() {
  projects = await getData();
  sortedProjects = projects.sort((a, b) => b.year - a.year);
  filteredProjects = sortedProjects.filter((project) =>
    filterProjects(project),
  );

  initializeMasonryGrid();
}
async function getData() {
  const res = await fetch(DATA);
  const data = await res.json();
  return data;
}
function filterProjects(project) {
  const section = document.getElementById("main-section-project-list");
  const pageFilters = Array.from(section.classList)
    .filter((className) => className.startsWith("filter-"))
    .map((className) => className.replace("filter-", "").toLowerCase());

  if (pageFilters.includes("all") || pageFilters.length === 0) return true;

  const projectTags = project.tags.map((tag) => tag.toLowerCase());
  return pageFilters.some((filter) => projectTags.includes(filter));
}

function initializeMasonryGrid() {
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

  handleRenderElement(colArraysObj, numberOfColumn);
}
function handleRenderElement(colArraysObj, numberOfColumn) {
  for (let i = 0; i < numberOfColumn; i++) {
    let currentCol = colArraysObj[`col${i}`];
    let colUl = document.createElement("ul");
    colUl.classList.add("col", "ul-style-none");

    SECTION.appendChild(colUl);
    currentCol.forEach((proj) => {
      if (proj.tags.map((tag) => tag.toLowerCase()).includes("project")) {
        renderProjectCard(proj, colUl);
      } else {
        renderImageCard(proj, colUl);
      }
    });
  }
}
function renderProjectCard(proj, colUl) {
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
  a.innerText = proj.buttonText !== "" ? proj.buttonText : "View project";
  a.target = proj.target;

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
function renderImageCard(proj, colUl) {
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
  a.innerText = proj.buttonText !== "" ? proj.buttonText : "View full";
  a.target = proj.target;

  colUl.appendChild(projLi);
  projLi.appendChild(article);
  article.append(section, a);
  section.append(h2, img, tagUl);

  proj.tags.forEach((tag) => {
    let tagLi = document.createElement("li");
    tagLi.classList.add("tag", "f-tag");
    tagLi.innerHTML = tag;

    tagUl.appendChild(tagLi);
  });
}

function initializeMultiImageBox(multiImageBox) {
  const tabs = multiImageBox.querySelectorAll(".button-image-tab");
  const images = multiImageBox.querySelectorAll("img");
  const buttonScrollLeft = multiImageBox.querySelector(".scroll-left");
  const buttonScrollRight = multiImageBox.querySelector(".scroll-right");

  images.forEach((img, i) => {
    img.setAttribute("data-index", i);
  });
  updateScrollButton(tabs, 0, buttonScrollLeft, buttonScrollRight);

  buttonScrollLeft.onclick = () =>
    handleScroll(-1, images, tabs, buttonScrollLeft, buttonScrollRight);
  buttonScrollRight.onclick = () =>
    handleScroll(1, images, tabs, buttonScrollLeft, buttonScrollRight);
  tabs.forEach((tab, i) => {
    tab.onclick = () =>
      scrollToIndex(images, i, tabs, buttonScrollLeft, buttonScrollRight);
  });
}
function handleScroll(
  direction,
  images,
  tabs,
  buttonScrollLeft,
  buttonScrollRight,
) {
  const currentTab = Array.from(tabs).findIndex((tab) =>
    tab.classList.contains("active"),
  );
  scrollToIndex(
    images,
    currentTab + direction,
    tabs,
    buttonScrollLeft,
    buttonScrollRight,
  );
}
function scrollToIndex(
  images,
  index,
  tabs,
  buttonScrollLeft,
  buttonScrollRight,
) {
  if (index >= 0 && index < images.length) {
    images[index].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    updateTab(tabs, index);
    updateScrollButton(tabs, index, buttonScrollLeft, buttonScrollRight);
  }
}
function updateTab(tabs, index) {
  tabs.forEach((tab, i) => {
    const isActive = i === parseInt(index);

    tab.classList.toggle("active", i === parseInt(index));
    tab.disabled = isActive;
  });
}
function updateScrollButton(tabs, index, buttonScrollLeft, buttonScrollRight) {
  if (buttonScrollLeft && buttonScrollRight) {
    buttonScrollLeft.disabled = index === 0;
    buttonScrollRight.disabled = index === tabs.length - 1;
  }
}

function updateTime() {
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + utcOffset * 3600000);
  const timeString = localTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const element = document.getElementById("current-time");

  if (element) {
    element.textContent = `${timeString} (UTC +${utcOffset}:00)`;
  }
}
