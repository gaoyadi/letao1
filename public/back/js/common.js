$(document).ajaxStart(function () {
  NProgress.start();
})
$(document).ajaxStop(function() {
  setTimeout(function(){
    NProgress.done();
  })
})

$(function(){
  $('.category').click(function(){
    $(this).next().slideToggle();
  })
})