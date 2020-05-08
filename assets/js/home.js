

// (function(){
//     const CONFIG = {
//         api_url: ' http://127.0.0.1:4567/',
//         statistic_toast: document.querySelector('#statistic-display'),
//         notification_toast: document.querySelector('#notification-display')
//     }

//     const STATE = {
//     };

//     get_doc_count('',null,null,null,total_doc_count_handler);

//     let week_before = getDateString(7);
//     let month_before = getDateString(30);
//     get_doc_count('', week_before, null, null, week_doc_update_count_handler )

//     get_doc_notification('', '', month_before, null, null, 30, notification_carousel_hanlder);

//     function notification_carousel_hanlder(data){
//         const notis = data['data'];
//         let index = 0;
        
//         let do_toast = function(){
//             if(index < notis.length){
//                 let id = notis[index]._source.id;
//                 let title = notis[index]._source.title.value;
//                 let last_modify = notis[index]._source.modifiedDate;
//                 push_toast(CONFIG.notification_toast, '2500', 'true', id, title, last_modify );
//                 index+=1;
//             }else{
//                 index = 0;
//             }
//         }

//         do_toast()

//         let inter = setInterval(() => {
//             do_toast()
//         }, 3000);
//     }

//     function week_doc_update_count_handler(data){
        
//         push_toast(CONFIG.statistic_toast, '500', 'false', '本周新进文章数', '总数: '+data.count);
//     }

//     function total_doc_count_handler(data){
//         push_toast(CONFIG.statistic_toast, '500', 'false', '存储的文章总数', '总数: '+data.count);
//     }
    
//     function get_doc_notification(cats='', tags='', start, end, dateOption, size, call_on_success, call_on_error){
//         let url = CONFIG.api_url + 'notification/v0.1?cats='+cats;
//         if(tags) url+= '&tags='+tags;
//         if(start) url+= '&start_date='+start;
//         if(end) url+= '&end_date='+end;
//         if(size) url+= '&size='+size;
//         if(dateOption) url+= '&date_option='+dateOption;
//         $.ajax({
//             url: url,
//             dataType: "json",
//             error: function (xhr, status) {
//                 if (typeof call_on_error === "function") {
//                     call_on_error();
//                 }
//             },
//             success: function (data, status, xhr) {
//                 if (typeof call_on_success === "function") {
//                     call_on_success(data);
//                 }
//             }
//         })
//     } 

//     function get_doc_count(cats='', start, end, dateOption, call_on_success, call_on_failed){
//         let url = CONFIG.api_url + 'statistic/doc/v0.1?cats='+cats;
//         if(start) url+= '&start_date='+start;
//         if(end) url+= '&end_date='+end;
//         if(dateOption) url+= '&date_option='+dateOption;
//         $.ajax({
//             url: url,
//             dataType: "json",
//             error: function (xhr, status) {
//                 if (typeof call_on_error === "function") {
//                     call_on_error();
//                 }
//             },
//             success: function (data, status, xhr) {
//                 if (typeof call_on_success === "function") {
//                     call_on_success(data);
//                 }
//             }
//         })
//     }

// })()    