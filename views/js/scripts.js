window.onload = function() {
  var tem1, temp2;
  var temp1 = new JustGage({
    id: "temp1",
    value: " ",
    min: 0,
    max: 50,
    title: "TEMPERATURA",
    label: "ºC"
  });
  var hum1 = new JustGage({
    id: "hum1",
    value: " ",
    min: 0,
    max: 100,
    title: "HUMEDAD",
    label: "%"
  });
  // setInterval(function() {
  //   temp1.refresh(getRandomInt(0, 50));
  //   hum1.refresh(getRandomInt(50, 100));
  // }, 1500);

  var socket = io.connect(window.location.href);

  socket.on('topic', function(topic) {
    //hum1.refresh(parseFloat(dataHum1.valor));
    console.log(topic);
  });

  //FUNCION QUE RELLENA EL GRAFICO DE HUMEDAD
  $(function() {
    var dataTemp = new Array();

    $.getJSON('http://192.168.0.10:3000/temp1', function(json) {
      $.map(json, function(obj, i) {
        dataTemp.push({
          x: new Date(obj.TopicTime),
          y: parseFloat(obj.TopicValue)
        });
      });
      //console.log("esto es data: " + JSON.stringify(dataTemp));
      $('#chartTemp').highcharts('StockChart', {
        rangeSelector: {
          selected: 1
        },

        chart: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          events: {
            load: function() {

              // Actualizo el grafico y el reloj de TEMPERATURA
              var series = this.series[0];
              socket.on('t1', function(DataChartTemp1) {
                temp1.refresh(parseFloat(DataChartTemp1.valor));
                var x = (new Date()).getTime(),
                  y = parseFloat(DataChartTemp1.valor);
                series.addPoint([x, y], true, true);
              });
            }
          }
        },

        title: {
          text: 'TEMPERATURA 1'
        },

        credits: {
          enabled: false
        },

        series: [{
          name: 'TEMPERATURA',
          data: dataTemp,
          turboThreshold: 0,
          color: '#ff0000',
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    });
  });

  $(function() {
    var dataHum = new Array();

    $.getJSON('http://192.168.0.10:3000/hum1', function(json) {
      $.map(json, function(obj, i) {
        dataHum.push({
          x: new Date(obj.TopicTime),
          y: parseFloat(obj.TopicValue)
        });
      });
      //console.log("esto es data: " + JSON.stringify(dataHum));
      $('#chartHum').highcharts('StockChart', {
        rangeSelector: {
          selected: 1
        },

        chart: {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          events: {
            load: function() {

              // actualizo el grafico y el reloj de HUMEDAD
              var series = this.series[0];
              socket.on('h1', function(DataChartHum1) {
                hum1.refresh(parseFloat(DataChartHum1.valor));
                var x = (new Date()).getTime(),
                  y = parseFloat(DataChartHum1.valor);
                series.addPoint([x, y], true, true);
              });
            }
          }
        },

        title: {
          text: 'HUMEDAD 1'
        },

        credits: {
          enabled: false
        },

        series: [{
          name: 'HUMEDAD',
          data: dataHum,
          turboThreshold: 0,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    });
  });
  //para que me aparezca bien el eje de las x, ponia hora UTC-0
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });






};
(function updateTime() {
  var now = moment().locale('es');

  $('.cf-td').each(function() {
    $('.cf-td-time', $(this)).html(now.format('HH:mm'));
    $('.cf-td-day', $(this)).html(now.format('dddd') + "&nbsp;");
    $('.cf-td-date', $(this)).html(now.format('LL'));
  });

  setTimeout(updateTime, 3000);
})();


// cundo voy al anchor #about oculto el home para que no se estire y se vea por detras

$(document).ready(function() {
  $(window).bind('hashchange', function(e) {
    var anchor = document.location.hash;
    if (anchor === '#about') {
      $("#home").delay(100).hide(0);
    }
    if (anchor === '#home') {
      $("#home").show(0);
    }
  });
});

$(document).keydown(function(tecla) {
  if (tecla.keyCode == 37) {
    document.location.hash = '#about';
  }
  if (tecla.keyCode == 39) {
    document.location.hash = '#home';
  }
});
