$(function(){

  var currentPage = 1;
  var pageSize = 5;

  var currentId;
  var isDelete;
  
  render();

  // 渲染用户页
  function render(){

    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ){
        console.log( info );
        var htmlStr = template("tmp", info);
        $('tbody').html( htmlStr );
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function ( a , b , c , page){
            console.log(page);
            currentPage = page;
            render();
          }
        })
      }
    })
  }

  // 模态框显示
  $('tbody').on('click','.btn',function(){
    $('#userModal').modal('show');
    // 点击的时候获取id
    currentId = $(this).parent().data("id");
    // 根据按钮的类名 选择用户状态
    isDelete = $(this).hasClass('btn-danger') ? 0 : 1;
  })


  // 模态框确定按钮
  $('#confirmBtn').click(function(){
    // 发送请求
    $.ajax({
      data: {
        id: currentId,
        isDelete: isDelete
      },
      type: 'post',
      url: '/user/updateUser',
      dataType: 'json',
      success: function(info){
        if (info.success) {

          console.log(info);
          // 关闭模态框
          $('#userModal').modal('hide');
          // 重新渲染
          render();
        }
      }
    })


  })



})