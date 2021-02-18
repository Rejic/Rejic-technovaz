var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" actives", "");
    }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " actives";
}


const Paul= 'Contact-Us';
const contactUrl = title
if (Paul == contactUrl) {
  document.getElementById("quote").style.display="none";
}
   
                  


// $('.owl-carousel').owlCarousel({autoplaySpeed: 4500, autoplayTimeout: 4500, nav: false, dots: false, slideTransition: 'linear', autoplay: true,loop:true,margin:10,responsiveClass:true,responsive:{0:{items:2,nav:true},600:{items:3,nav:false},1000:{items:4,nav:true,loop:false}}});







