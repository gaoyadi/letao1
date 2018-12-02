
$(function () {
  // 1.一进页面渲染
  var currentPage = 1;
  var pageSize = 5;

  var picArr = [];
  render();
  function render() {

    $.ajax({
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      type: 'get',
      dataType: 'json',
      url: '/product/queryProductDetailList',
      success: function (info) {
        console.log(info);
        var htmlStr = template('productTpl', info);
        $('tbody').html(htmlStr);

        // 分页
        $('#pagintor').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPage: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }


  //2 添加按钮
  $('#addBtn').click(function () {
    $('#addModal').modal('show');

    // 查询二级分类
    $.ajax({
      data: {
        page: 1,
        pageSize: 100
      },
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      dataType: 'json',
      success: function (info) {
        console.log(info);
        var htmlStr = template('dropdownTpl', info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  //3 给添加的a添加点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    var txt = $(this).text();
    $('#dropdownText').text(txt);

    var id = $(this).data('id');
    $('[name="brandId"]').val(id);

    $('#form').data('bootstrapValidator').updateStatus("brandId", "VALID");
  })

  //4 配置文件上传插件
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, data) {
      console.log(data.result);
      var picObj = data.result;
      picArr.unshift(picObj);

      var picUrl = picObj.picAddr;

      $('#imgBox').prepend('<img src="' + picUrl + '" style="width:100px;">');

      if (picArr.length > 3) {
        picArr.pop();
        $('#imgBox img:last-of-type').remove();
      }
      if (picArr.length === 3) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID')
      }
    }
  })

  //5 表单校验
  $('#form').bootstrapValidator({

    excluded: [],

    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存格式, 必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码格式, 必须是 xx-xx格式, xx为两位数字, 例如 36-44'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  })

  //6 注册表单校验成功事件 

  $('#form').on('success.from.bv',function(e){
    e.preventDefault();

    var paramsStr = $('#form').serialize();

    paramsStr += "&picName1" + picArr[0].picName + "&picAddr1=" + picArr[0].picArr;
    paramsStr += "&picName2" + picArr[1].picName + "&picAddr2=" + picArr[1].picArr;
    paramsStr += "&picName3" + picArr[2].picName + "&picAddr3=" + picArr[2].picArr;

    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: paramsStr,
      dataType: 'json',
      success: function(info){
        if(info.success) {
          $('#addModal').modal('hide');
          currentPage = 1;
          render();
          $('#form').data('bootstrapValidator').reseetForm(true);

          $('#dropdownText').text('请选择二级分类');
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })



})