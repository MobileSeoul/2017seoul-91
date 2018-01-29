
// Initialize your app
var myApp = new Framework7({
    modalTitle: '오늘도 서울',
    material: isAndroid ? true : false,
    // Enable Template7 pages
    template7Pages: true,
    pushState: true
});

var isAndroid = Framework7.prototype.device.android === true;


// Export selectors engine
var $$ = Dom7;
// Change Through navbar layout to Fixed
if (isAndroid) {
    // Change class
    $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
    // And move Navbar into Page
    $$('.view .navbar').prependTo('.view .page');
}
 


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('index', function (page) {
    // run createContentPage func after link was clicked


});

myApp.onPageInit('linkDetailView', function (page) {
    // run createContentPage func after link was clicked

});


// 서울시 12개 분야 새소식 정보
var newsKey = '516a736b4d69616d31304a77764768';
// 서울시 문화 행사 정보
var cultureKey = '725853687069616d3130335374486d56';
// 서울시 미세 먼지
var airInfoKey = '685561537769616d3537704d4c7574';
// 서울시 일자리
var jobKey = '4761504c4c69616d3833644f564652';

// 공공데이터 포탈 키
const commonServiceKey = '3CUnKdEh3QjU+i/kTH3KAdj9nbe+zk9FtYymsgDK5VB7a1WnbqCzkibZJN80GXwDzXILTyZCBch6lF74sMlEYg==';

$$(document).on('DOMContentLoaded', function (e) {
  //  document.addEventListener("deviceready", function () {
    var ptrContent = $$('.pull-to-refresh-content');
    
   // Add 'refresh' listener on it
   ptrContent.on('ptr:refresh', function (e) {
       setTimeout(function(){
           window.location.reload(true);
       }, 0);
   });      

    var apiList = myApp.formGetData('apiList');
    myApp.formStoreData('apiList', {
        // itemCd : 1 - 더보기, 0 - 더보기 아님
        'items': [
            {
                'title': '날씨', 'iconNm': 'weather', 'useYn': false,
                'func': 'getWeather()', 'itemCd' : 0
            }, {
                'title': '서울 소식', 'iconNm': 'weather', 'useYn': false,
                'func': 'getNews()', 'itemCd' : 1
            }, {
                'title': '문화행사', 'iconNm': 'weather', 'useYn': false,
                'func' : 'getCulture()', 'itemCd' : 1

            }, {
                'title': '버스도착정보', 'iconNm': 'bus', 'useYn': false,
                'func' : 'getBus()', 'itemCd' : 1

            }
        ]
    });

    var useList = myApp.formGetData('useList');
    if (useList == undefined || useList == null) {
        myApp.formStoreData('useList', {
            'items': [
                /*            
                 {
                    'title': '서울 소식', 'iconNm': 'weather', 'useYn': true,
                    'func': 'getNews()', 'itemCd' : 1
                }
                */
            ]
        });
    }


    // itemSetting
    $$('.popup-itemAddPopup').on('popup:open', function () {
        var useList = myApp.formGetData('useList').items;
        var apiList = myApp.formGetData('apiList').items;

        var tmpUseList = useList.slice();
        var tmpApiList = apiList.slice();

        setItemList(tmpUseList, tmpApiList);

    });

    $$('.popup-itemAddPopup').on('popup:closed', function () {
        window.location.reload(true);
    });

    setMainList(useList.items);
/*
    $$('[name=day_0]').parents('td').on('click', function(){
        $$('.swiper-slide').hide(200);
        $$('.swiper-slide.current').show();  
        $$('.weatherTd').find('span').css('color', '#000');
        $$('.weatherTd').css('border-bottom', '');
        $$(this).find('span').css('color', 'blue');
        $$(this).css('border-bottom', 'solid 1px blue');
    });
  */  $$('[name=day_1]').parents('td').on('click', function(){
        $$('.swiper-slide').hide(200);
        $$('.swiper-slide.today').show();
        $$('.weatherTd').find('span').css('color', '#000');
        $$('.weatherTd').css('border-bottom', '');
        $$(this).find('span').css('color', 'blue');
        $$(this).css('border-bottom', 'solid 1px blue');
    });
    $$('[name=day_2]').parents('td').on('click', function(){
        $$('.swiper-slide').hide();
        $$('.swiper-slide.tomorrow').show();
        $$('.weatherTd').find('span').css('color', '#000');
        $$('.weatherTd').css('border-bottom', '');
        $$(this).find('span').css('color', 'blue');
        $$(this).css('border-bottom', 'solid 1px blue');
    });
    $$('[name=day_3]').parents('td').on('click', function(){
        $$('.swiper-slide').hide();
        $$('.swiper-slide.afterTomorrow').show();
        $$('.weatherTd').find('span').css('color', '#000');
        $$('.weatherTd').css('border-bottom', '');
        $$(this).find('span').css('color', 'blue');
        $$(this).css('border-bottom', 'solid 1px blue');
    });
   // Template7.module.init(); 
   // 수정하고 커밋하고 빌드 하고 실행 

//}, false);
});


