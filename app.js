"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((curr) => curr.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const nav = document.querySelector(".nav");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

// Button scrolling
btnScrollTo.addEventListener("click", function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log("Current scroll (X/Y)", window.pageXOffset, window.pageYOffset);

  // console.log(
  //   "height/width viewport",
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling

  // window.scrollTo(s1coords.left, s1coords.top);

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page navigation

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    // const id = e.target.getAttribute("href");
    // document.querySelector(id).scrollIntoView({ behavior: "smooth" });
    const id = e.target.getAttribute("href").slice(1);
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
// Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");

  // Guard Clause
  if (!clicked) return;

  tabs.forEach((el) => el.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activate Tab

  clicked.classList.add("operations__tab--active");

  // Activate Content

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////

// Sticky navigation - not an efficient way

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener("scroll", function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

///////////////////////////////////////
// Intersection Observer API

// Sticky navigation:

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  // rootMargin: "-90px",
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

// Reveal sections

const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading images

const imgTargets = document.querySelectorAll("[data-src]");

const imgLoad = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0,
  rootMargin: "200px", // to not let users know that we are lazy-loading
});

imgTargets.forEach(function (img) {
  imageObserver.observe(img);
});

///////////////////////////////////////
// Slider

(function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions

  // Dot Functions

  const createDots = function () {
    slides.forEach((_, index) =>
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide=${index}></button>`
      )
    );
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((el) => el.classList.remove("dots__dot--active"));
    document
      .querySelector(`[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Slide Movement Functions

  const goToSlide = function (slide) {
    slides.forEach(
      (ele, i) => (ele.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;

    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // Initialisation Function

  const init = function () {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event Handlers

  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    // if (e.key === "ArrowRight") nextSlide();
    // else if (e.key === "ArrowLeft") prevSlide();

    e.key === "ArrowRight" && nextSlide();
    e.key === "ArrowLeft" && prevSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    // console.log(e.target.dataset.slide);
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;

      goToSlide(slide);
      activateDots(slide);
    }
  });
})();
