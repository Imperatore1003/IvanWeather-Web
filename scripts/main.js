// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
// Unit 0 = Imperial
// Unit 1 = Metric

const APIKEY = "84b3fab687879f825802c0ad57147510";
const cookiesExpiresDays = 1;

// Load the home page weather
function home() {
    if (getCookie("latitude") != "" && getCookie("longitude") != "") {
        document.getElementById("container").style.display = "block";

        city = getWeather(0, getCookie("latitude"), getCookie("longitude"), 1);

        displayWeather(city);

    } else {
        document.getElementById("status").style.display = "block";
        document.getElementById("container").style.display = "none";

        getLocation();
    }
}
// Load the search page weather
function search() {
    cityName = GetParameter("city");

    document.title = "Search " + cityName + " - IvanWeather";
    
    document.getElementById("container").style.display = "block";

    city = getWeather(cityName);
    displayWeather(city);
}

// Get the weather from the API
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

    // TEST API RESPONSE
    return '{"coord":{"lon":-0.1257,"lat":51.5085},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":32.77,"feels_like":25.79,"temp_min":29.75,"temp_max":36.18,"pressure":993,"humidity":80},"visibility":10000,"wind":{"speed":8.01,"deg":40,"gust":13},"clouds":{"all":100},"dt":1705521210,"sys":{"type":2,"id":268730,"country":"GB","sunrise":1705478291,"sunset":1705508528},"timezone":0,"id":2643743,"name":"London","cod":200}';
}

// Display the weather in the container
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
        document.getElementById("spVisibility").innerHTML = (city["wind"]["speed"] * 2.237).toFixed(2);
        document.getElementById("spPressure").innerHTML = (city["main"]["pressure"] / 33.864).toFixed(2);
        document.getElementById("spWind").innerHTML = (city["visibility"] / 1.609).toFixed(2);

    } else {
        document.getElementById("spVisibility").innerHTML = city["visibility"];
        document.getElementById("spPressure").innerHTML = city["main"]["pressure"];
        document.getElementById("spWind").innerHTML = city["wind"]["speed"];
    }

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

// Set the unit in a cookie
function setUnit(unit) {
    if (unit == 0) {
        setCookie("unit", "imperial", 364);
    } else {
        setCookie("unit", "metric", 364);
    }
}

// Set a cookie
function setCookie(name, value, additionalDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + ((cookiesExpiresDays + additionalDays) * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}
// Get a cookie
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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

// Function to display a message
function mystatus(status) {
    document.getElementById('status').innerHTML = "<p>" + status + "</p>";
}
// Function to get the location
function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    setCookie("latitude", latitude);
    setCookie("longitude", longitude);
    location.reload();
}
// Display an error message if the location cannot be retrieved
function error() {
    mystatus('Unable to retrieve your location');
}

// Get the location of the user from the browser
function getLocation() {
    if (!navigator.geolocation) {
         mystatus('Geolocation is not supported by your browser');
     } else {
         mystatus("Getting your location...");
         navigator.geolocation.getCurrentPosition(success, error);
     } 
 }

// Get a parameter from the URL
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