function setItemList(useList, apiList) {
    $$('ul.usedItem li').remove();
    $$('ul.unusedItem li').remove();
    for (var i = 0; i < apiList.length; i++) {
        var isUsed = false;
        for (var j = 0; j < useList.length; j++) {
            if (apiList[i].title == useList[j].title) {
                apiList[i].useYn = true;
                //isUsed = true;
            } else {
                //apiList[i].useYn = false;
            }
        }
    }


    for (var i = 0; i < useList.length; i++) {

        var li = $$('<li />').addClass('swipeout');
        var contentDiv = $$('<div />').addClass('swipeout-content').addClass('item-content');
        var innerDiv = $$('<div />').addClass('item-inner');
        var titleDiv = $$('<div />').addClass('item-title');

        innerDiv.append(titleDiv);
        contentDiv.append(innerDiv);
        li.append(contentDiv);

        var deleteImgEl = $$('<img />').addClass('custom-icon-delete').attr('src', './img/list/delete.png').css('padding', '10px');;
        deleteImgEl.on('click', function (e) {
            // 삭제
            myApp.swipeoutOpen($$(this).parents('li'), 'right', function () {
            });
        });

        var itemImgEl = $$('<img />').addClass('custom-item-img').attr('src', './img/weather/snow.png');//.css('padding', '10px');
        var itemTitleSpan = $$('<span />').addClass('custom-item-title').css('margin-left','10px');
        itemTitleSpan.text(useList[i].title);

        var swipeoutDiv = $$('<div />').addClass('swipeout-actions-right').css('z-index', 10);
        var swipeoutA = $$('<a />').addClass('swipeout-delete').attr('href', '#').text('삭제').css('padding', '20px');
        swipeoutDiv.append(swipeoutA);

        var sortDiv = $$('<div />').addClass('sortable-handler');
        li.append(swipeoutDiv);


        var list = $$('ul.usedItem');
        titleDiv.append(deleteImgEl);
        li.append(sortDiv);
        //titleDiv.append(itemImgEl);
        titleDiv.append(itemTitleSpan);
        list.append(li);
    }


    for (var i = 0; i < apiList.length; i++) {
        if (apiList[i].useYn == true) { continue; }
        var li = $$('<li />').addClass('swipeout');
        var contentDiv = $$('<div />').addClass('swipeout-content').addClass('item-content');
        var innerDiv = $$('<div />').addClass('item-inner');
        var titleDiv = $$('<div />').addClass('item-title');

        innerDiv.append(titleDiv);
        contentDiv.append(innerDiv);
        li.append(contentDiv);

        var addImgEl = $$('<img />').addClass('custom-icon-add').attr('src', './img/list/add.png').css('padding', '10px');
        addImgEl.on('click', function (e) {
            // 추가
            var title = $$(this).parents('div.item-title').find('span').text();
            var deleteItemidx = 0;
            for (var i = 0; i < apiList.length; i++) {
                if (apiList[i].title == title) {
                    
                    deleteItemidx = i;
                    useList.push(apiList[i]);
                }
            }
            $$(this).parents('li div.item-title').animate({
                'margin-left': -1000
            });
            $$(this).parents('li').animate({
                'height': 0
            }, {
                    complete: function () {
                        setTimeout(function () {
                            setItemList(useList, apiList);
                        }, 50);

                    }
                }
            );

        });
        var itemImgEl = $$('<img />').addClass('custom-item-img').attr('src', './img/weather/snow.png');
        var itemTitleSpan = $$('<span />').addClass('custom-item-title').css('margin-left', '10px');
        itemTitleSpan.text(apiList[i].title);

        var swipeoutDiv = $$('<div />').addClass('swipeout-actions-right');
        var swipeoutA = $$('<a />').addClass('swipeout-delete').attr('href', '#').text('삭제');
        swipeoutDiv.append(swipeoutA);

        var sortDiv = $$('<div />').addClass('sortable-handler');
        li.append(swipeoutDiv);


        var list = $$('ul.unusedItem');
        li.removeClass('swipeout')
        titleDiv.append(addImgEl);

        //titleDiv.append(itemImgEl);
        titleDiv.append(itemTitleSpan);

        list.append(li);

    }

    // swipe delete action
    $$('.swipeout').on('swipeout:deleted', function () {
        $$(this).parents('div.list-block').addClass('sortable-opened');
        var title = $$(this).find('span').text();
        var deleteItemidx = 0;
        for (var i = 0; i < useList.length; i++) {
            if (useList[i].title == title) {
                if(title == '버스도착정보') {
                    myApp.formStoreData('busInfo', {
                        'items': []
                    });
                }
                deleteItemidx = i;
            }
        }
        delete useList[deleteItemidx];
        useList = useList.filter(function (n) { return n != undefined });

        for (var i = 0; i < apiList.length; i++) {
            apiList[i].useYn = false;
            for (var j = 0; j < useList.length; j++) {
                if (apiList[i].title == useList[j].title) {
                    apiList[i].useYn = true;
                }
            }

        }

        setItemList(useList, apiList);
    });

    $$('.swipeout').on('swipeout:open', function () {
        $$(this).parents('div.list-block').removeClass('sortable-opened');
    });

    $$('.swipeout').on('swipeout:close', function () {
        $$(this).parents('div.list-block').addClass('sortable-opened');
    });

    $$('div.sortable li').on('sortable:sort', function (e) {
        
        var startIdx = e.detail.startIndex;
        var newIdx = e.detail.newIndex;
        var tmpData = useList.slice(startIdx, startIdx + 1)[0];
        useList.splice(startIdx, 1);
        useList.splice(newIdx, 0, tmpData);
        
    });

    $$('.settingOk').on('click', function () {
        
        myApp.formStoreData('useList', {
            'items': useList
        });

        myApp.formStoreData('apiList', {
            'items': apiList
        });

        myApp.closeModal('.popup-itemAddPopup');
    });

}

function getCulture() {
//http://openAPI.seoul.go.kr:8088/(인증키)/xml/SearchConcertDetailService/1/20/23075/
    var div = $$('<div />');//;.addClass('list-block media-list');
    var ul = $$('<ul />').css('list-style','none').css('padding-left', '10px');
    $$.ajax({
        /*
        type: 'GET',
        dataType: 'jsonp',
        jsonp : "callback",
        data: data,
        async: false,
        origin: 'http://newsky2.kma.go.kr/',
        url: url + method,

        // jsonp 값을 전달할 때 사용되는 파라미터 변수명
        // 이 속성을 생략하면 callback 파라미터 변수명으로 전달된다.
        jsonp: 'stone',
        */
        url: 'http://openAPI.seoul.go.kr:8088/'+cultureKey+'/json/SearchConcertDetailService/1/20/',
        contentType: "OPTIONS",
        dataType : 'json',
        crossDomain: true,
        //data: data,
        async: false,
        success: function (json) {
            var items = json.SearchConcertDetailService.row;
    
            
            for(var i = 0; i < items.length; i++) {
                var el =$$($$('#culture').html());
                el.find('img').attr('src', items[i].MAIN_IMG).css('width','120px').css('height','120px');
                el.find('.itemTitle').html(items[i].TITLE);
                if(items[i].TITLE.length > 15) {
                    //el.find('.item-title').html(items[i].TITLE.substring(0, 14));
                }
                el.find('.place').html('<span style="font-weight:bold;">'+items[i].CODENAME+'</span> | ' + items[i].GCODE + ' | ' + items[i].PLACE);
                el.find('.item-inner').css('margin-left', '10px').css('line-height','23px').css('color', '#000').css('max-width', '200px');
                var msg = '';
                if(items[i].STRTDATE == items[i].END_DATE) {
                    msg = items[i].STRTDATE + ' ~ ' + items[i].END_DATE;
                    msg += '. ' + items[i].TIME;
                }else {
                    msg = items[i].STRTDATE;
                    msg += '. ' + items[i].TIME;
                }
                el.find('.date').text(msg);

            //el.find('.titmeTitle').on('click', function(){
                    // 템플릿을 복사해서
                    
                    var tmp = $$($$('.popup-news-0').html());
                    tmp.find('.card-header span.t1').text(items[i].CODE_NAME);
                    tmp.find('.card-header span.t2').text(items[i].TITLE);
                    tmp.find('.card-content img').attr('src', items[i].MAIN_IMG);
                    var content = '<span style="font-weight:bold;">장소</span> : ' + items[i].GCODE + ' ' + items[i].PLACE + '<br />';
                    content += '<span style="font-weight:bold;">시간</span> : ' + msg + '<br />';
                    content += '<span style="font-weight:bold;">가격</span> : ' + items[i].USE_FEE + '<br />';
                    content += '<span style="font-weight:bold;">나이</span> : ' + items[i].USE_TRGT + '<br />';
                    content += '<span style="font-weight:bold;">문의</span> : ' + items[i].INQUIRY + '<br />';
                    content += items[i].CONTENTS;
                    if(content == '') {
                        content += '<a href="' + items[i].ORG_LINK + '">' + items[i].ORG_LINK + '</a>';
                    }
                    tmp.find('.card-content-inner').append(content);
                    var popupDiv = $$('<div />').addClass('popup').addClass('popup-culture-' + i);
                    popupDiv.append(tmp);
                    $$('body').append(popupDiv);
                    //myApp.popup('.popup-culture-' + i);
                    // 팝업을 띄운다!
            //    });
                
                
    //            var li = $$('<li />');
    //            li.append(el);
    //           ul.append(li);
                el.attr('name', 'culture_table_' + i).addClass('cultureTable').attr('idx', i);
                if(i != 0) {
                    el.addClass('hide');
                }else {
                    el.addClass('show');
                }
                var a = $$('<a />').attr('href', '#').addClass('open-popup').attr('data-popup', '.popup-culture-' + i).css('color', '#000');
                a.append(el);
            div.append(a);
            }
        }
    });

    
    
    return div.html();
    //return $$('#culture').html();


}

