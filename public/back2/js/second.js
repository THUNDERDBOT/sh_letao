/**
 * Created by Jepson on 2018/6/26.
 */

$(function() {

  // 1. 一进入页面, 发送 ajax 请求, 获取数据, 进行页面渲染
  var currentPage = 1;
  var pageSize = 5;
  render();

  function render() {
    // 发送 ajax
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        // 通过 template 方法生成 html字符串
        var htmlStr = template( "tpl", info );
        $('tbody').html( htmlStr );

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


  // 2. 点击添加分类按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送 ajax 请求, 获取下拉菜单的数据, 进行渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      // 通过加载第一页, 100条数据, 模拟获取所有的一级分类数据
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info )
        var htmlStr = template("dropdownTpl", info);
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });


  // 3. 给 dropdown-menu 注册委托事件, 让 a 可以被点击
  $('.dropdown-menu').on("click", "a", function() {

    // 获取选中的文本, 设置给上面按钮中的内容
    var txt = $(this).text();
    $('#dropdownTxt').text( txt );
  });

})
