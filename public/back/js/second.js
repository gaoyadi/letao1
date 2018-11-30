$(function(){
  // 1 一进页面发送ajax 渲染页面

  var currentPage = 1;
  var pageSize = 5;
  render();
  function render(){


    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: 'json',
      success: function(info) {
        console.log(info);
        var htmlStr = template("secondTpl", info);
        $('tbody').html(htmlStr);


        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil(info.total / info.size),//总页数
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值

            currentPage = page;
            render();
          }
        });
        
      }
    })
  }


  //2.点击添加按钮 模态框显示

  $('#addBtn').click(function(){
    $('#addModal').modal('show');
    $.ajax({
      data: {
        page: 1,
        pageSize: 100
      },
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      dataType: 'json',
      success: function(info) {
        console.log(info);
        var htmlStr = template('dropdownTpl',info);
        $('.dropdown-menu').html(htmlStr)
      }
    })
  })

  //3 给a添加点击事件
  $('.dropdown-menu').on('click','a',function(){
    var txt = $(this).text();
    $('#dropdownText').text(txt);
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  })

  // 4配置文件上传插件 发送文件异步上传
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function(e,data) {
      console.log(data);
      var picObj = data.result;

      var picUrl = picObj.picAddr;
      $('#imgBox img').attr('src',picUrl);

      $('[name="brandLogo"]').val(picUrl);

      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID")
    }
  })

  //5 添加表单校验功能
  $('#form').bootstrapValidator({
    // 重置排除项, 都校验, 不排除
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',   // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 指定校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  })

  //6 注册表单校验成功事件

  $('#form').on('success.form.bv',function(e){

    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function(info){
        console.log(info);
        if( info.success) {
          $('#addModal').modal('hide');
          currentPage = 1;
          render();

          //重置
          $('#form').data('bootstrapValidator').resetForm(true);

          // 不是表单元素的重置
          $('.dropdown-menu').text('请输入一级分类');
          $('#imgBox img').attr("src",'./images/none.png')
        }
      }
    })
  })
})

