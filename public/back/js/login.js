$(function () {


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
            message: '用户名长度在2-6之间'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      password: {
        validators: {
          notEmpty: {
            message: '密码错误'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度在6-12之间'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  })



  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      data: $('#form').rerialize(),
      url: "/employee/employeeLogin",
      dataType: "json",
      success: function (info) {
        if (info.error === 1000) {
          // alert('用户名不存在')
          $('#form').data('boorstraValidator').updateStatus(username,'INVALID',callback)
          return;
        }
        if (info.error === 1001) {
          // alert('密码错误')
          $('#form').data('bootstrapValidator').updateStatus(password,'INCALID',callback)
        }
        if (info.seccess) {
          location.href = 'index.html';
        }
      }
    })
  });


  $('[type="reset"]').click(function () {
    $("#form").data('bootstrapValidator').resetForm();
  })


});

