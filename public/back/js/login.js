/**
 * Created by tz on 2018/6/25.
 */


//1 进行表单校验配置
//校验要求：用户名不能为空，长度为2-6位 密码不能为空 长度6-12位

$(function(){
  //表单校验初始化
  $('#form').bootstrapValidator({

    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',//校验成功
      invalid: 'glyphicon glyphicon-remove',//检验时报
      validating: 'glyphicon glyphicon-refresh'//校验中
    },


    //指定校验字段
    fields: {
      username:{
        //配置校验规则
        validators: {
          //配置非空校验
          notEmpty: {
            message: "用户名不能为空"
          },
          //配置长度校验
          stringLength: {
            min:2,
            max:6,
            message: "用户名长度必须在2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        //配置校验规则
        validators: {
          //配置非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          //配置长度校验
          stringLength: {
            min:6,
            max:12,
            message: "用户名长度必须在6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });


//使用 submit 按钮，进行提交，表单校验插件，会在提交时，进行校验(1) 如果校验成功, 会默认提交这次请求, 会进行跳转, 我们需要阻止这次提交, 通过 ajax 提交
//*    (2) 如果校验失败, 会提示用户, 输入有误
//需要注册表单校验成功事件，在成功事件内，阻止默认的表单提交，通过ajax进行提交

$('#form').on('success.form.bv',function(e){
  //阻止默认的表单提交
  e.preventDefault();

  console.log('组织了默认的表单提交，通过ajax提交');

  //通过Ajax进行提交
  $.ajax({
    type: "post",
    url: "/employee/employeeLogin",
    //表单序列化，快速提交表单内容，进行提交，input必须设置name 属性
    data: $('#form').serialize(),
    dataType: "json",
    success: function( info ){
      console.log(info);
      if( info.success ) {
        //如果登入成功，跳转到首页
        location.href = "index.html";
      }

      if( info.error ===1000 ) {
        //alert("用户名不存在");
        //将username的检验状态配置成失败状态，并提示用户名不存在
        $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback")
      }
      if( info.error === 1001 ) {
        //alert("密码错误");
        // 将 password 的校验状态, 置成 校验失败状态, 并提示 密码错误
        // updateStatus的参数
        // 1. 字段名
        // 2. 校验状态, VALID 校验成功  INVALID 校验失败  NOT_VALIDATED 未校验
        // 3. 配置提示信息, 需要传校验规则
        $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
      }
    }
  })
})




//3 重置表单bug 重置表单不仅要重置内容，还要重置校验状态
  $('[type="reset"]').click(function(){
    //调用插件提供的方法，进行重置校验状态
    //var validator = $("#form").data('bootstrapValidator');  //获取表单校验实例
    $('#form').data("bootstrapValidator").resetForm();
  })

});

