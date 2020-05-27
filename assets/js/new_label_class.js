
(function(){
    
    const CONFIG = {
        api_url: 'http://127.0.0.1:4567',
        create_label_url : 'http://127.0.0.1:4567/label/create/v0.1',

    }


    // 一旦form提交，便提交至create_label的接口,实现创建label的操作
    $("#new").on('click',function(e){
        //先判断提交的信息是否为空：
        let label_name = document.getElementById('input-label-name').value;
        if (label_name.length == 0){
            alert('label name 不能为空！！！！');
        }
        else{
            create_label(get_new_label_class_hanlder);
        }
    });

    //点击取消按钮
    $("#cancel").on('click', function(e){
        alert('取消');
        $("#input-label-name").val("");

    })

    // 当label创建成功，跳转到新增信息页面
    let get_new_label_class_hanlder = (jsonData, textStatus, xhr) => {
        // ajax 获取成功
        if(xhr.status === 200){
            window.location.href="new_label.html";
        }    
    }


    // ajax 获取当前页面的label信息，并提交至create_label的接口，实现创建label_class的操作
    function create_label(call_on_success, call_on_error){
        let label_name = document.getElementById('input-label-name').value;
        let url = CONFIG.create_label_url;
        let post_data = {
            term_name : label_name
        }

        $.ajax({
            url: url,
            dataType: "json",
            contentType: 'application/json',
            type: "post",
            error: function (xhr, status) {
                alert('error!');
                if (typeof call_on_error === "function") {
                    call_on_error(status);
                }
            },
            success: function (jsonData, textStatus, xhr) {
                alert('success!');                
                if (typeof call_on_success === "function") {
                    
                    call_on_success(jsonData, textStatus, xhr);
                }
            }, 
            data: JSON.stringify(post_data)
        })
    }

})()    