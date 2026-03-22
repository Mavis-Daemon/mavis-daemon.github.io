//footer dynamic animation
const footerPlaceHolder = document.querySelector(".footer_placeholder");

function calcFooterScrollPercentage() {
  const footerRect = footerPlaceHolder.getBoundingClientRect();
  //get the px of distance between document top and placeholder top
  const FooterToDocTop = footerRect.top + window.scrollY;
  const vpHeight = window.innerHeight;
  //the exact window.scrollY that footer start to reveal
  const footerScrollPosition = FooterToDocTop - vpHeight;
  const scrollable = document.documentElement.scrollHeight - vpHeight;
  const footerScrollPercentage = 0 + (footerScrollPosition / scrollable) * 100;
  document.documentElement.style.setProperty(
    "--footer-animation-range-start",
    `${footerScrollPercentage}%`,
  );
  return footerScrollPercentage;
}
// run function on page load
window.addEventListener("load", calcFooterScrollPercentage);
// run function when change vp
window.addEventListener("resize", calcFooterScrollPercentage);
// run function when document height change
const documentObserver = new ResizeObserver(() => {
  calcFooterScrollPercentage();
});
documentObserver.observe(document.documentElement);

// project select
// document.addEventListener("click", (e) => {
//   const clickedProj = e.target.closest("[data-project]");
//   const projects = document.querySelectorAll("[data-project]");
//   //unselect everything if clicked outside
//   if (!clickedProj) {
//     projects.forEach((project) => {
//       project.dataset.select = "false";
//       return;
//     });
//   }
//   //select the clicked proj and unselect other
//   projects.forEach((project) => {
//     if (project === clickedProj) {
//       project.dataset.select = "true";
//     } else {
//       project.dataset.select = "false";
//     }
//   });
// });
