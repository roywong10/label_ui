
(function(){
    
    const CONFIG = {
        api_url: 'http://127.0.0.1:4567',
        top_label_url : 'http://127.0.0.1:4567/label/get_top/v0.1',
        create_label_url : 'http://127.0.0.1:4567/label/create/v0.1',

    }

    // 用于记录当前的状态，所有的re-render都基于此state的更新
    const STATE = {
        test : 'test is ok',
        top_labels : [],
        current_top_label : null,
        current_child_labels : []
    };

    // 创建一个事件 用户top label 切换后重新render child labels
    const current_top_label_change = new Event('label_change');

    
    // ===============start here
    // 获取top label 的 处理
    let get_top_labels_hanlder = (jsonData, textStatus, xhr) => {

        // ajax 获取成功
        if(xhr.status === 200){
            jsonData.data.map((label, index) => {
                let cur = new Label(label, index);
                STATE.top_labels.push(cur);

                let html = $('<option value="'+index+'">'+cur.label_name+'</option>')
                cur.dom = html;
                // 在 inputGroupSelect04下，添加所有label
                $('#inputGroupSelect04').append(cur.dom);
            });
            // 如果没有发生点击下拉框的事件，current_top_label默认为第一个label
            STATE.current_top_label = jsonData.data[0];
            // 当发生了点击下拉框，选中某个label时,current_top_label要做出对应的改变
             $('#inputGroupSelect04').on('change', function(e) {
                                    
                    // 添加current_top_label
                    let objs = document.getElementById("inputGroupSelect04");
                    let index = objs.options[objs.selectedIndex].value;
                    STATE.current_top_label = jsonData.data[index];
                    console.log(STATE.current_top_label);
                })

        }    
    }

    // 当label创建成功，跳转到新增信息页面
    let get_new_label_hanlder = (jsonData, textStatus, xhr) => {
        // ajax 获取成功
        if(xhr.status === 200){
            const param = {
                        label_id : jsonData.data.label_id
                    }
                    const params = JSON.stringify(param);
                    localStorage.setItem('params', params);
                    window.location.href="update_label.html";

        }    
    }


    
    // init 处理，获取top labels
    get_top_labels(get_top_labels_hanlder);


    // ===============functions
    // 为每个label 构建一个类
    class Label {
        constructor(l, index) {
            this.index = index;
            this.label_id = l.label_id;
            this.label_info = l.label_info;
            this.label_name = l.term.term_name;
            this.parent = l.parent == null ? null : l.parent.label_id;
            this.created_date = l.created_date;
            this.modified_date = l.modified_date;
            this.dom = null;
        }
    }

    // ajax 获取api数据，并预留两个 callback 函数用于获取后的数据处理
    function get_top_labels(call_on_success, call_on_error){
        let url = CONFIG.top_label_url;
        $.ajax({
            url: url,
            dataType: "json",
            error: function (xhr, status) {
                if (typeof call_on_error === "function") {
                    call_on_error(status);
                }
            },
            success: function (jsonData, textStatus, xhr) {
                if (typeof call_on_success === "function") {
                    call_on_success(jsonData, textStatus, xhr);
                }
            }
        })
    } 


    // 一旦form提交，便提交至create_label的接口,实现创建label的操作
    $("#new").on('click',function(e){
        //先判断提交的信息是否为空：
        let label_name = document.getElementById('input-label-name').value;
        if (label_name.length == 0){
            alert('label name 不能为空！');
        }
        else{
            // 当提交的信息不为空时，创建label，并跳转页面
            create_label(get_new_label_hanlder);

        }
    });

    //点击取消按钮
    $("#cancel").on('click', function(e){
        alert('取消');
        $("#input-label-name").val("");

    })

    //点击新增按钮，跳转到新增top_label的页面
    $("#new_top_label").on('click', function(e){
        window.location.href="new_label_class.html";
    })


    // ajax 获取当前页面的label信息，并提交至create_label的接口，实现创建label的操作
    function create_label(call_on_success, call_on_error){
        let label_name = document.getElementById('input-label-name').value;
        let top_parent_id = STATE.current_top_label.label_id;
        let url = CONFIG.create_label_url;
        let post_data = {
            parent: top_parent_id,
            term_name : label_name
        }


        $.ajax({
            url: url,
            dataType: "json",
            contentType: 'application/json',
            type: "post",
            error: function (xhr, status) {
                alert('error!')
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