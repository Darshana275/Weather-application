let apiKey = "433fd0c3atb823990ocfd74fb81dcb04";

// Event handler for form submission
function searching(event) {
  event.preventDefault();
  let cityname = document.querySelector("#city").value;
  searchCity(cityname);
}

// Unified function to search weather for a city
function searchCity(cityname) {
  let heading = document.querySelector(".current-weather .info h1");
  heading.innerHTML = `${cityname.charAt(0).toUpperCase() + cityname.slice(1)}`;

  let currentUrl = `https://api.shecodes.io/weather/v1/current?query=${cityname}&key=${apiKey}`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityname}&key=${apiKey}`;

  // Current weather
  axios.get(currentUrl).then(response => {
    ChangeTemp(response);
    displayCityTime(response);
  }).catch(handleError);

  // 5-day forecast
  axios.get(forecastUrl).then(response => {
    displayForecast(response);
  }).catch(handleError);
}

// Display temperature, humidity, and wind
function ChangeTemp(response) {
  let currtemp = document.querySelector(".current-weather .temp");
  currtemp.innerHTML = `☁️ ${Math.round(response.data.temperature.current)}°C`;

  let humidity = response.data.temperature.humidity;
  let windSpeed = response.data.wind.speed;
  let weatherDescription = response.data.condition.description;

  let humidWindElement = document.querySelector(".current-weather .humid-wind h3");
  humidWindElement.innerHTML = `
    Humidity: <strong>${humidity}%</strong>, 
    Wind: <strong>${windSpeed} km/h</strong>
  `;
}

// Display local city time and condition
function displayCityTime(response) {
  const unixTime = response.data.time;
  const condition = response.data.condition.description;

  if (!unixTime) {
    console.error("City time not found in response.");
    return;
  }

  const cityDate = new Date(unixTime * 1000);

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = weekDays[cityDate.getDay()];
  
  let hour = cityDate.getHours();
  const minutes = cityDate.getMinutes().toString().padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;

  document.querySelector(".current-weather .day-time h3").innerHTML =
    `${day} ${hour}:${minutes} ${ampm}, ${condition}`;
}

// Display 5-day forecast
function displayForecast(response) {
  let forecastData = response.data.daily.slice(1, 6); // Skip today
  let forecastContainer = document.querySelector(".forecast");

  let weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastHTML = "";

  forecastData.forEach(day => {
    let date = new Date(day.time * 1000);
    let dayName = weekDays[date.getDay()];
    let icon = day.condition.icon_url;
    let max = Math.round(day.temperature.maximum);
    let min = Math.round(day.temperature.minimum);

    forecastHTML += `
      <div>
        <p>${dayName}</p>
        <img src="${icon}" alt="${day.condition.description}" width="50"/>
        <p>${max}° ${min}°</p>
      </div>
    `;
  });

  forecastContainer.innerHTML = forecastHTML;
}

// Auto-detect user's location and load weather
function autoDetectLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const geoUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiKey}`;
        axios.get(geoUrl).then(response => {
          const city = response.data.city;
          document.querySelector("#city").value = city;
          searchCity(city);
        }).catch(error => {
          console.error("Geo lookup failed:", error);
          fallbackToDefault();
        });
      },
      error => {
        console.warn("Location access denied.");
        fallbackToDefault();
      }
    );
  } else {
    fallbackToDefault();
  }
}

// Fallback if location detection fails
function fallbackToDefault() {
  const defaultCity = "New Delhi";
  document.querySelector("#city").value = defaultCity;
  searchCity(defaultCity);
}

// Show error
function handleError(error) {
  console.error("API Error:", error);
  alert("Could not fetch weather data. Please check the city name.");
}

// Event listener for form
let search = document.querySelector("#search-box");
search.addEventListener("submit", searching);

// On page load
autoDetectLocation();
