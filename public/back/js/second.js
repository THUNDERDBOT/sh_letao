/**
 * Created by tz on 2018/6/26.
 */
$(function(){
  //1 一进入页面，发送ajax 请求，获取数据，进行页面渲染
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(info) {
        console.log(info);
        var strHtml = template("tpl",info);
        $('tbody').html(strHtml);

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil( info.total / info.size ),
          currentPage: info.page,
          // 添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新 currentPage
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  }

  //2 点击添加分类按钮，显示模态框
  $('#addBtn').click(function(){
    $('#addModal').modal("show");

    //发送ajax请求，获取下拉菜单的数据，进行渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      //通过加载第一页，100条数据，模拟获取所有的一级分类数据
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        var htmlStr = template("dropdownTpl",info);
        $('.dropdown-menu').html(htmlStr);
      }
    })
  })

  //3 给dropdown-menu 注册委托事件，让a 可以被点击
  $('.dropdown-menu').on('click',"a",function(){
    //获取选中的文本，设置给上面按钮中的内容
    var txt = $(this).text();
    $('#dropdownTxt').text(txt);

    //获取id。设置name = "categoryId" 的input框
    var id = $(this).data("id");
    $('[name="categoryId"]').val(id);

    // 用户选择了一级分类后, 需要将 name="categoryId" input 框的校验状态置成 VALID
    //参数1：字段名，参数2：设置成什么状态，参数3 ：回调（配置提示信息）
    $('#form').data("bootstrapValidator").updateStatus("categoryId","VALID")
  });

  //4  进行 jquery-fileupload 实例化, 里面配置图片上传后的回调函数
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result.picAddr);//上传后得到的图片地址
      var picUrl = data.result.picAddr;
      //设置图片地址给图片
      $("#imgBox img").attr("src",picUrl);

      //将图片地址存在name="brandLogo"的input框中
      $('[name="brandLogo"]').val(picUrl);

      //手动将表单校验状态重置成VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");

    }
  });


  //5. 通过表单校验插件实现表单校验功能
  $('#form').bootstrapValidator({
    //使用表单校验插件
    //$("#form").bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],
    //. 指定校验时的图标显示，配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
  //配置字段
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
            message: "请输入二级分类"
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

  });

  //6. 注册表单校验成功事件，阻止默认提交，通过Ajax提交
  $('#form').on("success.form.bv",function(e){
    e.preventDefault();

    //通过Ajax进行提交
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("#form").serialize(),
      dataType: "json",
      success: function(info){
        console.log(info);
        if(info.success){
          //添加成功 关闭模态框 重置表单内容
          $("#addModal").modal("hide");
          $("#form").data("bootstrapValidator").resetForm( true );
          //重新渲染第一页
          currentPage = 1;
          render();

          //由于下拉框和表单不是表单，需要手动设置
          $('#dropdownTxt').text("请选择一级分类");
          $('#imgBox img').attr("src","images/none.png");
        }
      }
    })
  })




})