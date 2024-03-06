// Mode 0 = City Name
// Mode 1 = Latitude and Longitude
// Unit 0 = Imperial
// Unit 1 = Metric

// This API key is provided by OpenWeatherMap.org
// You can get your own API key by signing up for a FREE FOREVER account on https://home.openweathermap.org/users/sign_up
const APIKEY = "84b3fab687879f825802c0ad57147510";
const cookiesExpiresDays = 1;
const debugMode = false;

const toastLiveExample = document.getElementById('liveToastForecast');
const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample).show();

// Load the weather on the home page
function home() {
    let error = getCookie("error");
    if (error != "") {
        switch (error) {
            case "not_supported":
                document.getElementById("card-header").innerHTML = "Geolocation is not supported";
                break;
            case "denied":
                document.getElementById("card-header").innerHTML = "Geolocation has been denied";
                break;
            case "unavailable":
                document.getElementById("card-header").innerHTML = "Geolocation is unavailable";
                break;
            case "timed_out":
                document.getElementById("card-header").innerHTML = "Geolocation has timed out";
                break;
        }

        getWeather("London, GB", mode = 0).then(
            data => {
                displayWeather(data);
            }
        );

    } else if (getCookie("latitude") != "" && getCookie("longitude") != "") {
        getWeather(0, latitude = getCookie("latitude"), longitude = getCookie("longitude"), mode = 1).then(
            data => {
                if (data.cod == "404") {
                    document.getElementById("card-header").innerHTML = "City not found";
                    document.getElementById("card-body").innerHTML = `
                    <li class="list-group-item d-flex flex-column justify-content-center">
                        <h5 class="card-title w-100 mx-auto">${cityName}</h5>
                    </li>
                    <li class="list-group-item d-flex flex-column justify-content-center">
                        <h5 class="card-title mx-auto w-100">Cannot find the city you searched for</h5>
                        <h6 class="card-title mx-auto w-100">Make sure you typed it rigth or try adding the country code after a comma</h6>
                    </li>
                    <li class="card-footer d-flex justify-content-center">
                        <h6 class="card-subtitle my-1 text-muted w-100 mx-auto">Weather data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a></h6>
                        <img src="/img/OpenWeather-Master-Logo-RGB.png" alt="OpenWeather logo" class="w-50">
                    </li>`;
                } else {
                    displayWeather(data);
                }
            }
        );

    } else {
        getLocation();
    }
}
// Load the weather on the search page 
function search() {
    const urlParams = new URLSearchParams(window.location.search);
    let cityName = urlParams.get('city');

    document.title = "Search " + cityName.charAt(0).toUpperCase() + cityName.slice(1) + " - IvanWeather";
    document.getElementById("searchForecastLink").setAttribute("href", "/forecast/search?city=" + cityName);

    getWeather(cityName, mode = 0).then(
        data => {
            if (data.cod == "404") {
                document.getElementById("card-header").innerHTML = "City not found";
                document.getElementById("card-body").innerHTML = `
                <li class="list-group-item d-flex flex-column justify-content-center">
                    <h5 class="card-title w-100 mx-auto">${cityName}</h5>
                </li>
                <li class="list-group-item d-flex flex-column justify-content-center">
                    <h5 class="card-title mx-auto w-100">Cannot find the city you searched for</h5>
                    <h6 class="card-title mx-auto w-100">Make sure you typed it rigth or try adding the country code after a comma</h6>
                </li>
                <li class="card-footer d-flex justify-content-center">
                    <h6 class="card-subtitle my-1 text-muted w-100 mx-auto">Weather data provided by <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer">OpenWeather</a></h6>
                    <img src="/img/OpenWeather-Master-Logo-RGB.png" alt="OpenWeather logo" class="w-50">
                </li>`;
            } else {
                displayWeather(data);
            }
        }
    );
}

// Get the weather from the API
async function getWeather(cityName, latitude = 0, longitude = 0, mode = 0, unit = -1) {
    if (unit == -1) {
        unit = Number(getCookie("unit"));
        updateUnit(unit);
    }

    // Get the data from the cache
    let data = sessionStorage.getItem(unit + "-" + cityName);
    if (data) {
        return JSON.parse(data);
    }

    let url = "https://api.openweathermap.org/data/2.5/weather?lang=en&appid=" + APIKEY
    
    if (mode == 0) {
        url += "&q=" + cityName;
    } else {
        url += "&lat=" + latitude + "&lon=" + longitude;
    }
    
    if (unit == 0) {
        url += "&units=imperial";
    } else if (unit == 1) {
        url += "&units=metric";
    }

    if (debugMode) {
        url = "/debug/main.json";
    }

    data = await fetch(url);
    data = await data.text();

    // Cache the data
    sessionStorage.setItem(unit + "-" + cityName, data);
    return JSON.parse(data);
}

