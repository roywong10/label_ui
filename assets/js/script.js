

(function(){
    
    const CONFIG = {
        api_url: 'http://127.0.0.1:4567',
        top_label_url : 'http://127.0.0.1:4567/label/get_top/v0.1',
        children_label_url : 'http://127.0.0.1:4567/label/get_children/v0.1',
    }

    // 用于记录当前的状态，所有的re-render都基于此state的更新
    const STATE = {
        top_labels : [],
        current_top_label : null,
        current_child_labels : []
    };

    // 创建一个事件 用户top label 切换后重新render child labels
    const current_top_label_change = new Event('label_change');

    //按照升序排列
    function up(x,y){
        return Date.parse(x.created_date) - Date.parse(y.created_date);
    }
    
    // ===============start here
    // 获取top label 的 处理
    let get_top_labels_hanlder = (jsonData, textStatus, xhr) => {
        // ajax 获取成功
        if(xhr.status === 200){
            // 清空top labels state
            STATE.top_labels = []
            // 逐个label进行处理

            jsonData.data.map((label, index) => {
                let cur = new Label(label, index);
                STATE.top_labels.push(cur);
                // 创建此label 的html dom 元素
                let html = $('<li class="nav-item">\
                    <a class="nav-link top-label" tar="'+index+'" role="tab"> '+cur.label_name+'</a>\
                </li>');
                cur.dom = html;
                // 在 myTab下对该label 进行render
                $('#myTab').append(cur.dom);
                // 对当前 label 的 dom元素注册一个点击事件，当被点击后，切换STATE中 current top label 状态
                cur.dom.on('click', function (e) {
                    STATE.current_top_label = cur;
                    $('a.nav-link.active').removeClass('active');
                    STATE.current_top_label.dom.find('a.nav-link').addClass('active');
                    // 发送当前 top label 已改变的事件，让事件注册者感知并及时获取新的 child labels
                    document.querySelector('body').dispatchEvent(current_top_label_change);
                })
            });
            if(STATE.top_labels.length && STATE.current_top_label === null) {
                // 如果没有active 的top label，默认为第一个
                STATE.current_top_label = STATE.top_labels[0];
                $('a.nav-link.active').removeClass('active');
                STATE.current_top_label.dom.find('a.nav-link').addClass('active');
                document.querySelector('body').dispatchEvent(current_top_label_change);
            }
        }    
    }

    // child label 获取成功后的处理
    let get_child_labels_handler = (jsonData, textStatus, xhr) => {
        if(xhr.status === 200) {
            STATE.current_child_labels = []
            $('.label-list tbody').html('');
            jsonData.data.sort(up);
            jsonData.data.map((label, index) => {
                let cur = new Label(label, index);
                STATE.current_child_labels.push(cur);
                let html = $(
                    '<tr>\
                    <th scope="row">'+cur.index+'</th>\
                    <td>'+cur.label_name+'</td>\
                    <td><button class="btn btn-primary"'+'id="btn"'+cur.index +'>修改</button></td>\
                  </tr>'
                )
                cur.dom = html;
                // 逐个render child label
                $('.label-list tbody').append(cur.dom);
                cur.dom.on('click', function(e){
                    const param = {
                        label_id : cur.label_id,
                        label_name : cur.label_name
                    }
                    const params = JSON.stringify(param);
                    localStorage.setItem('params', params);
                    window.location.href="update_label.html";
                })

            })

        }
    }

    // 注册 top label 切换的处理事件，获取新的child label
    $('body').on('label_change', function(){
        let parent = STATE.current_top_label.label_id;
        get_children(parent, get_child_labels_handler);
    })
    
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

    function get_children(parent_id, call_on_success, call_on_error){
        let url = CONFIG.children_label_url;
        let post_data = {
            label_id: parent_id
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
                    jsonData.data.sort(up);
                    call_on_success(jsonData, textStatus, xhr);
                }
            }, 
            data: JSON.stringify(post_data)
        })
    } 


})()    