// 메인 화면 서울시 새소식 12개 기관
function getNews() {

    var data = {
        'KEY': newsKey,
        'TYPE': 'json',
        'SERVICE': 'SeoulNewsList',
        'START_INDEX': 1,
        'END_INDEX': 5
        //'BLOG_ID': 15 : 건강, 21 : 교통, 22 : 안전, 23 : 주택, 24 : 경제, 25 : 환경, 26 : 문화/관광, 27 : 복지, 28 : 건설, 29 : 세금재정, 30 : 행정, 34 : 여성가족
    };
    var url = 'http://openapi.seoul.go.kr:8088/'+newsKey+'/json/SeoulNewsList/1/50/';
    var html = '';
    var tmpDiv = $$('<div />');
    var listDiv = $$('<div />').addClass('list-block');
    var listUl = $$('<ul />');
    /*
    var newList = new Array();
    newList.push('<span style="font-weight:bold;">문화/관광</span> &nbsp;[한양도성박물관] 외국인 단체 교육프로그램 \'Hanyangdoseong Walking Tour\' 11월 교육생 모집 안내</span>');
    newList.push('<span style="font-weight:bold;">건강</span> &nbsp;보건환경톡톡 제34호, 2017년 10월</span>');
    newList.push('<span style="font-weight:bold;">건강</span> &nbsp;내년 12월부터 전면 시행되는 농약 허용 물질 목록 관리제도 ‘PLS’</span>');
    newList.push('<span style="font-weight:bold;">건강</span> &nbsp;‘서울시 미세먼지, 녹지에서 해답을 찾다’, 미국 EPA 전문가 강연회 열려</span>');
    newList.push('<span style="font-weight:bold;">환경</span> &nbsp;서울대공원 동물원 둘레길 행사 \'단풍 동물원 한바퀴\'</span>');
   
    for(var i = 0; i < newList.length; i++) {
        var listLi = $$('<li />');
        var listItemDiv = $$('<div />').addClass('item-content').css('min-height', '35px');;
        var listItemInnerDiv = $$('<div />').addClass('item-inner').css('min-height', '35px');
        var listItemInnerTitle = $$('<div />').addClass('item-title').css('font-size', '13px');
        var listItemCdNmSpan = $$('<span />').css('font-weight','bold').css('margin-right', '10px');
        var listItemSpan = $$('<span />');
        var listItemSpanA = $$('<a />').attr('href', '#').css('color', '#000');
        listItemSpanA.addClass('open-popup');
        listItemSpanA.attr('data-popup','.popup-news-' + (i+1));
        

        listLi.append(listItemDiv);
        listItemDiv.append(listItemInnerDiv)
        listItemInnerDiv.append(listItemInnerTitle);
        listItemInnerTitle.append(listItemCdNmSpan);
        listItemInnerTitle.append(listItemSpan);
        listItemInnerTitle.append(listItemSpanA)
        listItemCdNmSpan.text();
        listItemSpanA.html(newList[i]);
        console.log(newList[i]);
        newDeatil = newList[i];

        listUl.append(listLi);

    }
    tmpDiv.append(listDiv);
    listDiv.append(listUl);
    html = tmpDiv.html();
    */
    $$.ajax({
        type: 'GET',
        dataType: 'jsonp',
        data: data,
        async: false,
        origin: 'http://newsky2.kma.go.kr/',
        url: url,
        // jsonp 값을 전달할 때 사용되는 파라미터 변수명
        // 이 속성을 생략하면 callback 파라미터 변수명으로 전달된다.
        jsonp: 'stone',
        success: function (json) {
            
            var items = JSON.parse(json).SeoulNewsList.row;
            items.sort(customSort);
           
            for(var i = 0; i < 5; i++) {
                var listLi = $$('<li />');
                var listItemDiv = $$('<div />').addClass('item-content').css('min-height', '35px');;
                var listItemInnerDiv = $$('<div />').addClass('item-inner').css('min-height', '35px');
                var listItemInnerTitle = $$('<div />').addClass('item-title').css('font-size', '13px');
                var listItemCdNmSpan = $$('<span />').css('font-weight','bold').css('margin-right', '10px');
                var listItemSpan = $$('<span />');
                var listItemSpanA = $$('<a />').attr('href', '#').css('color', '#000');
                listItemSpanA.addClass('open-popup');
                listItemSpanA.attr('data-popup','.popup-news-' + (i+1));
                
                // 팝업 세팅
                var tmp = $$($$('.popup-news-' + (i+1)));
                $$(tmp.find('.card-header span')[0]).text(items[i].BLOG_NAME);
                $$(tmp.find('.card-header span')[1]).text(items[i].POST_TITLE);
                if(items[i].THUMB_URI.length > 5) {
                    tmp.find('.card-content img').attr('src', items[i].THUMB_URI.replace('|', '').replace('%7C', ''));
                    tmp.find('.card-content img').css('display', 'block');
                }else {
                    tmp.find('.card-content img').css('display', 'none');
                }
                //var content = '<span style="font-weight:bold;">장소</span> : ' + items[i].GCODE + ' ' + items[i].PLACE + '<br />';
                //content += '<span style="font-weight:bold;">시간</span> : ' + msg + '<br />';
                //content += '<span style="font-weight:bold;">가격</span> : ' + items[i].USE_FEE + '<br />';
                //content += '<span style="font-weight:bold;">나이</span> : ' + items[i].USE_TRGT + '<br />';
                //content += '<span style="font-weight:bold;">문의</span> : ' + items[i].INQUIRY + '<br />';
                var content = items[i].POST_CONTENT;
                if(content == '') {
                    content += '<a href="' + items[i].ORG_LINK + '">' + items[i].ORG_LINK + '</a>';
                }
                tmp.find('.card-content-inner').append(content);


                listLi.append(listItemDiv);
                listItemDiv.append(listItemInnerDiv)
                listItemInnerDiv.append(listItemInnerTitle);
                listItemInnerTitle.append(listItemCdNmSpan);
                listItemInnerTitle.append(listItemSpan);
                listItemInnerTitle.append(listItemSpanA)
                listItemCdNmSpan.text(items[i].BLOG_NAME);
                listItemSpanA.text(items[i].POST_TITLE);
                newDeatil = items[i];

                listUl.append(listLi);

            }
            tmpDiv.append(listDiv);
            listDiv.append(listUl);
            html = tmpDiv.html();
            
            
            
        }

    });
    
    return html;
}

