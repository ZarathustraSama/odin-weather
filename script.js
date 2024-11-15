const weatherKey = "9MM4ZNSTG4LERCPKJDW4ZSSQM";
const hiddenValues = [
  "tempmax",
  "tempmin",
  "feelslikemax",
  "feelslikemin",
  "feelslike",
  "humidity",
  "precip",
  "preciptype",
  "snow",
  "snowdepth",
  "description"
]
const degreeValues = [
  "tempmax",
  "tempmin",
  "temp",
  "feelslikemax",
  "feelslikemin",
  "feelslike"
]
const lengthValues = [
  "precip",
  "snow",
  "snowdepth"
]

async function getWeatherData(location) {
  try {
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${weatherKey}&contentType=json`);
    const data = await response.json();
    return data
  } catch (error) {
    console.error(error)
  }
}

function processWeatherData(data) {
  let cleanData = []
  for (const day of data) {
    cleanData.push({
      datetime: day.datetime,
      tempmax: day.tempmax,
      tempmin: day.tempmin,
      temp: day.temp,
      feelslikemax: day.feelslikemax,
      feelslikemin: day.feelslikemin,
      feelslike: day.feelslike,
      humidity: day.humidity,
      precip: day.precip,
      precipprob: day.precipprob,
      preciptype: day.preciptype,
      snow: day.snow,
      snowdepth: day.snowdepth,
      conditions: day.conditions,
      description: day.description      
    });
  }

  return cleanData;
}

function createRows(cleanData) {
  const tbody = document.querySelector("tbody");
  tbody.innerText = "";
  for (const day of cleanData) {
    const tr = document.createElement("tr");
    for (const [key, value] of Object.entries(day)) {
      const td = document.createElement("td");
      td.classList = hiddenValues.includes(key) ? `${key} hidden` : key;
      if (degreeValues.includes(key)) {
        td.classList.add("degrees");
      }
      if (lengthValues.includes(key)) {
        td.classList.add("length");
      }
      td.innerText = value;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
}

function showElement(element) {
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
  }
}

function hideElement(element) {
  if (!element.classList.contains("hidden")) {
    element.classList.add("hidden");
  }
}

function optionalElement(element) {
  const hidden = (element) => hiddenValues.includes(element);

  return element.classList.values().some(hidden);
}

function viewAll() {
  const hiddenElements = document.getElementsByClassName("hidden");
  for (const [_, element] of Object.entries(hiddenElements)) {
    showElement(element);
  }
}

function viewDefault() {
  const allHeaders = document.querySelectorAll("th");
  const allCells = document.querySelectorAll("td");

  for (const [_, element] of Object.entries(allHeaders)) {
    if (optionalElement(element)) {
      hideElement(element);
    }
  }
  for (const [_, element] of Object.entries(allCells)) {
    if (optionalElement(element)) {
      hideElement(element);
    }
  }
}

function toCelsius(degrees) {
  return ((degrees - 32) * 5/9).toFixed(1);
}

function toFahrenheit(degrees) {
  return ((degrees * 9/5) + 32).toFixed(1);
}

function toCentimeters(length) {
  return (length * 2.54).toFixed(1);
} 

function toInches(length) {
  return (length/2.54).toFixed(1);
}

function convertToMetric() {
  const degreeValues = document.getElementsByClassName("degrees");
  const lengthValues = document.getElementsByClassName("length");

  for (const [_, element] of Object.entries(degreeValues)) {
    element.innerText = toCelsius(element.innerText);
  }

  for (const [_, element] of Object.entries(lengthValues)) {
    element.innerText = toCentimeters(element.innerText);
    if (element.classList.contains("precip")) {
      element.innerText *= 10;
    }
  }
}

function convertToUS() {
  const degreeValues = document.getElementsByClassName("degrees");
  const lengthValues = document.getElementsByClassName("length");

  for (const [_, element] of Object.entries(degreeValues)) {
    element.innerText = toFahrenheit(element.innerText);
  }

  for (const [_, element] of Object.entries(lengthValues )) {
    if (element.classList.contains("precip")) {
      element.innerText /= 10;
    }
    element.innerText = toInches(element.innerText);
  }
}

async function weatharia() {
  const location = document.getElementById("location");
  document.getElementById("q").addEventListener("click", async () => { 
    const weatherData =  await getWeatherData(location.value);
    const weatherDataWeek = await weatherData.days.slice(0, 7);
    const cleanWeatherData = processWeatherData(weatherDataWeek);
    createRows(cleanWeatherData);
   });
  document.getElementById("scale").addEventListener("click", (e) => {
    if (document.querySelector("tbody").children.length == 0) {
      return;
    }
    if (e.currentTarget.innerText == "Metric") {
      convertToMetric();
      e.currentTarget.innerText = "US";
    }
    else if (e.currentTarget.innerText == "US") {
      convertToUS();
      e.currentTarget.innerText = "Metric";
    }
  });
  document.getElementById("view-all").addEventListener("click", viewAll);
  document.getElementById("view-default").addEventListener("click", viewDefault);
}

weatharia();