// Display the weather in the container
function displayWeather(data) {
    let unit = Number(getCookie("unit"));

    let tempUnit = unit == 0 ? " °F" : " °C";
    let windDegrees = data["wind"]["deg"];
    let windArrow = document.getElementById("windArrow");
    let sunrise = new Date(data.sys.sunrise * 1000);
    let sunset = new Date(data.sys.sunset * 1000);

    document.getElementById("spCity").innerHTML = data.name;
    document.getElementById("spCountry").innerHTML = data.sys.country;
    document.getElementById("spMax").innerHTML = data.main.temp_max;
    document.getElementById("spMin").innerHTML = data.main.temp_min + tempUnit;
    document.getElementById("spTemp").innerHTML = data.main.temp + tempUnit;
    document.getElementById("spFelt").innerHTML = data.main.feels_like + tempUnit;
    document.getElementById("spDescription").innerHTML = data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1);
    document.getElementById("spClouds").innerHTML = data.clouds.all;
    document.getElementById("spHumidity").innerHTML = data.main.humidity;
    document.getElementById("windDegrees").innerHTML = windDegrees + "°";
    windDegrees = windDegrees + 180; // The arrow is pointing to the opposite direction because of the meteorological convention
    windArrow.style.mozTransform    = 'rotate('+windDegrees+'deg)';
    windArrow.style.msTransform     = 'rotate('+windDegrees+'deg)';
    windArrow.style.oTransform      = 'rotate('+windDegrees+'deg)';
    windArrow.style.transform       = 'rotate('+windDegrees+'deg)';

    if (data.rain) {
        let spRain = document.getElementById("spRain");
        spRain.innerHTML = data.rain["1h"];
        spRain.parentNode.style.display = "block";
    }
    if (data.snow) {
        let spSnow = document.getElementById("spSnow");
        spSnow.innerHTML = data.snow["1h"];
        spSnow.parentNode.style.display = "block";
    }

    if (unit == 0) { // Imperial
        document.getElementById("spVisibility").innerHTML = (data.visibility * 0.0006213712).toFixed(2); // Miles
        document.getElementById("spPressure").innerHTML = (data.main.pressure * 0.0295299831).toFixed(2); // Inches of mercury
        document.getElementById("spWind").innerHTML = data.wind.speed; // Miles per hour

        document.getElementById("spVisibilityUnit").innerHTML = "mi";
        document.getElementById("spPressureUnit").innerHTML = "in";
        document.getElementById("spWindUnit").innerHTML = "mph";

        sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
        sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric'});
    } else { // Metric
        document.getElementById("spVisibility").innerHTML = data.visibility / 1000; // Km
        document.getElementById("spPressure").innerHTML = data.main.pressure; // hPa
        document.getElementById("spWind").innerHTML = (data.wind.speed * 3.6).toFixed(2); // Km/h

        document.getElementById("spVisibilityUnit").innerHTML = "km";
        document.getElementById("spPressureUnit").innerHTML = "hPa";
        document.getElementById("spWindUnit").innerHTML = "km/h";

        sunrise = sunrise.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " AM";
        sunset = sunset.toLocaleTimeString('en-US', { hour: 'numeric', hour12: false, minute: 'numeric'}) + " PM";
    }

    document.getElementById("spDewPoint").innerHTML = (data.main.temp - ((100 - data.main.humidity) / 5)).toFixed(1) + tempUnit;
    document.getElementById("spSunrise").innerHTML = sunrise;
    document.getElementById("spSunset").innerHTML = sunset;

    document.getElementById("spImg").innerHTML = "<img src='https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png' alt='Icon' style='width: 50px; height: 50px;'>";

    let placeholders = Array.from(document.getElementsByClassName("placeholder"));
    for (let i = 0; i < placeholders.length; i++) {
        placeholders[i].classList.remove("placeholder");
        placeholders[i].classList.remove("w-25");
        placeholders[i].classList.remove("w-50");
        placeholders[i].classList.remove("w-75");
        placeholders[i].classList.add("w-100");
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

// Set a cookie
function setCookie(name, value, additionalDays = 0) {
    const d = new Date();
    d.setTime(d.getTime() + ((cookiesExpiresDays + additionalDays) * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/; Secure; SameSite=Strict;";
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

// Get the location of the user from the browser
function getLocation() {
    if (!navigator.geolocation) {
        setCookie("error", "not_supported");
        location.reload();
    } else {
        document.getElementById("card-header").innerHTML = "Getting your location...";
        document.getElementById("card-body").innerHTML = `
        <img src='/img/loading.gif' class='w-100' style='cursor: wait;'>
        <h6 class="mt-2">This could take up to 10 seconds</h6>`;
        navigator.geolocation.getCurrentPosition((position) => {
            // Success
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            setCookie("latitude", latitude);
            setCookie("longitude", longitude);
            location.reload();
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED) {
                setCookie("error", "denied");
            } else if (error.code == error.POSITION_UNAVAILABLE) {
                setCookie("error", "unavailable");
            } else if (error.code == error.TIMEOUT) {
                setCookie("error", "timed_out");
            }
            location.reload();
        });
    }
}