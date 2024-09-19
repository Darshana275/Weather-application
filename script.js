let apiKey = "433fd0c3atb823990ocfd74fb81dcb04";

// Function to handle the search form submission
function searching(event) {
  event.preventDefault();
  console.log("hi");

  let cityname = document.querySelector("#city").value;
  let heading = document.querySelector(".current-weather .info h1");
  heading.innerHTML = `${cityname.charAt(0).toUpperCase() + cityname.slice(1)}`;

  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityname}&key=${apiKey}`;
  axios.get(apiUrl).then(ChangeTemp).catch(handleError); // Add error handling
}

function ChangeTemp(response) {
  let currtemp = document.querySelector(".current-weather .temp");
  currtemp.innerHTML = `☁️ ${Math.round(response.data.temperature.current)}°C`;

  let humidity = response.temperature.humidity;
  let windSpeed = response.data.wind.speed;
  let weatherDescription = response.data.condition.description;

  let humidWindElement = document.querySelector(".current-weather .humid-wind h3");
  humidWindElement.innerHTML = `
    Humidity: <strong>${humidity}%</strong>, 
    Wind: <strong>${windSpeed} km/h</strong>
  `;

  let now = new Date();
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = weekDays[now.getDay()];
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let hour = now.getHours().toString().padStart(2, "0");

  let dayTimeElement = document.querySelector(".current-weather .day-time h3");
  dayTimeElement.innerHTML = `${day} ${hour}:${minutes}, ${weatherDescription}`;
}

function updateDate() {
  const now = new Date();
  let weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let hour = now.getHours().toString().padStart(2, "0");
  let day = weekDays[now.getDay()];

  let dateTimeElement = document.querySelector(".current-weather .day-time h3");
  dateTimeElement.innerHTML = `${day} ${hour}:${minutes}, moderate rain`; // Static example condition
}

let search = document.querySelector("#search-box");
search.addEventListener("submit", searching);

updateDate();
