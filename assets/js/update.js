
(function(){

    const param = JSON.parse(localStorage.params);

    const CONFIG = {
        api_url: 'http://127.0.0.1:4567',
        top_label_url : 'http://127.0.0.1:4567/label/get_top/v0.1',
        children_label_url : 'http://127.0.0.1:4567/label/get_children/v0.1',
        label_info_url : 'http://127.0.0.1:4567/label/get/v0.1',
        label_update_url : 'http://127.0.0.1:4567/label/update/v0.1'
    }

    // 用于记录当前的状态，所有的re-render都基于此state的更新
    const STATE = {
        top_labels : [],
        current_top_label : null,
        current_child_labels : []
    };


    // 创建一个事件 用户top label 切换后重新render child labels
    const current_top_label_change = new Event('label_change');


    // ===============functions
    // 为每个label 构建一个类
    class Label {
        constructor(l) {
            // this.index = index;
            this.label_id = l.label_id;
            this.label_info = l.label_info;
            this.label_name = l.term.term_name;
            this.parent = l.parent == null ? null : l.parent.label_id;
            this.created_date = l.created_date;
            this.modified_date = l.modified_date;
            this.dom = null;
        }
    }

// 成功获取label的信息之后，把信息展示在页面上
    let get_label_handler = (jsonData, textStatus, xhr) => {
        if(xhr.status === 200) {
            let cur = new Label(jsonData.data);    
            let html = $('<span>'+ cur.label_name + '</span>')    
                cur.dom = html;
                $('#label_name').append(cur.dom);

            cur.label_info.map((info, index) => {
                let selector = '#'+info.key
                $(selector).val(info.value);
            })
            
        }
    }


    // 把页面上的信息，整理成label_info的形式
    // 一旦form提交，便提交至update_label的接口,实现更新label的操作
    $("#update").on('click',function(e){
        
        var form = document.getElementById("update-form");  
        var label_info = [];  
        var infos = form.getElementsByTagName('input');
        var infos_2 = form.getElementsByTagName('textarea')  
        for (var j = 0; j < infos.length; j++){ 
             label_info.push({"key":infos[j].name, "value":infos[j].value});      
         } 
         for (var i = 0; i < infos_2.length; i++){ 
             label_info.push({"key":infos_2[i].name, "value":infos_2[i].value});     
         } 
         update_label_info(label_info);

    })

    //点击取消按钮
    $("#cancel").on('click', function(e){
        alert('取消');
        get_label_info(get_label_handler);

    })



// 
get_label_info(get_label_handler);

// 用来获取label的信息
function get_label_info(call_on_success, call_on_error){
        let url = CONFIG.label_info_url;
        let post_data = {
            label_id: param.label_id,
        }
        $.ajax({
            url: url,
            dataType: "json",
            contentType: 'application/json',
            type: "post",
            error: function (xhr, status) {
                if (typeof call_on_error === "function") {
                    call_on_error(status);
                }
            },
            success: function (jsonData, textStatus, xhr) {
                if (typeof call_on_success === "function") {

                    call_on_success(jsonData, textStatus, xhr);
                }
            }, 
            data: JSON.stringify(post_data)
        })
    }

// 用来更新label的信息
function update_label_info(new_label_info, call_on_success, call_on_error){
    let url = CONFIG.label_update_url;
        let post_data = {
            label_id : param.label_id,
            label_info: new_label_info
        }
        $.ajax({
            url: url,
            dataType: "json",
            contentType: 'application/json',
            type: "post",
            error: function (xhr, status) {
                alert("error");
                if (typeof call_on_error === "function") {
                    call_on_error(status);
                }
            },
            success: function (jsonData, textStatus, xhr) {
                alert("success");
                if (typeof call_on_success === "function") {
                    call_on_success(jsonData, textStatus, xhr);
                }
            }, 
            data: JSON.stringify(post_data)
        })

}

})()    