// 메인 화면 현재 날씨(초단기 실황)
function getWeather() {
    /*
        코드         항목명              자리수           값없음
        T1H			기온			       0.1 ℃			-50 ℃
        RN1			1시간 강수량			범주 (1 mm)		-1 mm
        SKY			하늘상태			 코드값			-1
        UUU			동서바람성분		    0.1 m/s			-100 m/s
        VVV			남북바람성분			0.1 m/s			-100 m/s
        REH			습도			        1%		    	-1%
        PTY			강수형태			코드값			    -1
        LGT			낙뢰			     코드값			-1
        VEC			풍향			      0	    		-1
        WSD			풍속			      1	    		-1
    */
    var skyData = {
        1: '맑음',
        2: '구름조금',
        3: '구름많음',
        4: '흐림'
    }
    var skyData2 = {
        0: '',
        1: '비',
        2: '진눈개비',
        3: '눈'
    }
    var rn1Data_1 = {
        0: '',
        1: '1mm 미만',
        5: '1~4mm',
        10: '5~9mm',
        20: '10~19mm',
        40: '20~39mm',
        70: '40~69mm',
        100: '70mm 이상'
    }

    var rn1Data_2 = {
        0: '',
        1: '1cm 미만',
        5: '1~4cm',
        10: '5~9cm',
        20: '10~19cm',
        100: '20cm 이상'
    }

    var lgtData = {
        1: '없음',
        2: '있음'
    }

    //const commonServiceKey = '3CUnKdEh3QjU%2Bi%2FkTH3KAdj9nbe%2Bzk9FtYymsgDK5VB7a1WnbqCzkibZJN80GXwDzXILTyZCBch6lF74sMlEYg%3D%3D';
    
    // ForecastGrib
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    if (hour < 10) hour = '0' + hour;

    var url = 'http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/';
    var method = 'ForecastGrib';
    var base_date = date.getFullYear() + '' + month + '' + day;
    var base_time = hour + '00';
    var nx = 60;
    var ny = 127;
    var numOfRows = 10;
    var pageNo = 1;
    var data = {
        'serviceKey': commonServiceKey,
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny,
        'numOfRows': numOfRows,
        'pageNo': pageNo,
        '_type': 'json'
    };

    data = {
        'serviceKey': commonServiceKey,
        'base_date': base_date,
        'base_time': base_time,
        'nx': nx,
        'ny': ny,
        'numOfRows': numOfRows,
        'pageNo': pageNo,
        '_type': 'json'
    };

    var form = $$('#weather');
    $$.ajax({
        /*
        type: 'GET',
        dataType: 'jsonp',
        jsonp : "callback",
        data: data,
        async: false,
        origin: 'http://newsky2.kma.go.kr/',
        url: url + method,

        // jsonp 값을 전달할 때 사용되는 파라미터 변수명
        // 이 속성을 생략하면 callback 파라미터 변수명으로 전달된다.
        jsonp: 'stone',
        */
        url: url + method,
        contentType: "OPTIONS",
        dataType : 'json',
        crossDomain: true,
        data: data,
        async: false,
        success: function (json) {
            /*
            console.log(json)
            var items = json.response.body.items.item;
            // TODO 데이터 못 가져오는 경우 처리 하자
            for (var i = 0; i < items.length; i++) {
                console.log(items[i].category + ' ' + items[i].obsrValue);
                if (items[i].category == 'SKY') {
                    var skyVal = items[i].obsrValue;
                    var iconNm = '';
                    if (skyVal == 1) {
                        iconNm = 'sun';
                    } else if (skyVal == 2 || skyVal == 3) {
                        iconNm = 'cloudy_1';
                    } else {
                        iconNm = 'cloudy_2';
                    }


                    form.find('.current [name=sky]').text(skyData[items[i].obsrValue]);
                    form.find('.current [name=weatherIcon]').attr('src', './img/weather/' + iconNm + '.png');
                } else if (items[i].category == 'T1H') {
                    form.find('[name=t1h]').text(items[i].obsrValue);
                } else if (items[i].category == 'REH') {
                    form.find('[name=reh]').text(items[i].obsrValue);
                } else if (items[i].category == 'PTY') {
                    if (items[i].obsrValue != 0) {
                        form.find('[name=sky]').text(skyData2[items[i].obsrValue]);
                        var iconNm = '';
                        var skyVal = items[i].obsrValue;
                        if (skyVal == 1) {
                            iconNm = 'rain';
                        } else if (skyVal == 2) {
                            iconNm = 'rain_2';
                        } else {
                            iconNm = 'now';
                        }
                        form.find('[name=weatherIcon]').attr('src', './img/weather/' + iconNm + '.png');
                    }
                }
            }

            mySwiper = myApp.swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                onSlideChangeEnd: function (swiper, e) {
                    console.log(swiper);
                    $$('[name=day_' + swiper.activeIndex + ']').parents('tr').find('span').css('color', '#000');
                    $$('[name=day_' + swiper.activeIndex + ']').parents('tr').find('td').css('border-bottom', '');
                    $$('[name=day_' + swiper.activeIndex + ']').css('color', 'blue');
                    $$('[name=day_' + swiper.activeIndex + ']').parents('td').css('border-bottom', 'solid 1px blue');
                    //myApp.swiper('.swiper-container').update();
                }  //
            });
            */

        }
    });

    numOfRows = 225;
    data = {
        'serviceKey': commonServiceKey,
        'base_date': base_date,
        'base_time': '0500',
        'nx': nx,
        'ny': ny,
        'numOfRows': numOfRows,
        'pageNo': pageNo,
        '_type': 'json'
    };

    method = 'ForecastSpaceData';
    $$.ajax({
        /*
        type: 'GET',
        dataType: 'jsonp',
        data: data,
        jsonp : "callback",
        async: false,
        origin: 'http://newsky2.kma.go.kr/',
        url: url + method,
        // jsonp 값을 전달할 때 사용되는 파라미터 변수명
        // 이 속성을 생략하면 callback 파라미터 변수명으로 전달된다.
        jsonp: 'stone',
        */
        url: url + method,
        contentType: "OPTIONS",
        dataType : 'json',
        crossDomain: true,
        data: data,
        async: false,
        success: function (json) {
            // 날짜별 오전9시, 오후 3시 데이터 생성
            var tmpFcstDate = '';
            var arr = new Array();
            var items = json.response.body.items.item;

            // day 구하기
            for (var i = 0; i < items.length; i++) {
                if (items[i].fcstTime == '0900') {
                    if (tmpFcstDate != items[i].fcstDate) {
                        var obj = new Object();
                        obj.day = items[i].fcstDate;
                        arr.push(obj);
                        tmpFcstDate = items[i].fcstDate;
                    }
                } else {
                    continue;
                }
            }
            for (var j = 0; j < arr.length; j++) {
                var moringData = new Object();
                var afternoonData = new Object();

                for (var i = 0; i < items.length; i++) {
                    if (arr[j].day == items[i].fcstDate) {
                        if (items[i].fcstTime == '0900') {
                            moringData[items[i].category] = items[i].fcstValue;
                        } else if (items[i].fcstTime == '1500') {
                            afternoonData[items[i].category] = items[i].fcstValue;
                        } else {
                            continue;
                        }
                    } else {
                        continue;
                    }

                    /*
                     00:00 ~ 05:00 사이에는 모레 날씨를 볼 수 없습니다.
                        강수확률 POP
                        강수형태 PTY
                        습도     REH
                        하늘상태 SKY
                        기    온 T3H
    
                        var obj = 
                    */

                }
                arr[j].morningData = moringData;
                arr[j].afternoonData = afternoonData;
            }
            
            for (var i = 0; i < arr.length; i++) {
                var morningForm = $$('div.next td.morning')[i];
                var afternoonForm = $$('div.next td.afternoon')[i];

                var skyVal1 = arr[i].morningData.SKY;
                var skyVal2 = arr[i].afternoonData.SKY;
                var iconNm1 = '';
                var iconNm2 = '';
                if (skyVal1 == 1) {
                    iconNm1 = 'sun';
                } else if (skyVal1 == 2 || skyVal1 == 3) {
                    iconNm1 = 'cloudy_1';
                } else {
                    iconNm1 = 'cloudy_2';
                }

                if (skyVal2 == 1) {
                    iconNm2 = 'sun';
                } else if (skyVal2 == 2 || skyVal2 == 3) {
                    iconNm2 = 'cloudy_1';
                } else {
                    iconNm2 = 'cloudy_2';
                }

                skyVal1 = arr[i].morningData.PTY;
                skyVal2 = arr[i].afternoonData.PTY;
                // 강수 형태
                var isRain1 = false;
                var isRain2 = false;
                if (skyVal1 != 0) {
                    isRain1 = true;
                    if (skyVal1 == 1) {
                        iconNm1 = 'rain';
                    } else if (skyVal1 == 2) {
                        iconNm1 = 'rain_2';
                    } else {
                        iconNm1 = 'snow';
                    }
                }

                if (skyVal2 != 0) {
                    isRain2 = true;
                    if (skyVal2 == 1) {
                        iconNm2 = 'rain';
                    } else if (skyVal2 == 2) {
                        iconNm2 = 'rain_2';
                    } else {
                        iconNm2 = 'snow';
                    }
                }

                if (isRain1) {
                    $$(morningForm).find('[name=sky]').text(skyData[skyVal1]);
                } else {
                    $$(morningForm).find('[name=sky]').text(skyData2[skyVal1]);
                }

                if (isRain2) {
                    $$(afternoonForm).find('[name=sky]').text(skyData[skyVal2]);
                } else {
                    $$(afternoonForm).find('[name=sky]').text(skyData2[skyVal2]);
                }

                $$(morningForm).find('[name=weatherIcon]').attr('src', './img/weather/' + iconNm1 + '.png');
                $$(afternoonForm).find('[name=weatherIcon]').attr('src', './img/weather/' + iconNm2 + '.png');

                $$(morningForm).find('[name=t3h]').text(arr[i].morningData.T3H);
                $$(afternoonForm).find('[name=t3h]').text(arr[i].afternoonData.T3H);

                $$(morningForm).find('[name=pop]').text('강수 ' + arr[i].morningData.POP + '%');
                $$(afternoonForm).find('[name=pop]').text('강수 ' + arr[i].afternoonData.POP + '%');

                $$(morningForm).find('[name=reh]').text('습도 ' + arr[i].morningData.REH + '%');
                $$(afternoonForm).find('[name=reh]').text('습도 ' + arr[i].afternoonData.REH + '%');
            }
     
        }
    });

    return form.html();
}

