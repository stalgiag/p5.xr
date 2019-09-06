window.onload = () => {
  addMarqueeClass('app-name');
};

function addMarqueeClass(elementClass) {
  const el = document.getElementsByClassName(elementClass)[0];
  addClass(el, 'marquee3k');

  el.setAttribute('data-pausable', 'true');
  el.setAttribute('data-speed', '0.25');

  Marquee3k.init();
}

function addClass(el, classNameToAdd) {
  el.className += ' ' + classNameToAdd;
}