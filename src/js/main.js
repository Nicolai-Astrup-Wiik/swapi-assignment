//DECLARE CONSTANTS
const contentWrapper = document.querySelector(".content-wrapper");
const homeScreen = document.querySelector(".home-screen");
const filterButtons = document.querySelectorAll(".filter-button");

// CLEAR PREVIOUS DATA
function clearData() {
  contentWrapper.innerHTML = "";
}

// CHANGE STATE FOR HOME SCREEN
function showHomeScreen() {
  homeScreen.classList.remove("hidden");
  homeScreen.classList.add("visible");
}

function hideHomescreen() {
  homeScreen.classList.add("hidden");
  homeScreen.classList.remove("visible");
}
//change state for content wrapper div
function hideContentWrapper() {
  contentWrapper.classList.add("hidden");
  contentWrapper.classList.add("hidden");
}
function showContentWrapper() {
  contentWrapper.classList.remove("hidden");
  contentWrapper.classList.add("visible");
}

// Render first 5 properties for different records
function renderData(data) {
  hideHomescreen();
  showContentWrapper();
  data.forEach((item) => {
    const itemDiv = document.createElement("div");

    let propertyCount = 0;
    for (const [key, value] of Object.entries(item)) {
      if (propertyCount >= 5) break;

      const detail = document.createElement("p");
      detail.innerHTML = `<strong>${key
        //remove the underscores and capitalize keys
        .replace("_", " ")
        .toUpperCase()}:</strong> ${value}`;
      itemDiv.appendChild(detail);

      propertyCount++;
    }

    contentWrapper.appendChild(itemDiv);
  });
}

// Fetch all data across multiple pages
function fetchAllData(url, renderFunction) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderFunction(data.results);
      if (data.next) {
        fetchAllData(data.next, renderFunction);
      }
    })
    .catch((error) => console.log("Error fetching data:", error));
}

// Handle button clicks
function handleButtonClick(event) {
  event.preventDefault();
  const buttonId = event.target.id;
  clearData();

  switch (buttonId) {
    case "film-button":
      fetchAllData("https://swapi.dev/api/films/", renderData);
      break;
    case "character-button":
      fetchAllData("https://swapi.dev/api/people/", renderData);
      break;
    case "planet-button":
      fetchAllData("https://swapi.dev/api/planets/", renderData);
      break;
    case "vehicle-button":
      fetchAllData("https://swapi.dev/api/vehicles/", renderData);
      break;
    case "home-button":
      showHomeScreen();
      hideContentWrapper();
      break;
  }
}

// Loop through buttons and add eventlisteners
filterButtons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});