function getBusNum () {
    var busNum = $$('#busNumInput').val();
    var url = 'http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList';
    var data = {
        serviceKey : commonServiceKey,
        strSrch : busNum
    }
    console.log('하하');
    $$('#busCotnentLoding_1').show();
    $$.ajax({
        url: url,
        contentType: "OPTIONS",
        dataType : 'xml',
        crossDomain: true,
        data: data,
        async: false,
        success: function (json) {
            var busArr = new Array();
            var xml = json.substring(json.indexOf('<msgBody>'), json.indexOf('</msgBody>') + '</msgBody>'.length);
            var parser=new DOMParser();
            var xmlDoc=parser.parseFromString(xml,"text/xml");
            var x=xmlDoc.documentElement.childNodes;
            for (i=0;i<x.length;i++)
            {   
                var obj = new Object();
                
                var parser2 =new DOMParser();
                var xmlDoc2 =parser2.parseFromString('<itemList>' + x[i].innerHTML + '</itemList>',"text/xml");                    
                var x2 = xmlDoc2.documentElement.childNodes;
                for (var j=0; j<x2.length; j++) {
                obj[x2[j].nodeName] = x2[j].innerHTML;
                //노선 유형 (1:공항, 2:마을, 3:간선, 4:지선, 5:순환, 6:광역, 7:인천, 8:경기
                    if(x2[j].nodeName == 'routeType') {
                        var colors = {
                            '1': '#3d5bab',
                            '2': '#5bb025',
                            '3': '#3d5bab',
                            '4': '#5bb025',
                            '5': '#f2b70a',
                            '6': '#f72f08',
                            '7': '#3d5bab',
                            '8': '#3d5bab'
                        };
                        var busCd = {
                            '1': '공항',
                            '2': '마을',
                            '3': '간선',
                            '4': '지선',
                            '5': '순환',
                            '6': '광역',
                            '7': '인천',
                            '8': '경기'
                        };
                        obj['color'] = colors[x2[j].innerHTML];
                        obj['busCdNm'] = busCd[x2[j].innerHTML];
                    }
                    
                }
                busArr.push(obj);
            }
            // li 그리기
            var ul = $$('.popup-busEditPopup #busContent_1').find('ul');
            ul.find('li').remove();   
            for(var i = 0; i < busArr.length; i++) {
                var li = $$('<li />');
                var divContent = $$('<div />').addClass('item-content');
                var divInner = $$('<div />').addClass('item-inner');
                var divTitle = $$('<div />').addClass('item-title');
                var busCdSpan = $$('<span />').css('color', busArr[i].color).text(busArr[i].busCdNm);
                var busRouteId = busArr[i].busRouteId;
                var busRouteNm = busArr[i].busRouteNm;

                var busIdInput = $$('<input />').attr('type','hidden').val(busRouteId).addClass('busId');
                var busNmInput = $$('<input />').attr('type','hidden').val(busRouteNm).addClass('busNm');
                var busColorInput = $$('<input />').attr('type','hidden').val(busArr[i].color).addClass('busColor');
                var busCdInput = $$('<input />').attr('type','hidden').val(busArr[i].busCdNm).addClass('busCd');

                var busNumSpan = $$('<span />').text(busArr[i].busRouteNm).css('margin-left','10px').css('line-height', '35px').on('click', function(){
                    $$('#busContent_1').hide();
                    $$('#busContent_2').show();
                    $$('#busCotnentLoding_2').show();
                    var busId = $$(this).parents('li').find('.busId').val();
                    var busNm = $$(this).parents('li').find('.busNm').val();
                    var busColor = $$(this).parents('li').find('.busColor').val();
                    var busCd = $$(this).parents('li').find('.busCd').val();

                    selectBusStation(busId, busNm, busColor, busCd);
                    
                });

                divTitle.append(busIdInput);
                divTitle.append(busNmInput);
                divTitle.append(busColorInput);
                divTitle.append(busCdInput);

                divTitle.append(busCdSpan);
                divTitle.append(busNumSpan);
                divInner.append(divTitle);
                divContent.append(divInner);
                li.append(divContent);
                ul.append(li);
            }

            $$('#busCotnentLoding_1').hide();
        }
    });
}

