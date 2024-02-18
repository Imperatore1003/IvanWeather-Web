// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
// Unit 0 = Imperial
// Unit 1 = Metric

// This API key is provided by OpenWeatherMap.org
// You can get your own API key by signing up for a FREE FOREVER account on https://home.openweathermap.org/users/sign_up
const APIKEY = "84b3fab687879f825802c0ad57147510";
const cookiesExpiresDays = 1;
const debugMode = false;

function forecast() {
    getWeather(cityName = 0,latitude = getCookie("latitude"), longitude = getCookie("longitude")).then(
        data => {
            displayWeather(data);
        }
    );
}

function search() {
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    document.title = "Search " + cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - IvanWeather";
    document.getElementById("searchCurrentLink").setAttribute("href", "/search?city=" + cityName);

    getWeather(cityName).then(
        data => {
            displayWeather(data);
        }
    );
}

async function getWeather(cityName = 0, latitude = 0, longitude = 0) {
    if (debugMode) {
        return {"cod":"200","message":0,"cnt":40,"list":[{"dt":1707944400,"main":{"temp":279.1,"feels_like":279.1,"temp_min":278.6,"temp_max":279.1,"pressure":1026,"sea_level":1026,"grnd_level":937,"humidity":73,"temp_kf":0.5},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":7},"wind":{"speed":1.17,"deg":216,"gust":1.07},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-14 21:00:00"},{"dt":1707955200,"main":{"temp":278.74,"feels_like":278.74,"temp_min":278.03,"temp_max":278.74,"pressure":1026,"sea_level":1026,"grnd_level":937,"humidity":77,"temp_kf":0.71},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":7},"wind":{"speed":1.04,"deg":215,"gust":0.96},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-15 00:00:00"},{"dt":1707966000,"main":{"temp":278.02,"feels_like":278.02,"temp_min":277.48,"temp_max":278.02,"pressure":1025,"sea_level":1025,"grnd_level":936,"humidity":81,"temp_kf":0.54},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"clouds":{"all":8},"wind":{"speed":0.83,"deg":238,"gust":0.74},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-15 03:00:00"},{"dt":1707976800,"main":{"temp":277.02,"feels_like":277.02,"temp_min":277.02,"temp_max":277.02,"pressure":1025,"sea_level":1025,"grnd_level":936,"humidity":85,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":17},"wind":{"speed":1.26,"deg":220,"gust":1.17},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-15 06:00:00"},{"dt":1707987600,"main":{"temp":281.28,"feels_like":281.28,"temp_min":281.28,"temp_max":281.28,"pressure":1025,"sea_level":1025,"grnd_level":937,"humidity":71,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":10},"wind":{"speed":0.54,"deg":50,"gust":0.35},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-15 09:00:00"},{"dt":1707998400,"main":{"temp":284.02,"feels_like":282.76,"temp_min":284.02,"temp_max":284.02,"pressure":1023,"sea_level":1023,"grnd_level":937,"humidity":61,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":46},"wind":{"speed":1.76,"deg":37,"gust":1.04},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-15 12:00:00"},{"dt":1708009200,"main":{"temp":283.46,"feels_like":282.32,"temp_min":283.46,"temp_max":283.46,"pressure":1022,"sea_level":1022,"grnd_level":935,"humidity":68,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":1.68,"deg":46,"gust":1.43},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-15 15:00:00"},{"dt":1708020000,"main":{"temp":279.61,"feels_like":279.61,"temp_min":279.61,"temp_max":279.61,"pressure":1023,"sea_level":1023,"grnd_level":935,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.31,"deg":90,"gust":0.42},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-15 18:00:00"},{"dt":1708030800,"main":{"temp":278.97,"feels_like":278.97,"temp_min":278.97,"temp_max":278.97,"pressure":1023,"sea_level":1023,"grnd_level":935,"humidity":87,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.65,"deg":221,"gust":0.68},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-15 21:00:00"},{"dt":1708041600,"main":{"temp":278.76,"feels_like":278.76,"temp_min":278.76,"temp_max":278.76,"pressure":1022,"sea_level":1022,"grnd_level":934,"humidity":81,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.84,"deg":218,"gust":0.87},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-16 00:00:00"},{"dt":1708052400,"main":{"temp":277.88,"feels_like":277.88,"temp_min":277.88,"temp_max":277.88,"pressure":1021,"sea_level":1021,"grnd_level":933,"humidity":78,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":94},"wind":{"speed":0.86,"deg":240,"gust":0.84},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-16 03:00:00"},{"dt":1708063200,"main":{"temp":277.47,"feels_like":277.47,"temp_min":277.47,"temp_max":277.47,"pressure":1022,"sea_level":1022,"grnd_level":933,"humidity":74,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":93},"wind":{"speed":0.81,"deg":236,"gust":0.8},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-16 06:00:00"},{"dt":1708074000,"main":{"temp":281.46,"feels_like":281.46,"temp_min":281.46,"temp_max":281.46,"pressure":1022,"sea_level":1022,"grnd_level":935,"humidity":64,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":95},"wind":{"speed":0.51,"deg":32,"gust":0.4},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-16 09:00:00"},{"dt":1708084800,"main":{"temp":284.31,"feels_like":282.97,"temp_min":284.31,"temp_max":284.31,"pressure":1021,"sea_level":1021,"grnd_level":935,"humidity":57,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":88},"wind":{"speed":1.34,"deg":34,"gust":0.99},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-16 12:00:00"},{"dt":1708095600,"main":{"temp":283.71,"feels_like":282.52,"temp_min":283.71,"temp_max":283.71,"pressure":1021,"sea_level":1021,"grnd_level":934,"humidity":65,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":1.28,"deg":39,"gust":1.26},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-16 15:00:00"},{"dt":1708106400,"main":{"temp":279.89,"feels_like":279.89,"temp_min":279.89,"temp_max":279.89,"pressure":1022,"sea_level":1022,"grnd_level":935,"humidity":83,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":99},"wind":{"speed":0.45,"deg":172,"gust":0.43},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-16 18:00:00"},{"dt":1708117200,"main":{"temp":279.16,"feels_like":279.16,"temp_min":279.16,"temp_max":279.16,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":80,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":67},"wind":{"speed":0.93,"deg":224,"gust":0.84},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-16 21:00:00"},{"dt":1708128000,"main":{"temp":278.61,"feels_like":278.61,"temp_min":278.61,"temp_max":278.61,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":78,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":52},"wind":{"speed":1.21,"deg":228,"gust":1.12},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-17 00:00:00"},{"dt":1708138800,"main":{"temp":278.16,"feels_like":278.16,"temp_min":278.16,"temp_max":278.16,"pressure":1024,"sea_level":1024,"grnd_level":935,"humidity":76,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":47},"wind":{"speed":1.3,"deg":214,"gust":1.2},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-17 03:00:00"},{"dt":1708149600,"main":{"temp":277.76,"feels_like":277.76,"temp_min":277.76,"temp_max":277.76,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":74,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":60},"wind":{"speed":1.02,"deg":228,"gust":0.93},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-17 06:00:00"},{"dt":1708160400,"main":{"temp":282.26,"feels_like":282.26,"temp_min":282.26,"temp_max":282.26,"pressure":1025,"sea_level":1025,"grnd_level":938,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":50},"wind":{"speed":0.66,"deg":6,"gust":0.41},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-17 09:00:00"},{"dt":1708171200,"main":{"temp":285.19,"feels_like":283.91,"temp_min":285.19,"temp_max":285.19,"pressure":1025,"sea_level":1025,"grnd_level":938,"humidity":56,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":45},"wind":{"speed":1.69,"deg":39,"gust":0.97},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-17 12:00:00"},{"dt":1708182000,"main":{"temp":284.85,"feels_like":283.69,"temp_min":284.85,"temp_max":284.85,"pressure":1025,"sea_level":1025,"grnd_level":938,"humidity":62,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03d"}],"clouds":{"all":26},"wind":{"speed":1.8,"deg":46,"gust":1.39},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-17 15:00:00"},{"dt":1708192800,"main":{"temp":280.38,"feels_like":280.38,"temp_min":280.38,"temp_max":280.38,"pressure":1027,"sea_level":1027,"grnd_level":939,"humidity":87,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":28},"wind":{"speed":0.35,"deg":96,"gust":0.67},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-17 18:00:00"},{"dt":1708203600,"main":{"temp":279.67,"feels_like":279.67,"temp_min":279.67,"temp_max":279.67,"pressure":1028,"sea_level":1028,"grnd_level":940,"humidity":88,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":13},"wind":{"speed":0.81,"deg":222,"gust":0.89},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-17 21:00:00"},{"dt":1708214400,"main":{"temp":279.1,"feels_like":279.1,"temp_min":279.1,"temp_max":279.1,"pressure":1029,"sea_level":1029,"grnd_level":940,"humidity":90,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":27},"wind":{"speed":0.92,"deg":235,"gust":0.91},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-18 00:00:00"},{"dt":1708225200,"main":{"temp":278.56,"feels_like":278.56,"temp_min":278.56,"temp_max":278.56,"pressure":1028,"sea_level":1028,"grnd_level":939,"humidity":91,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":67},"wind":{"speed":1.04,"deg":208,"gust":0.94},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-18 03:00:00"},{"dt":1708236000,"main":{"temp":277.91,"feels_like":277.91,"temp_min":277.91,"temp_max":277.91,"pressure":1028,"sea_level":1028,"grnd_level":940,"humidity":90,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":35},"wind":{"speed":0.88,"deg":263,"gust":0.82},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-18 06:00:00"},{"dt":1708246800,"main":{"temp":282.11,"feels_like":282.11,"temp_min":282.11,"temp_max":282.11,"pressure":1029,"sea_level":1029,"grnd_level":941,"humidity":74,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":1},"wind":{"speed":0.43,"deg":347,"gust":0.77},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-18 09:00:00"},{"dt":1708257600,"main":{"temp":284.66,"feels_like":283.38,"temp_min":284.66,"temp_max":284.66,"pressure":1027,"sea_level":1027,"grnd_level":941,"humidity":58,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":2},"wind":{"speed":1.96,"deg":21,"gust":1.26},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-18 12:00:00"},{"dt":1708268400,"main":{"temp":284.34,"feels_like":283.11,"temp_min":284.34,"temp_max":284.34,"pressure":1027,"sea_level":1027,"grnd_level":940,"humidity":61,"temp_kf":0},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}],"clouds":{"all":9},"wind":{"speed":1.6,"deg":42,"gust":1.04},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-18 15:00:00"},{"dt":1708279200,"main":{"temp":280.18,"feels_like":280.18,"temp_min":280.18,"temp_max":280.18,"pressure":1027,"sea_level":1027,"grnd_level":939,"humidity":82,"temp_kf":0},"weather":[{"id":801,"main":"Clouds","description":"few clouds","icon":"02n"}],"clouds":{"all":12},"wind":{"speed":0.53,"deg":130,"gust":0.66},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-18 18:00:00"},{"dt":1708290000,"main":{"temp":279.39,"feels_like":279.39,"temp_min":279.39,"temp_max":279.39,"pressure":1027,"sea_level":1027,"grnd_level":939,"humidity":84,"temp_kf":0},"weather":[{"id":802,"main":"Clouds","description":"scattered clouds","icon":"03n"}],"clouds":{"all":35},"wind":{"speed":1.22,"deg":207,"gust":1.18},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-18 21:00:00"},{"dt":1708300800,"main":{"temp":279.53,"feels_like":279.53,"temp_min":279.53,"temp_max":279.53,"pressure":1026,"sea_level":1026,"grnd_level":938,"humidity":82,"temp_kf":0},"weather":[{"id":803,"main":"Clouds","description":"broken clouds","icon":"04n"}],"clouds":{"all":67},"wind":{"speed":0.93,"deg":191,"gust":0.9},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-19 00:00:00"},{"dt":1708311600,"main":{"temp":279.27,"feels_like":279.27,"temp_min":279.27,"temp_max":279.27,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":84,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.39,"deg":238,"gust":0.5},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-19 03:00:00"},{"dt":1708322400,"main":{"temp":278.83,"feels_like":278.83,"temp_min":278.83,"temp_max":278.83,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":86,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":100},"wind":{"speed":0.65,"deg":302,"gust":0.65},"visibility":10000,"pop":0,"sys":{"pod":"n"},"dt_txt":"2024-02-19 06:00:00"},{"dt":1708333200,"main":{"temp":280.11,"feels_like":280.11,"temp_min":280.11,"temp_max":280.11,"pressure":1025,"sea_level":1025,"grnd_level":937,"humidity":83,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":1.07,"deg":9,"gust":1.49},"visibility":10000,"pop":0,"sys":{"pod":"d"},"dt_txt":"2024-02-19 09:00:00"},{"dt":1708344000,"main":{"temp":282.25,"feels_like":281.93,"temp_min":282.25,"temp_max":282.25,"pressure":1024,"sea_level":1024,"grnd_level":937,"humidity":69,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10d"}],"clouds":{"all":100},"wind":{"speed":1.36,"deg":359,"gust":1.42},"visibility":10000,"pop":0.2,"rain":{"3h":0.24},"sys":{"pod":"d"},"dt_txt":"2024-02-19 12:00:00"},{"dt":1708354800,"main":{"temp":281.35,"feels_like":280.51,"temp_min":281.35,"temp_max":281.35,"pressure":1023,"sea_level":1023,"grnd_level":936,"humidity":76,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04d"}],"clouds":{"all":100},"wind":{"speed":1.72,"deg":39,"gust":1.86},"visibility":10000,"pop":0.3,"sys":{"pod":"d"},"dt_txt":"2024-02-19 15:00:00"},{"dt":1708365600,"main":{"temp":278.4,"feels_like":278.4,"temp_min":278.4,"temp_max":278.4,"pressure":1024,"sea_level":1024,"grnd_level":936,"humidity":92,"temp_kf":0},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"clouds":{"all":93},"wind":{"speed":0.21,"deg":271,"gust":0.78},"visibility":10000,"pop":0.22,"sys":{"pod":"n"},"dt_txt":"2024-02-19 18:00:00"}],"city":{"id":3163858,"name":"TEST","coord":{"lat":0,"lon":0},"country":"T1","population":0,"timezone":3600,"sunrise":1707891512,"sunset":1707928929}};
    }

    let units = getUnits();
    updateUnit(units);

    // Get the data from the cache
    let data = sessionStorage.getItem(units + "-f-" + (cityName == 0 ? latitude + "-" + longitude : cityName));
    if (data) {
        return JSON.parse(data);
    }

    let endpoint = "https://api.openweathermap.org/data/2.5/forecast?";

    if (cityName != 0) {
        endpoint += "q=" + cityName;
    } else {
        endpoint += "&lat=" + latitude + "&lon=" + longitude;
    }

    endpoint += "&units=" + (units == 0 ? "imperial" : "metric");

    endpoint += "&appid=" + APIKEY;

    data = await fetch(endpoint);
    data = await data.text();

    // Cache the data
    sessionStorage.setItem(units + "-f-" + (cityName == 0 ? latitude + "-" + longitude : cityName), data);
    return JSON.parse(data);
}

