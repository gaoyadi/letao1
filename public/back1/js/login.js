$(function(){
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6之间'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在2-6之间'
          }
        }
      }
    }
  });

  $('#form').on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      data: $('#form').rerialize(),
      type: 'post',
      dataType: 'json',
      url: "/employee/employeeLogin",
      
    })
  })
})