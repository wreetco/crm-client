/*
  * wrmn.js - the wreetco menu slider tool
  *****************************************************************************
  * the wreetco menu slider provides a simple way to build out one or more
  * slide menus on a page. when invoked, the defined menus living just outside
  * the viewport are slid into position on the page while the whole container
  * slides x width or y height to accomodate the slider. in this way multiple
  * menus can be defined for any edge of the viewport
  *****************************************************************************
  * TODO/BUGS:
    * fix the function to take an edge with el_id to allow any html el on page
      to serve as the template html for a menu eg wrmn.addMenu($('.el'),"left")
    * re-calc all the things on page resize or rotate
    * investigate creating a drag div for the menu edges
  *****************************************************************************
*/

var wrmn = wrmn || {};

// some things we need
wrmn.uniq = "__wrmn_"; // avoid potential id conflicts with other dom els
// some wrmn wide vars for us
wrmn.opts = { // some default options and stuff
  width_offset: 0, // needed when certain frameworks make overrides messy
  menu_width: 340, // the default width for a side menu
  menu_height: 200, // the default height for a slide menu
  transition_time: 300, // default time in ms to complete menu slide
  touch: false, // enable touch support
  disable_overlay: false, // disable the darkening overlay on the page
  click_close: true, // close the menu and overlay on click outside of menu element
  overlay_color: "rgba(0, 0, 0, .5)"
};
wrmn.menu = {}; // master ref to the html el on the tree
wrmn.activated = "";
wrmn.is_initd = false; // set to true after a successful wrmn.init()

// cronspace
wrmn.cron = {};
wrmn.cron.getViewportDimensions = function() {
  /*
    * just get the the width and height of the current viewport, maybe
    * hang a scroll listener on there to update if you are coo
  */
  return {
    width: document.body.offsetWidth,
    height: document.body.offsetHeight
  };
}; // end getViewportDimensions

// set the elements that trigger a menu open
wrmn.cron.setMenuTrigger = function(el) {
  // add a click listener on this element to trigger a menu
  el.addEventListener("click", function() {
    // do it
    var menu = this.getAttribute('wrmn-trigger');
    // handle it
    wrmn.cron.toggleMenu(menu);
  });
};

// show a menu
wrmn.cron.toggleMenu = function(menu) {
  /*
    * pull a menu out from its edge. the menu passed must be one that has
    * already beedn added to the global menus
  */
  // first, is a menu open?
  if (wrmn.activated !== "")
    menu = wrmn.activated;
  menu = menu || "left"; // as always, default left
  if (!wrmn.is_initd) // if we have not started the main script there is little hope
    return -1;
  // shift the menu container
  var axis, pos;
  if (menu == "top" || menu == "bottom") {
    axis = "Y"; // we will translateY with this
    // determine shift amount
    pos = (menu == "bottom") ? wrmn.opts.menu_height * -1 : wrmn.opts.menu_height;
  }
  else {
    axis = "X"; // we will translateX
    // determine shift
    pos = (menu == "right") ? wrmn.opts.menu_width * -1 : wrmn.opts.menu_width;
  }
  if (wrmn.activated !== "") {
    // if there is already a menu open, translate(X|Y) back to zero position
    pos = 0;
    // disable fog
    wrmn.menu.style.background = "transparent";
    wrmn.activated = ""; // let toggleMenu know next time it is ok to open a menu
  }
  else { // otherwise set an active menu so toggleMenu won't try to open another
    wrmn.activated = menu; // menu is active
    wrmn.menu.style.zIndex = 1000; // up the z-index of the menu container to detect click events and disable page els
    // add a mystery fog
    wrmn.menu.style.background = wrmn.opts.overlay_color;
    wrmn.menu.scrollTop = 0;
    // do set up a click listener to close this menu (if enabled)
    if (wrmn.opts.click_close) {
      wrmn.menu.addEventListener("click", function l() { // "named anon" as a loltastic way to keep ref
        wrmn.menu.style.zIndex = -1;
        wrmn.cron.toggleMenu(menu);
        wrmn.menu.removeEventListener("click", l, false); // don't let them stack
      });
      // lets do one for escape
      window.addEventListener("keydown", function l(e) {
        if (e.keyCode == 27) {
          wrmn.menu.style.zIndex = -1;
          wrmn.cron.toggleMenu(menu);
          window.removeEventListener("keydown", l, false); // don't let them stack
        }
      });
    } // end add click close listeners
  }
  wrmn.menu.style.transform = "translate" + axis + "(" + pos + "px)";
};

