$(function(){

  var currentPage = 1;
  var pageSize = 5;

  // 1 一进页面发送ajax请求
  render();
  function render(){
    $.ajax({
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      type: 'get',
      dataType: 'json',
      url: '/category/queryTopCategoryPaging',
      success: function(info){
        console.log(info);
        var htmlStr = template('firstTpl', info);
        $('tbody').html(htmlStr);

        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
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

  // 2点击添加按钮 显示模态框
  $('#addBtn').click(function(){
    $('#addModal').modal('show');
  })


  // 3校验表单
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: '请输入一级分类名'
          }
        }
      }
    }
  })

  // 4添加按钮发送ajax请求 拿数据进行渲染
  $('#form').on('success.form.bv',function(e){
    e.preventDefault();

    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function(info){
        console.log(info);
        if(info.success) {
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
        }
        $('#form').data("bootstrapValidator").resetForm(true);
      }
    })
  })


})