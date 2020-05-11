
(function(){
    console.log('uploads is OK!');
    const CONFIG = {
        api_url: 'http://127.0.0.1:4567',
        top_label_url : 'http://127.0.0.1:4567/label/get_top/v0.1',
        create_label_url : 'http://127.0.0.1:4567/label/create/v0.1',

    }

    // 用于记录当前的状态，所有的re-render都基于此state的更新
    const STATE = {
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
            // 清空top labels state
            STATE.top_labels = []
            // 对所有label进行处理
            jsonData.data.map((label, index) => {
                let cur = new Label(label, index);
                STATE.top_labels.push(cur);
                let html = $('<option value="'+index+'">'+cur.label_name+'</option>')
                cur.dom = html;
                // 在 inputGroupSelect04下，添加所有label
                $('#inputGroupSelect04').append(cur.dom);
            });
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
        console.log('ajax get_top_labels is OK!')
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


    // ajax 获取当前页面的label信息，并提交至create_label的接口，实现创建label的操作
    function create_label(){
        let label_name = document.getElementById('input-label-name').value;
        alert(label_name);
        // 测试下有没有调用成功
        console.log('create_label is OK!')
    }
    //create_label();
})()    