function displayWeather(data) {
    const accordionParent = document.getElementById("forecastAccordion");

    document.getElementById("cityName").innerHTML = "<b>" + data.city.name + ", " + data.city.country + "</b>";

    for (let i = 0; i < data.list.length; i++) {
        let icon = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + ".png";
        const date = new Date(data.list[i].dt * 1000);
        const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let units = getUnits();
        let dateStamp;
        let mainDescription = data.list[i].weather[0].main;
        let temp = data.list[i].main.temp;
        let tempMax = data.list[i].main.temp_max;
        let tempMin = data.list[i].main.temp_min;

        let description = data.list[i].weather[0].description;
        description = description.charAt(0).toUpperCase() + description.slice(1)
        let feelsLike = data.list[i].main.feels_like;
        let pressure = data.list[i].main.pressure;
        let pressureUnit = units ? "hPa" : "in";
        let humidity = data.list[i].main.humidity;
        let wind = data.list[i].wind.speed;
        let windUnit = units ? "Km/s" : "mph";
        let pop = data.list[i].pop * 100;
        let visibility = data.list[i].visibility / 1000;
        let visibilityUnit = units ? "Km" : "mi";
        let cloudiness = data.list[i].clouds.all;
        let sunrise = new Date(data.city.sunrise * 1000);
        let sunset = new Date(data.city.sunset * 1000);
        let dewPoint;
        let unitTemp = units ? "F" : "C";

        let rain = "";
        if (data.list[i].rain) {
            rain = `<h4 class="fs-5">Rain: ${data.list[i].rain["3h"]} mm</h4>`;
        }
        let snow = "";
        if (data.list[i].snow) {
            snow = `<h4 class="fs-5">Snow: ${data.list[i].snow["3h"]} mm</h4>`;
        }
        
        if (units) { // Metric
            dateStamp = weekDays[date.getDay()] + " " + date.getDate() + " - " + date.getHours() + ":00";
            wind = (wind * 3.6).toFixed(2); // CHECKpop
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " AM";
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " PM";
            dewPoint = (temp - ((100 - humidity) / 5)).toFixed(1);
        } else { // Imperial
            dateStamp = weekDays[date.getDay()] + " " + date.getDate() + " - " + date.toLocaleString('en-US', {hour: 'numeric', hour12: true});
            visibility = (visibility * 0.6213711922).toFixed(2);
            pressure = (pressure * 0.0295299831).toFixed(2);
            sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
            dewPoint = (((5/9 * (temp - 32)) - ((100 - humidity) / 5)) * (9/5) + 32).toFixed(1);
        }

        accordionParent.innerHTML += `
        <div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                    <div class="container m-0 text-center">
                        <div class="row">
                            <div class="col">
                                <img src="${icon}" alt="Icon" class="bg-body rounded-circle">
                            </div>
                            <div class="col">
                                <h3 class="fs-5"><b>${dateStamp}</b></h3>
                            </div>
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${mainDescription}</h3>
                            </div>
                        
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${temp}° ${unitTemp}</h3>
                            </div>
                            <div class="col forecastDesktop">
                                <h3 class="fs-5">${tempMax}°/${tempMin}° ${unitTemp}</h3>
                            </div>
                        </div>
                    </div>
                </button>
            </h2>
            <div id="collapse${i}" class="accordion-collapse collapse" data-bs-parent="#forecastAccordion">
                <div class="accordion-body">
                    <h4><b>${description}</b></h4>
                    <h4 class="forecastMobile">Temperature: <b>${temp}° ${unitTemp}</b></h4>
                    <h4 class="forecastMobile">${tempMax}°/${tempMin}° ${unitTemp}</h4>
                    <h4 class="fs-5">Feels like: ${feelsLike}° ${unitTemp}</h4>
                    <h4 class="fs-5">Dew point: ${dewPoint}° ${unitTemp}</h4>
                    <h4 class="fs-5">Cloudiness: ${cloudiness}%</h4>
                    <h4 class="fs-5">Humidity: ${humidity}%</h4>
                    <h4 class="fs-5">Wind: ${wind} ${windUnit}</h4>
                    ${rain}
                    <h4 class="fs-5">Probability of precipitation: ${pop}%</h4>
                    ${snow}
                    <h4 class="fs-5">Pressure: ${pressure} ${pressureUnit}</h4>
                    <h4 class="fs-5">Visibility: ${visibility} ${visibilityUnit}</h4>
                    <h4 class="fs-5">Sunrise: ${sunrise}</h4>
                    <h4 class="fs-5">Sunset: ${sunset}</h4>
                </div>
            </div>
        </div>
        `
    }
}

// Set the unit in a cookie
function setUnit(unit) {
    if (unit == 0) {
        setCookie("unit", "0", 364);
    } else {
        setCookie("unit", "1", 364);
    }
    location.reload();
}

function updateUnit(unit) {
    if (unit == 0) {
        document.getElementById("radioFahrenheit").checked = true;
    } else {
        document.getElementById("radioCelsius").checked = true;
    }
}

function getUnits() {
    return Number(getCookie("unit"));
}

// Set a cookie
function setCookie(name, value, additionalDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + ((cookiesExpiresDays + additionalDays) * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
// Get a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}