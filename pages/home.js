$(".container").show();
var echarts = require('/mods/echarts.min.js');
var jeDate = require('/mods/jquery.jedate.js');
var moco = require('./moco.js');
require('/mods/jedate.css');
let myChart = null;
let zoomSize = 8;
let reportInitOption = {
    title: {
      show: false,
    },
    tooltip : {
      trigger: 'axis',
      axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    dataZoom: [
      {
        type: 'inside',
      }
    ],
    xAxis: {
      // type: 'category',
      axisLine: {
        lineStyle: {
          color: '#ddd',
        }
      },
      axisLabel: {
        color: '#333',
        formatter: function (val) {
          return val.replace(/\d{4}-/, '')
        }
      },
      splitLine: {
        show: true,
        interval: 0,
      },
      data: [],
    },
    grid: {
      show: false,
      top: 35,
      bottom: 50,
      right: 30,
      left: 70,
      borderColor: '#ddd',
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ddd',
        }
      },
      nameTextStyle: {
        color: '#999',
      },
      axisLabel: {
        color: '#333',
      }
    },
    series: [{
      type: 'bar',
      barMaxWidth: '40',
      barMinWidth: '20',
      // barCategoryGap:'40%',
    }]
  };
$(function () {
  //加载动画
  layer.open({type: 2})
  initCalander();
  initCharts();
  initTabel();
  //获取用户选取的时间段的值
  onSwitchReportTabs();
  //默认显示七天数据
  $('.report-search-btn').click(function () {
    submitSearch();
  });

  $('[data-length=7]').click();
  $('.report-search-btn').click();

})
function caculateChartsHeight() {
  var clientHeight = document.documentElement.clientHeight;
  var headerHeight = $('.report-hader').height();
  return clientHeight - headerHeight;
}
function initCharts(datas) {
  var chartsH = caculateChartsHeight();
  $('#report-main').height(chartsH || 280);
  myChart = echarts.init(document.getElementById('report-main'));
 // 绘制图表
  myChart.setOption(reportInitOption);
}
function initCalander() {
  var start = {
    format: 'YYYY-MM-DD',
    isinitVal:true,
    isClear: true,
    isToday: false,
    onClose: false,
    maxDate: $.nowDate({DD:0}),
    okfun: function(obj){
      end.minDate = obj.val; //开始日选好后，重置结束日的最小日期
      endDates();
    }
  };
  var end = {
    format: 'YYYY-MM-DD',
    isinitVal:true,
    onClose: false,
    maxDate: $.nowDate({DD:0}), //设定最大日期为当前日期
    okfun: function(obj){

    }
  }
  // $("#dataStart").jeDate({
  //   format:"YYYY-MM-DD",
  //   isTime:true,
  //   isClear:true,
  //   isToday:true,
  //   isinitVal:true,
  // })
  $('#dataStart').jeDate(start);
  $('#dataEnd').jeDate(end);
  function endDates() {
    //将结束日期的事件改成 false 即可
    end.trigger = false;
    $("#dataEnd").jeDate(end);
  }

}
function onSwitchReportTabs() {
  $('.pure-menu-list').click(function (e) {
    var targetNode = $(e.target);
    if (targetNode.hasClass('pure-menu-link')) {
      $(this).find('a').removeClass('active')
      targetNode.addClass('active');
    }
  });
}
function submitSearch() {
  //获取dateRang
  var dateRangeFlag = $('.report-tabs .active').data('length');
  var dateRange = getAndValidateDateRange(dateRangeFlag);
  if(!dateRange) return;
  var token = 'token';
  //请求数据
  getRportData(token, dateRange);
  //
}
function getAndValidateDateRange(dateRange) {
  if(dateRange === 'custom') {
    var startDate = new Date($('#dataStart').val()).getTime();
    var endDate = new Date($('#dataEnd').val()).getTime();
    if(!startDate || !endDate || endDate - startDate < 0) {
      layer.open({
        content: '请选择正确的时间段',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
    if(endDate - startDate > 59 * 24 * 60 * 60 * 1000) {
      layer.open({
        content: '起始时间不能相差60天以上',
        skin: 'msg',
        time: 2 //2秒后自动关闭
      });
      return;
    }
    return [startDate, endDate];
  }else {
    return parseInt(dateRange) || 7;
  }
}
function getRportData(token, dateRange) {
  layer.open({type: 2})
  //eroor 处理 hideLoading, 弹框;
  var dates = moco.getReportDate(dateRange);
  var orderMoney = moco.getReportOrderMoney(dateRange);
  var orderCout = moco.getReportOrderCout(dateRange);

  myChart.off('click');
  myChart.on('click', function(params) {
    myChart.dispatchAction({
      type: 'dataZoom',
      startValue: dates[Math.max(params.dataIndex - zoomSize / 2, 0)],
      endValue:   dates[Math.min(params.dataIndex + zoomSize / 2, dates.length - 1)]
    });
  })

  setTimeout(function () {
    var datas = [
      orderCout,
      orderMoney,
      dates
    ];
    onReportCartClick(datas);
    //默认生成订单数
    $('.count-card').eq(0).click();
    renderTabel(datas);
  }, 500)
}
function onReportCartClick(datas) {
  $('.count-card').each(function (idx, node) {
    $(node).click(function () {
      changeCharts(idx, datas);
    })
  })
}
function changeCharts(idx, datas) {
  layer.closeAll();
  if(idx === 1) {
    //订单总笔数
    myChart.setOption({
      yAxis: {
        name: '订单总数',
        axisLabel: {
          formatter: '{value}',
        }
      },
      xAxis: {
        data: datas[2],
      },
      series: [{
        name: '销量',
        type: 'bar',
        data: datas[0],
        itemStyle: {
          color: '#FF6655'
        }
      }]
    })
  }else if(idx === 0) {
    myChart.setOption({
      yAxis: {
        name: '订单总金额',
        axisLabel: {
          formatter: function (val) {
            return val ? val/ 10000 + '万' : 0;
          }
        }
      },
      xAxis: {
        data: datas[2],
      },
      series: [{
        name: '金额',
        type: 'bar',
        data: datas[1],
        itemStyle: {
          color: '#FF9F47',
        }
      }]

    })
  }else {
    console.log('changeCharts params idx is err')
  }

  // $(".container").loading('stop');
}
function initTabel() {
  $('.report-table-wrap').height(document.documentElement.clientHeight -30);
}
function renderTabel(datas) {
  var tableTpl = '<tr><td>{{date}}</td><td>{{orderCount}}</td> <td>{{money}}</td></tr>';
  var tableString = '';
  datas[2].forEach(function (item, i) {
    tableString += tableTpl.replace(/{{.*?}}/g,function (rp) {
      switch(rp) {
        case '{{date}}':
          return item;
          break;
        case '{{orderCount}}':
          return datas[0][i];
          break;
        case '{{money}}':
          return datas[1][i];
          break;
        default:
          return '';
      }
    })
  })
  $('.report-table tbody').html(tableString);

}




