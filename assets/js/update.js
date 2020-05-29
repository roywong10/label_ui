
(function(){
    $(document).ready(function () {
    $('.datepicker').datepicker({
    format: 'yyyy-mm-dd'
        });
    });
    
    
    const param = JSON.parse(localStorage.params);

    const CONFIG = {
        top_label_url : label_origin+'/label/get_top/v0.1',
        children_label_url : label_origin+'/label/get_children/v0.1',
        label_info_url : label_origin+'/label/get/v0.1',
        label_update_url : label_origin+'/label/update/v0.1'
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
            
            $('#label_name').append(cur.label_name);
            if (cur.label_info != null) {
                    cur.label_info.map((info, index) => {
                            let selector = '#'+info.key
                            $(selector).val(info.value);
                        })} 
            //其中zone-under-attack和industry-under-attack是特殊字段
            //是selectpicker，需要特殊的显示方法
            if (cur.label_info != null){
                $('#zone-under-attack').selectpicker('val', cur.label_info[9].value);
                $('#industry-under-attack').selectpicker('val', cur.label_info[10].value);
            }
            
        }
    }


    // 把页面上的信息，整理成label_info的形式
    // 一旦form提交，便提交至update_label的接口,实现更新label的操作
    $("#update").on('click',function(e){
        
        var form = document.getElementById("update-form");  
        var label_info = [];  
        
        label_info.push({"key":"introduction-ch", "value":$('#introduction-ch').val()});  
        label_info.push({"key":"introduction-en", "value":$('#introduction-en').val()});
        label_info.push({"key":"alias", "value":$('#alias').val()});  
        label_info.push({"key":"first-discover-time", "value":$('#first-discover-time').val()});
        label_info.push({"key":"latest-discover-time", "value":$('#latest-discover-time').val()});
        label_info.push({"key":"technical-detail", "value":$('#technical-detail').val()}); 
        label_info.push({"key":"blackmail-detail", "value":$('#blackmail-detail').val()}); 
        label_info.push({"key":"decryption", "value":$('#decryption').val()}); 
        label_info.push({"key":"currency-type", "value":$('#currency-type').val()});  
        label_info.push({"key":"zone-under-attack", "value":$('#zone-under-attack').val()});
        label_info.push({"key":"industry-under-attack", "value":$('#industry-under-attack').val()});
        label_info.push({"key":"advise", "value":$('#advise').val()}); 

         if (check_label_info(label_info)!= false){
            console.log('提交的信息为：');
            console.log(label_info);
            update_label_info(label_info);
         }
         

    })
    //校验更新的label_info是否正确
    function check_label_info(label_info){
        // 下面是判断时间
        let to = new Date();
        let today = to.getTime();

        let first_day = new Date(label_info[3].value).getTime();
        let lastest_day = new Date(label_info[4].value).getTime();

        if (first_day > lastest_day){ 
            alert('时间错误，首次发现的时间晚于末次发现的时间');
            return false;
        }

        if(lastest_day > today){
            alert('时间错误，末次发现时间不得晚于今天');
            return false;
        }

        if(first_day > today){
            alert('时间错误，首次发现时间不得晚于今天');
            return false;
        }
        // 下面是判断多选框，是否同时选中‘不需要此字段’和其他选项
        // 若同时选中，则返回false

        let zone_info = label_info[9].value;
        if (zone_info.length > 1 && zone_info.includes('unnecessary')){
            alert('不能同时选中“不需要此字段”和其他字段');
            return false;
        }
        let industry_info = label_info[10].value;
        if (industry_info.length > 1 && industry_info.includes('unnecessary')){
            alert('不能同时选中“不需要此字段”和其他字段');
            return false;
        }

    }


    //点击取消按钮
    $("#cancel").on('click', function(e){
        alert('取消');
        get_label_info(get_label_handler);
        window.location.href="index.html";

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
                window.location.href="index.html";
            }, 
            data: JSON.stringify(post_data)
        })

}

})()    