// star of the show, the init
wrmn.init = function(el, opts) {
  /*
    * we need to take the el passed in and initialize it as the menu
    * deal. we need to basically find out some properties about it
    * like width, and we need to make sure the format of the menu
    * passed in makes sense to use
  */
  opts = opts || {};
  if (opts) { // if they passed opts the least we can do is collect and set them
    for (var l in opts)
      wrmn.opts[l] = opts[l];
  }
  // let's go ahead and look at this element and see what we have
  var wrmn_tmp = el;
  // see if they sectioned it off, it not, we assume the standard left slider
  var sections = ["top", "right", "bottom", "left"]; // allowed menu sections
  var divs;
  try {
    divs = wrmn_tmp.getElementsByTagName('div'); // divs to see if they are menu parts
  } catch (err) { // seems there is an issue with this element we were passed
    throw "wrmn.js: could not get menu sections - " + err;
  }
  var menus = {}; // hold the menu part refs
  for (var i = 0; i < divs.length; i++) {
    if (sections.indexOf(divs[i].id) !== -1)
      menus[divs[i].id] = divs[i];
  }
  // if we did not find any "parts" then we assume the whole deal is a standard left menu
  if (menus.length === 0) {
    wrmn_tmp.id = "left"; // set the menu orientation default
    menus.left = wrmn_tmp; // make it overall parent the left ref if no child parts
  }
  // the fun part - let's build this weird fucker
  // we should build a foggy overlay the size of the viewport
  // we will want it to have elements of viewport height and opts.menu_width width on the x axis
  // and elements of viewport width and some height h height
  // the elements are positioned based on the menu part ids, again no ids is a default left
  // when a particular menu is activated we slide the opposite direction opts.menu_width on x
  // or some height h on y in order to slide the menu into the viewport with a css transition
  // first we need to know the viewport dimensions
  var vp = wrmn.cron.getViewportDimensions(wrmn_tmp.id);
  // now we can calculate the dimensions of the final croduct
  var width, height;
  width = vp.width + wrmn.opts.width_offset; // + ((menus.left && menus.right) ? opts.menu_width * 2 : opts.menu_width);
  if (menus.top || menus.bottom)
    height = vp.height; // + ((menus.top && menus.bottom) ? opts.menu_height * 2 : opts.menu_height);
  else
    height = vp.height;
  console.log('width: ' + width);
  console.log('height: ' + height);
  // now we now what things need to look like, let's try and piece this together
  var menu_el = document.createElement('div');
  menu_el.style.position = "fixed";
  ["top", "right", "bottom", "left"].map(function(edge) {
    menu_el.style[edge] = 0;
  });
  menu_el.style.width = width + wrmn.opts.menu_width + "px";
  //menu_el.style.height = height + "px";
  console.log('calcd width');
  console.log(menu_el.style.width);
  menu_el.style.zIndex = -1337; // default the overdiv to be nondisruptive
  //menu_el.style.border = "1px solid red"; // debug
  menu_el.style.transition = "all " + wrmn.opts.transition_time / 1000 + "s ease-in-out";
  menu_el.style.overflowY = "scroll";
  // build the defined menus onto it
  for (var k in menus) {
    // k, the key, is the menu position eg left
    // the html is refd in menus[k]
    var m = menus[k];
    m.id = wrmn.uniq + k; // ref it with something that is unique to wrmn
    // deal with dimensions and positioning
    m.style.position = "absolute";
    m.style.display = "block";
    m.style[k] = 0;
    //m.style.height = ((k == "top" || k == "bottom") ? wrmn.opts.menu_height : vp.height) + "px";
    m.style.minHeight = "100%";
    m.style.width = ((k == "right" || k == "left") ? wrmn.opts.menu_width : vp.width) + "px";
    //m.style.border = "1px solid orange"; // debug border
    // since k matches css props top, right, bottom or left, use it directly
    m.style[k] = ((k == "left" || k == "right") ? wrmn.opts.menu_width * -1 : wrmn.opts.menu_height * -1);
    // stopprop.org
    m.onclick = function(e) {
      e.stopPropagation(); // don't let it bubble up to menu_el onclick closer
    };
    menu_el.appendChild(m); // link it
  }
  // let's append wrmn to the tree
  document.body.appendChild(menu_el);
  wrmn.menu = menu_el;
  wrmn.is_initd = true;
  // quick scroll fix
  menu_el.parentNode.style.overflowX = "hidden";
}; // end init
