function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


function smoothScrollTo(obj) {
    let header_height = document.querySelector('header').offsetHeight;
    $('html, body').animate({
            scrollTop: $($(obj).attr('href')).offset().top - header_height,
        },
        500,
        'linear'
    )
}

String.prototype.value_strim = function () {
    return $('<textarea />').html(this).text().trim();
}

function strip_html(myString) {
    return myString.replace(/<[^>]*>/gm, '');
}

function remove_tags(html) {
    var html = html.replace(/<em>/g, "||em||");
    html = html.replace(/<\/em>/g, "||/em||");
    html = strip_html(html);
    html = htmlEncode(html);
    html = html.replace(/\|\|em\|\|/g, "<em class=\"text-highlight\">");
    html = html.replace(/\|\|\/em\|\|/g, "</em>");
    return html;
}

function htmlEncode(s) {
    var el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}

function textNormal(s) {
    s = s.trim().replace(/ +/i, ' ');
    return s;
}

function getDateString(daysBefore = 0) {
    let ourDate = new Date();

    //Change it so that it is 7 days in the past.
    let pastDate = ourDate.getDate() - daysBefore;
    ourDate.setDate(pastDate);
    let yyyy = ourDate.getFullYear()
    let mm = ourDate.getMonth() + 1; // getMonth() is zero-based
    let dd = ourDate.getDate();
    mm = mm >= 10? mm : '0'+mm;
    dd = dd >= 10? dd : '0'+dd;
    return [yyyy, mm, dd].join('-');
}

function jump_to_search(s) {
    window.location.href = '/search.html' + '?s=' + s;
}

function jump_to_doc(id) {
    window.location.href = '/detail/?id=' + id
}

function push_toast(target, delay, autohide, title = "", message = "", dateStr = "", imgSrc = "") {
    let toast = document.createElement('div');
    toast.classList.add('toast');
    [{
            'key': 'role',
            'value': 'alert'
        },
        {
            'key': 'aria-atomic',
            'value': 'true'
        },
        {
            'key': 'data-delay',
            'value': delay === undefined ? 1000 : delay
        },
        {
            'key': 'data-autohide',
            'value': autohide === undefined ? 'true' : autohide
        }
    ].forEach(obj => {
        toast.setAttribute(obj.key, obj.value);
    })
    toast.innerHTML = '<div class="toast-header">\
      <img src="' + imgSrc + '" class="rounded mr-2">\
      <strong class="mr-auto">' + title + '</strong>\
      <small>' + dateStr + '</small>\
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">\
        <span aria-hidden="true">&times;</span>\
      </button>\
    </div>\
    <div class="toast-body">' + message + '</div>';

    target.appendChild(toast);
    $(toast).toast('show');
}

class Modal {
    constructor(title, message) {
        this.html = '<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">\
    <div class="modal-dialog" role="document">\
      <div class="modal-content">\
        <div class="modal-header">\
          <h5 class="modal-title" id="exampleModalLabel">' + title + '</h5>\
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
            <span aria-hidden="true">&times;</span>\
          </button>\
        </div>\
        <div class="modal-body">' + message + '</div>\
        <div class="modal-footer">\
        </div>\
      </div>\
    </div>\
  </div>';
        this.mod = $(this.html);
        this.yes_btn = $('<button type="button" class="btn btn-primary">确定</button>');
        this.no_btn = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>');
        this.mod.find('.modal-footer').append(this.yes_btn);
        this.mod.find('.modal-footer').append(this.no_btn);
        $('body').append(this.mod);
    }
    enable(options = {}, call_on_yes, call_on_reject) {
        // options: backdrop, keyboard, focus, show
        let cur = this.mod;
        cur.modal(options);
        this.yes_btn.off('click').on('click', function () {
            if ($(this).hasClass('disabled'))
                return;
            if (typeof call_on_yes === 'function')
                call_on_yes();
            $(this).addClass('disabled');
        });
        this.no_btn.off('click').on('click', function () {
            if (typeof call_on_reject === 'function')
                call_on_reject();
        });
    }
}



class AjaxHandler {
    constructor() {}
    get(url, call_on_sucess, call_on_error) {
        $.ajax({
            url: url,
            dataType: "json",
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                if (typeof call_on_error === 'function')
                    call_on_error(status);
            },
            success: function (data, status, xhr) {
                if (typeof call_on_sucess === 'function')
                    call_on_sucess(data, status, xhr);
            }
        });
    }

    post(url, _data, call_on_sucess, call_on_error) {
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'post',
            data: JSON.stringify(_data),
            contentType: 'application/json',
            success: function (data, textStatus, jQxhr) {
                if (typeof call_on_sucess === 'function')
                    call_on_sucess(data, textStatus, jQxhr);
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
                if (typeof call_on_error === 'function')
                    call_on_error(status);
            }
        });
    }
}


const removeEmpty = obj => {
    Object.keys(obj).forEach(key => {
      if (obj[key] == null || obj[key] == "") delete obj[key]; // delete
      else if (obj[key] && typeof obj[key] === "object") removeEmpty(obj[key]); // recurse
    });
  };