function selectBusStation(busId, busNm, busColor, busCd) {
    var url = 'http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute';
    var data = {
        serviceKey : commonServiceKey,
        busRouteId : busId
    }
    $$.ajax({
        url: url,
        contentType: "OPTIONS",
        dataType : 'xml',
        crossDomain: true,
        data: data,
        async: false,
        success: function (json) {
            
            
            var xml = json.substring(json.indexOf('<msgBody>'), json.indexOf('</msgBody>') + '</msgBody>'.length);
            var parser=new DOMParser();
            var xmlDoc=parser.parseFromString(xml,"text/xml");
            var x=xmlDoc.documentElement.childNodes;
            var stationArr = new Array();
            for (i=0;i<x.length;i++)
            {   
                var obj = new Object();
                
                var parser2 =new DOMParser();
                var xmlDoc2 =parser2.parseFromString('<itemList>' + x[i].innerHTML + '</itemList>',"text/xml");                    
                var x2 = xmlDoc2.documentElement.childNodes;
                for (var j=0; j<x2.length; j++) {
                   obj[x2[j].nodeName] = x2[j].innerHTML;
                   console.log(x2[j].nodeName + ' = ' + x2[j].innerHTML);
                }
                stationArr.push(obj);
            }

            var ul = $$('.popup-busEditPopup #busContent_2').find('ul');
            ul.find('li').remove();   
            for(var i = 0; i < stationArr.length; i++) {
                var li = $$('<li />');
                var divContent = $$('<div />').addClass('item-content');
                var divInner = $$('<div />').addClass('item-inner');
                var divTitle = $$('<div />').addClass('item-title');
                var busCdSpan = $$('<span />').text(stationArr[i].busCdNm);
                var busReturn = $$('<span />').text('[ 회차 ] ').css('font-weight', 'bold').css('font-size', '11px').css('position', 'absolute').css('top', '0px').css('left', '10px');
                
                // 전달용 인풋
                var busIdInput = $$('<input />').attr('type','hidden').addClass('busId');
                $$(busIdInput).val(busId);
                var busNmInput = $$('<input />').attr('type','hidden').val(busNm).addClass('busNm');
                var busColorInput = $$('<input />').attr('type','hidden').val(busColor).addClass('busColor');
                var busCdInput = $$('<input />').attr('type','hidden').val(busCd).addClass('busCd');

                var busStationIdInput = $$('<input />').attr('type','hidden').addClass('busStationId').val(stationArr[i].station);
                var busStationNmInput = $$('<input />').attr('type','hidden').addClass('busStationNm').val(stationArr[i].stationNm);
                var busStationSeqInput = $$('<input />').attr('type','hidden').addClass('busStationSeq').val(stationArr[i].seq);
                console.log("씨발!!!!!!!!!!!!!!!!!" + stationArr[i].seq);
 
                var busRouteId = stationArr[i].station;
                var busStationNm = stationArr[i].stationNm;
                var busNumSpan = $$('<span />').on('click', function(event){
                    
                    var clickedLink = this;

                    var busId = $$(this).parents('li').find('.busId').val();
                    var busNm = $$(this).parents('li').find('.busNm').val();
                    var busColor = $$(this).parents('li').find('.busColor').val();
                    var busCd = $$(this).parents('li').find('.busCd').val();
                    var busStationId = $$(this).parents('li').find('.busStationId').val();
                    var busStationNm = $$(this).parents('li').find('.busStationNm').val();
                    var busStationSeq = $$(this).parents('li').find('.busStationSeq').val();


                    var popoverHTML = '<div class="popover busPopover" style="text-align:center;">'+
                                        '<div class="popover-inner">'+
                                          '<div class="content-block" style="margin:32px 0px 0px 0px;">'+
                                            '<p>노선번호 : '+ busNm +'</p>'+
                                            '<p>정류장 : ' + busStationNm + '</p>' +
                                            '<p>' + 
                                            '</p>' +
                                            '<p>위의 정보로 설정하시겠습니까 ?</p>' +
                                            '<p class="buttons-row">' + 
                                            '</p>' +
                                          '</div>'+
                                        '</div>'+
                                      '</div>';
                    
                    myApp.popover(popoverHTML, clickedLink);
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busId).addClass('busId'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busNm).addClass('busNm'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busColor).addClass('busColor'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busCd).addClass('busCd'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busStationId).addClass('busStationId'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busStationNm).addClass('busStationNm'));
                    $$('.busPopover').append($$('<input />').attr('type', 'hidden').val(busStationSeq).addClass('busStationSeq'));

                    var busPopoverP = $$('<p />').addClass('buttons-row');
                    var busPopoverOk = $$('<a />').addClass('button').addClass('button-raised').text('확인')
                    var busPopoverCancel = $$('<a />').addClass('button').addClass('button-raised').text('취소')
                    busPopoverOk.on('click', function() {
                            // 버스 정보 저장
                        var busId = $$(this).parents('div.busPopover').find('.busId').val();
                        var busNm = $$(this).parents('div.busPopover').find('.busNm').val();
                        var busColor = $$(this).parents('div.busPopover').find('.busColor').val();
                        var busCd = $$(this).parents('div.busPopover').find('.busCd').val();
                        var busStationId = $$(this).parents('div.busPopover').find('.busStationId').val();
                        var busStationNm = $$(this).parents('div.busPopover').find('.busStationNm').val();
                        var busStationSeq = $$(this).parents('div.busPopover').find('.busStationSeq').val();
                        console.log(busId + '_' + busNm + '_' + busColor +'_' + busCd + '_' + busStationId + '_' + busStationNm + '_' + busStationSeq);

                        myApp.formStoreData('busInfo', {
                            'items': [
                                 {
                                    'busId': busId, 
                                    'busNm': busNm, 
                                    'busColor': busColor,
                                    'busCd': busCd, 
                                    'busStationId' : busStationId,
                                    'busStationNm' : busStationNm,
                                    'busStationSeq': busStationSeq
                                }
                            ]
                        });

                        myApp.closeModal('.busPopover');
                        myApp.closeModal('.popup-busEditPopup');
                        window.location.reload(true);
                    });

                    busPopoverCancel.on('click', function(){
                        myApp.closeModal('.busPopover');
                    });

                    busPopoverP.append(busPopoverOk);
                    busPopoverP.append(busPopoverCancel);
                    $$('.busPopover').append(busPopoverP);

                    

                });
                busNumSpan.css('margin-left','10px').css('line-height', '35px').text(busStationNm);


                divTitle.append(busIdInput);
                divTitle.append(busNmInput);
                divTitle.append(busColorInput);
                divTitle.append(busCdInput);
                divTitle.append(busStationIdInput);
                divTitle.append(busStationNmInput);
                divTitle.append(busStationSeqInput);

                divTitle.append(busCdSpan);
                divTitle.append(busNumSpan);
                if(stationArr[i].transYn == 'Y') {
                    busNumSpan.css('line-height', '50px').css('font-weight', 'bold').addClass('stationNm');
                    divInner.css('background-color', '#eeeeee');
                    divTitle.append(busReturn);
                }
                divInner.append(divTitle);
                divContent.append(divInner);
                li.append(divContent);
                ul.append(li);
            }
            $$('#busCotnentLoding_2').hide();
        }
    });
}



