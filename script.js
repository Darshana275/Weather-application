let apiKey = "433fd0c3atb823990ocfd74fb81dcb04";

// Main search function
function searching(event) {
  event.preventDefault();

  let cityname = document.querySelector("#city").value;
  let heading = document.querySelector(".current-weather .info h1");
  heading.innerHTML = `${cityname.charAt(0).toUpperCase() + cityname.slice(1)}`;

  let currentUrl = `https://api.shecodes.io/weather/v1/current?query=${cityname}&key=${apiKey}`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${cityname}&key=${apiKey}`;

  axios.get(currentUrl).then(response => {
  ChangeTemp(response);
  displayCityTime(response); // ✅ This one uses response.data.time
  }).catch(handleError);


  axios.get(forecastUrl).then(response => { 
    displayForecast(response);
  }).catch(handleError);
}

// Show current temperature, humidity, and wind
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

function displayCityTime(response) {
  const unixTime = response.data.time; // ✅ accurate local city time from SheCodes API
  const condition = response.data.condition.description;

  if (!unixTime) {
    console.error("City time not found in response.");
    return;
  }

  const cityDate = new Date(unixTime * 1000); // convert UNIX seconds → JS Date

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = weekDays[cityDate.getDay()];
  const hour = cityDate.getHours().toString().padStart(2, "0");
  const minutes = cityDate.getMinutes().toString().padStart(2, "0");

  document.querySelector(".current-weather .day-time h3").innerHTML =
    `${day} ${hour}:${minutes}, ${condition}`;
}



// Display next 5-day forecast
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

// Show alert on error
function handleError(error) {
  console.error("API Error:", error);
  alert("Could not fetch weather data. Please check the city name.");
}

// Attach event listener
let search = document.querySelector("#search-box");
search.addEventListener("submit", searching);
