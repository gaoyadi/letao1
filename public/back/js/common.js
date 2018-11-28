$(document).ajaxStart(function () {
  NProgress.start();
})
$(document).ajaxStop(function() {
  setTimeout(function(){
    NProgress.done();
  })
})


$(function(){
  // 二级栏
  $('.category').click(function(){
    $(this).next().slideToggle();
  });

  $('.icon_left').click(function(){
    $('.aside').toggleClass('hidemenu');
    $('.topbar').toggleClass('hidemenu');
    $('.main').toggleClass('hidemenu');
  })

  // 模态框
  $('.icon_right').click(function(){
    $('#logoutModal').modal('show');
  })
  // 退出功能
  $('#logoutBtn').click(function(){
    $.ajax({
      type: 'get',
      url: '/employee/employeeLogout',
      dataType: 'json',
      success: function(info){
        console.log(info);
        if(info.success) {
          location.href = 'login.html';
        }
      }
    })
  })
  
})

