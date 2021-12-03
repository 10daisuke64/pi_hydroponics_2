/* ---------------------------
  定義
----------------------------- */
function convertTimestampToHour(timestamp) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(2, '0');
  const h = _d.getHours().toString().padStart(1, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  return `${h}`;
}
function convertTimestampToDate(timestamp) {
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(1, '0');
  const h = _d.getHours().toString().padStart(2, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  const w = _d.getDay().toString().padStart(1, '0');
  const week = ["日","月","火","水","木","金","土"];
  return `${d}<span>日</span><span>（${week[w]}）</span>`;
}

/* ---------------------------
  open weather map
----------------------------- */
// KEY
const appId = "";

// K -> C
function CovertKelvinToCelsius(kelvin) {
  return Math.floor(kelvin - 273.15);
}

function mapsInit(position) {

  // ------------- 位置情報の取得 -------------
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // ------------- XMLHttpRequest -------------
  function dataGET(path, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', path, true);
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(JSON.parse(xmlhttp.responseText));
      }
    };
    xmlhttp.send(null);
  }

  // ------------- weather -------------
  const weatherUrl = `
    http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&lang=ja&APPID=${appId}
  `;
  dataGET(weatherUrl, function(data) {
    // console.log(data);

    let weatherOutput = `
      <div class="weather__icon">
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="${data.weather[0].description}">
      </div>
      <div class="weather__info">
        <p class="description">${data.weather[0].description}</p>
      </div>
      <div class="weather__temp">
        <p class="maxtemp">${CovertKelvinToCelsius(data.main.temp_max)}<span>&#x2103;</span></p>
        <p class="mintemp">${CovertKelvinToCelsius(data.main.temp_min)}<span>&#x2103;</span></p>
        <p class="hum">${data.main.humidity}<span>%</span></p>
      </div>
    `;
    $("#js-weather").html(weatherOutput);
  });

  // ------------- forecast -------------
  const forecastUrl = `
    http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&lang=ja&APPID=${appId}
  `;
  dataGET(forecastUrl, function(data) {
    // console.log(data);

    // データを整理した連想配列を作成
    let dataArray = [];
    data.list.forEach(function(dataList){
      let dataListArray = {};
      // 日付
      dataListArray.date = convertTimestampToDate(dataList.dt)
      // 時刻
      dataListArray.hour = convertTimestampToHour(dataList.dt);
      // 天気アイコン
      dataListArray.icon = dataList.weather[0].icon;
      // 天気概要
      dataListArray.description = dataList.weather[0].description;
      // 気温
      dataListArray.temp = CovertKelvinToCelsius(dataList.main.temp);
      // 湿度
      dataListArray.hum = dataList.main.humidity;
      // 風向
      dataListArray.windDeg = dataList.wind.deg;
      // 風速
      dataListArray.windSpeed = Math.floor(dataList.wind.speed);
      // 連結
      dataArray.push(dataListArray);
    });

    // 出力
    let forecastOutput = "";

    forecastOutput += '<table>';
    // 時刻
    forecastOutput += '<tr style="background-color: #fafafa;"><th>時</th>';
      dataArray.forEach(function(dataArrayElement){
        if( dataArrayElement.hour == 0 ) {
          forecastOutput += `
            <td rowspan="6" style="background-color:#fafafa;">${dataArrayElement.date}</td>
            <td>${dataArrayElement.hour}</td>
          `;
        } else {
          forecastOutput += `
            <td>${dataArrayElement.hour}</td>
          `;
        }
      });
    forecastOutput += '</tr>';
    // 天気アイコン
    forecastOutput += '<tr><th>天気</th>';
      dataArray.forEach(function(dataArrayElement){
        forecastOutput += `
          <td>
            <img src="https://openweathermap.org/img/wn/${dataArrayElement.icon}.png" alt="${dataArrayElement.description}" width="30" height="30">
          </td>
        `;
      });
    forecastOutput += '</tr>';
    // 気温
    forecastOutput += '<tr><th>気温</th>';
      dataArray.forEach(function(dataArrayElement){
        forecastOutput += `
          <td>${dataArrayElement.temp}<span>&#x2103;</span></td>
        `;
      });
    forecastOutput += '</tr>';
    // 湿度
    forecastOutput += '<tr><th>湿度</th>';
      dataArray.forEach(function(dataArrayElement){
        forecastOutput += `
          <td>${dataArrayElement.hum}<span>%</span></td>
        `;
      });
    forecastOutput += '</tr>';
    // 風向
    forecastOutput += '<tr><th>風向</th>';
      dataArray.forEach(function(dataArrayElement){
        forecastOutput += `
          <td>
            <span class="winddeg" style="transform:rotate(${dataArrayElement.windDeg - 180}deg)"></span>
          </td>
        `;
      });
    forecastOutput += '</tr>';
    // 風速
    forecastOutput += '<tr><th>風速</th>';
      dataArray.forEach(function(dataArrayElement){
        forecastOutput += `
          <td>${dataArrayElement.windSpeed}</td>
        `;
      });
    forecastOutput += '</tr>';
    forecastOutput += '</table>';

    $("#js-forecast").html(forecastOutput);
  });

}

/* ---------------------------
  position error
----------------------------- */
function showError(error) {
  const errorMessages = [
    "位置情報が許可されてません",
    "現在位置を特定できません",
    "位置情報を取得する前にタイムアウトになりました",
  ];
  const errorOutput = `
    <p class="position_error"><span>エラー</span>${errorMessages[error.code - 1]}</p>
  `;
  $("#js-weather").html(errorOutput);
}

/* ---------------------------
  position option
----------------------------- */
const option = {
  enableHighAccuracy: true,
  maximumAge: 20000,
  timeout: 60 * 1000,
};

/* ---------------------------
  queue
----------------------------- */
window.onload = function () {
  navigator.geolocation.getCurrentPosition(mapsInit, showError, option);
};
