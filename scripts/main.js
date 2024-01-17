// const radios = document.querySelectorAll('.form-check-input')
// for (const radio of radios) {
//     radio.onclick = (e) => {
//         let units = document.querySelector("label[for='" + radio.id + "']").innerHTML.trim();
//         units = units === "Celsius" ? 1 : 0;
//         let url = window.location.href;

//         let dict_values = {units, url} //Pass the javascript variables to a dictionary.
//         let s = JSON.stringify(dict_values); // Stringify converts a JavaScript object or value to a JSON string
//         $.ajax({
//             url:"/setUnits",
//             type:"POST",
//             contentType: "application/json",
//             data: JSON.stringify(s),
//             complete: function (data) {
//                 window.location.href = url;
//             }
//         });
//     }
// }

const APIKEY = "84b3fab687879f825802c0ad57147510";

function home() {
    if (getCookie("latitude") != "" && getCookie("longitude") != "") {
        document.getElementById("container").style.display = "block";

        city = getWeather(0, getCookie("latitude"), getCookie("longitude"));

        displayWeather(city);

    } else {
        document.getElementById("status").style.display = "block";
        document.getElementById("container").style.display = "none";

        getLocation();
    }
}

function search() {
    cityName = GetParameter("city");

    document.title = "Search " + cityName + " - IvanWeather"
    
    document.getElementById("container").style.display = "block";

    city = getWeather(cityName);
    displayWeather(city);
}

function setCookie(name, value) {
    const d = new Date();
    const exdays = 7;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setCookie("latitude", latitude);
    setCookie("longitude", longitude);
    location.reload();
}

function error() {
    mystatus('Unable to retrieve your location');
}

function mystatus(status) {
    document.getElementById('status').innerHTML = "<p>" + status + "</p>";
}

function getLocation() {
   if (!navigator.geolocation) {
        mystatus('Geolocation is not supported by your browser');
    } else {
        mystatus("Getting your location...");
        navigator.geolocation.getCurrentPosition(success, error);
    } 
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
function getWeather(cityName, latitude = 0, longitude = 0, mode = 0, unit = 0) {
    let url = "https://api.openweathermap.org/data/2.5/weather?lang=en&appid=" + APIKEY
    
    if (mode == 0) {
        url += "&q=" + cityName;
    } else {
        url += "&lat=" + latitude + "&lon=" + longitude;
    }

    if (unit == 0) {
        url += "&units=imperial";
    } else {
        url += "&units=metric";
    }

    console.log(url);

    // Ritorna una stringa statica per non consumare chiamate a OpenWeatherMap
    if (latitude != 0) {
        return cityString1;
    } else {
        return cityString2;
    }
}

function displayWeather(city, metric = 0) {
    city = JSON.parse(city);

    document.getElementById("spCity").innerHTML = city["name"];
    document.getElementById("spCountry").innerHTML = city["sys"]["country"];
    document.getElementById("spMax").innerHTML = city[""];
    document.getElementById("spMax").innerHTML = city["main"]["temp_max"];
    document.getElementById("spMin").innerHTML = city["main"]["temp_min"];
    document.getElementById("spTemp").innerHTML = city["main"]["temp"];
    document.getElementById("spFelt").innerHTML = city["main"]["feels_like"];
    document.getElementById("spWeather").innerHTML = city["weather"][0]["main"];
    document.getElementById("spDescription").innerHTML = city["weather"][0]["description"];
    document.getElementById("spClouds").innerHTML = city["clouds"]["all"];
    document.getElementById("spHumidity").innerHTML = city["main"]["humidity"];

    if (metric == 0) {
        // document.getElementById("spVisibility").innerHTML = Math.round(city["wind"]["speed"] * 2.237, 2);
        document.getElementById("spVisibility").innerHTML = (city["wind"]["speed"] * 2.237).toFixed(2);
        // document.getElementById("spPressure").innerHTML = Math.round(city["main"]["pressure"] / 33.864 , 2);
        document.getElementById("spPressure").innerHTML = (city["main"]["pressure"] / 33.864).toFixed(2);
        // document.getElementById("spWind").innerHTML = Math.round(city["visibility"] / 1.609, 2);
        document.getElementById("spWind").innerHTML = (city["visibility"] / 1.609).toFixed(2);

    } else {
        document.getElementById("spVisibility").innerHTML = city["visibility"];
        document.getElementById("spPressure").innerHTML = city["main"]["pressure"];
        document.getElementById("spWind").innerHTML = city["wind"]["speed"];
    }

    // document.getElementById("spDewPoint").innerHTML = Math.round(city["main"]["temp"] - ((100 - city["main"]["humidity"]) / 5), 2);
    document.getElementById("spDewPoint").innerHTML = (city["main"]["temp"] - ((100 - city["main"]["humidity"]) / 5)).toFixed(2);

    let sunrise = new Date((parseInt(city["sys"]["sunrise"]) + parseInt(city["timezone"])) * 1000);
    let formatted = sunrise.getUTCHours() + ":" + sunrise.getUTCMinutes() + ":" + sunrise.getUTCSeconds();
    document.getElementById("spSunrise").innerHTML = formatted;

    let sunset = new Date((parseInt(city["sys"]["sunset"]) + parseInt(city["timezone"])) * 1000);
    formatted = sunset.getUTCHours() + ":" + sunset.getUTCMinutes() + ":" + sunset.getUTCSeconds();
    document.getElementById("spSunset").innerHTML = formatted;
    
    if (metric == 0) {
        document.getElementById("spWindUnit").innerHTML = "mph";
        document.getElementById("spPressureUnit").innerHTML = "in";
        document.getElementById("spVisibilityUnit").innerHTML = "mi";

    } else {
        document.getElementById("spWindUnit").innerHTML = "km/h";
        document.getElementById("spPressureUnit").innerHTML = "hPa";
        document.getElementById("spVisibilityUnit").innerHTML = "km";
    }

    document.getElementById("spImg").innerHTML = '<img src="https://openweathermap.org/img/wn/' + city["weather"][0]["icon"] + '.png" alt="Icon" style="width: 50px; height: 50px;">';
}

function GetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

home();