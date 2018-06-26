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
})