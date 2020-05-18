
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
            // console.log(cur);
            // console.log(jsonData.data.term.term_name);       
            console.log(cur.label_name);
            let html = $('<span>'+ cur.label_name + '</span>')    
                cur.dom = html;
                // 逐个render child label
                $('#label_name').append(cur.dom);
        }
    }

// 获取页面上的label信息




// 
get_label_info(get_label_handler);

// 用来获取label的信息
function get_label_info(call_on_success, call_on_error){
        let url = CONFIG.label_info_url;
        let post_data = {
            label_id: param.label_id
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
function update_label_info(call_on_success, call_on_error){
    let url = CONFIG.label_update_url;
        let post_data = {
            label_info: label_info
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
     

    


})()    