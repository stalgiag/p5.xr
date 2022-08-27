const docsify = window.Docsify;
const toggle = () => docsify.dom.body.classList.toggle('close');

function addClass(el, classNameToAdd) {
  el.className += ` ${classNameToAdd}`;
}

function addMarqueeClass(elementClass) {
  const el = document.getElementsByClassName(elementClass)[0];
  addClass(el, 'marquee3k');

  el.setAttribute('data-pausable', 'true');
  el.setAttribute('data-speed', '0.25');

  Marquee3k.init();
}

function addMobileSidebarCallback() {
  for (const link of docsify.dom.findAll('.sidebar-nav ul a')) {
    link.onclick = () => {
      if (docsify.dom.body.classList.contains('close') && docsify.util.isMobile) {
        toggle();
      }
    };
  }
}

window.onload = () => {
  addMarqueeClass('app-name');
  addMobileSidebarCallback();
};