function editBusInfo() {
    var busPopup = $$('.popup-busEditPopup');
    $$('#busNumSearchBtn').on('click', function(){
        getBusNum();
    });

    myApp.popup('.popup-busEditPopup');
}

function getBus() {
    var busInfo = myApp.formGetData('busInfo');
    if(busInfo == undefined || busInfo == null || busInfo.length == 0 || busInfo.items.length == 0) {
        return '<div style="width:100%; height:100px; text-align:center;"><span style="line-height:100px;">버스를 <a href="#" onclick="editBusInfo();">등록</a>해주세요</span></div>';
    }else {
        //console.log(busId + '_' + busNm + '_' + busColor +'_' + busCd + '_' + busStationId + '_' + busStationNm);
        console.log(busInfo.items[0].busId);
        console.log(busInfo.items[0].busStationId);
        console.log(busInfo.items[0].busStationSeq);
        var data = {
            "stId" : busInfo.items[0].busId,
            "busRouteId" : busInfo.items[0].busStationId,
            "serviceKey" : commonServiceKey,
            "ord" : busInfo.items[0].busStationSeq
        };
        //http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByRoute?ServiceKey=3CUnKdEh3QjU%2Bi%2FkTH3KAdj9nbe%2Bzk9FtYymsgDK5VB7a1WnbqCzkibZJN80GXwDzXILTyZCBch6lF74sMlEYg%3D%3D&stId=122000047&busRouteId=100100290&ord=75
        //http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByRoute?serviceKey=3CUnKdEh3QjU%2Bi%2FkTH3KAdj9nbe%2Bzk9FtYymsgDK5VB7a1WnbqCzkibZJN80GXwDzXILTyZCBch6lF74sMlEYg%3D%3D&stId=116000015&busRouteId=100100290&ord=117
        var tmpKey = '3CUnKdEh3QjU%2Bi%2FkTH3KAdj9nbe%2Bzk9FtYymsgDK5VB7a1WnbqCzkibZJN80GXwDzXILTyZCBch6lF74sMlEYg%3D%3D';
        var url = 'http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByRoute?serviceKey='+ tmpKey + '&stId='+busInfo.items[0].busStationId+'&busRouteId='+busInfo.items[0].busId+'&ord='+busInfo.items[0].busStationSeq;

        var content = $$('<div />');
        var contentClick = $$('<div />').addClass('busContent').on('click', function(){
            console.log(1111111111111);
            var busPopup = $$('.popup-busEditPopup');
            $$('#busNumSearchBtn').on('click', function(){
                getBusNum();
            });
        
            myApp.popup('.popup-busEditPopup');
        });
        var contentInner_1 = $$('<div />').css('display', 'inline-block').css('margin-left', '15px');
        var contentInner_2 = $$('<div />').css('display', 'inline-block').css('float', 'right').css('line-height', '30px');

        var p1 = $$('<p />').text(busInfo.items[0].busNm).css('color', busInfo.items[0].busColor).css('font-size', '25px').css('margin', '0px');
        var p2 = $$('<p />').text(busInfo.items[0].busStationNm).css('font-size', '15px').css('font-weight', 'bold').css('margin', '0px');
        var p3 = $$('<p />').css('margin', '0px');
        var p4 = $$('<p />').css('margin', '0px');

        contentInner_1.append(p1);
        contentInner_1.append(p2);
        contentInner_2.append(p3);
        contentInner_2.append(p4);

        contentClick.append(contentInner_1);
        contentClick.append(contentInner_2);
        content.append(contentClick);

        var html = '';
        $$.ajax({
            url: url,
            contentType: "OPTIONS",
            dataType : 'xml',
            crossDomain: true,
            //data: data,
            async: false,
            success: function (json) {        
                var busArr = new Array();            
                var xml = json.substring(json.indexOf('<msgBody>'), json.indexOf('</msgBody>') + '</msgBody>'.length);
                var parser=new DOMParser();
                var xmlDoc=parser.parseFromString(xml,"text/xml");
                var x=xmlDoc.documentElement.childNodes;
                for (i=0;i<x.length;i++)
                {   
                    var obj = new Object();
                    
                    var parser2 =new DOMParser();
                    var xmlDoc2 =parser2.parseFromString('<itemList>' + x[i].innerHTML + '</itemList>',"text/xml");                    
                    var x2 = xmlDoc2.documentElement.childNodes;
                    for (var j=0; j<x2.length; j++) {
                    obj[x2[j].nodeName] = x2[j].innerHTML;
                    }
                    busArr.push(obj);
                }
                console.log(busArr)
                p3.text(busArr[0].arrmsg1);
                p4.text(busArr[0].arrmsg2);

            }, error : function(e) {
                console.log(e);
            }
        });
        return content;
    }

}

function setMainList(useList) {
    var mainContnet = $$('div[data-page=index] div.page-content div.list-block');
    for (var i = 0; i < useList.length; i++) {
        // HTML Element Setting
        var cardDiv = $$('<div />').addClass('card');
        var cardHeaderDiv = $$('<div />').addClass('card-header');
        cardHeaderDiv.css('min-height', '30px').css('font-size', '13px').css('margin-left', '10px');
        var cardHeaderDivDetail = $$('<a />').css('margin-right', '0px');//.text('+ 더보기');
        var cardHeaderDivDetail2 = $$('<a />').css('margin-right', '0px');//.text('+ 더보기');
        var cardHeaderDivOpt = $$('<div />').css('float', 'right');
        var cardContentDiv = $$('<div />').addClass('card-content');
        var cardContentInnerDiv = $$('<div />').addClass('card-content-inner');
        cardDiv.append(cardHeaderDiv);
        cardDiv.append(cardContentDiv);
        cardContentDiv.append(cardContentInnerDiv);
        
        // Data Setting
        cardHeaderDiv.text(useList[i].title);
        if(useList[i].title == '문화행사') {
            cardHeaderDivDetail.text('다음');
            cardHeaderDivDetail2.text('이전').css('margin-right','5px');
            cardHeaderDivDetail.on('click', function(){
                
                var currntIdx = Number($$(this).parent().parent().parent().find('table.show').attr('idx'));
                var tables = $$(this).parent().parent().parent().find('table');
                currntIdx += 1;
                for(var j = 0; j < tables.length; j++) {
                    $$(tables[j]).removeClass('show').addClass('hide');
                    if(currntIdx == j) {
                        $$(tables[j]).addClass('show').removeClass('hide');
                    }

                }

                
                if(currntIdx + 1 == tables.length) {
                    cardHeaderDivDetail.hide();
                }else {
                    cardHeaderDivDetail.show();
                }
                if(currntIdx != 0) {
                    cardHeaderDivDetail2.show();
                }else {
                    cardHeaderDivDetail2.hide();
                }
            });

            cardHeaderDivDetail2.on('click', function(){
                
                var currntIdx = Number($$(this).parent().parent().parent().find('table.show').attr('idx'));
                var tables = $$(this).parent().parent().parent().find('table');
                currntIdx -= 1;
                for(var j = 0; j < tables.length; j++) {
                    $$(tables[j]).removeClass('show').addClass('hide');
                    if(currntIdx == j) {
                        $$(tables[j]).addClass('show').removeClass('hide');
                    }

                }

                
                if(currntIdx - 1 == 0) {
                    cardHeaderDivDetail2.hide();
                }else {
                    cardHeaderDivDetail2.show();
                }

                if(currntIdx + 1 != tables.length) {
                    cardHeaderDivDetail.show();
                }else {
                    cardHeaderDivDetail.hide();
                }
                
            });

            cardHeaderDivOpt.append(cardHeaderDivDetail2.hide());
            cardHeaderDivOpt.append(cardHeaderDivDetail);

            cardHeaderDiv.append(cardHeaderDivOpt);
        }
        if(useList[i].func != '') { 
        cardContentInnerDiv.append(eval(useList[i].func));
        }

        // Main List Add
        mainContnet.append(cardDiv);
    }

    
}

$$('.card-content').on('click', function () {
    var html = getWeather($$(this));
    //$$(this).append(html);


});

// util method
function customSort(a, b) {
    if(a.PUBLISH_DATE == b.PUBLISH_DATE){ return 0} return  a.PUBLISH_DATE < b.PUBLISH_DATE ? 1 : -1;
}
  