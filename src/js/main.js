// DECLARE CONSTANTS
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

// Change state for content wrapper div
function hideContentWrapper() {
  contentWrapper.classList.add("hidden");
  contentWrapper.classList.remove("visible");
}

function showContentWrapper() {
  contentWrapper.classList.remove("hidden");
  contentWrapper.classList.add("visible");
}

// Render first 5 properties for different records and add dynamic images for all types
function renderData(data, type) {
  hideHomescreen();
  showContentWrapper();

  data.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    //check for matching title or name after converting to lowercase and replacing spaces with "_"
    const title = item.title || item.name;
    const imageName = title.toLowerCase().replace(/\s/g, "_");
    const img = document.createElement("img");
    img.src = `src/assets/pictures/${imageName}.jpeg`;
    img.alt = title;
    img.onerror = () => {
      img.onerror = null; // Prevent infinite loop
      img.src = "src/assets/pictures/generic.jpeg"; 
    };
    itemDiv.appendChild(img);

    const textDiv = document.createElement("div");

    //show only five first elements of record
    let propertyCount = 0;
    for (const [key, value] of Object.entries(item)) {
      if (propertyCount >= 5) break;

      const detail = document.createElement("p");
      detail.innerHTML = `<strong>${key.replace("_", " ").toUpperCase()}:</strong> ${value}`;
      textDiv.appendChild(detail);

      propertyCount++;
    }

    itemDiv.appendChild(textDiv);
    contentWrapper.appendChild(itemDiv);
  });
}

// Fetch all data across multiple pages
function fetchAllData(url, renderFunction, type) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderFunction(data.results, type);
      if (data.next) {
        fetchAllData(data.next, renderFunction, type);
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
      fetchAllData("https://swapi.dev/api/films/", renderData, "films");
      break;
    case "character-button":
      fetchAllData("https://swapi.dev/api/people/", renderData, "characters");
      break;
    case "planet-button":
      fetchAllData("https://swapi.dev/api/planets/", renderData, "planets");
      break;
    case "vehicle-button":
      fetchAllData("https://swapi.dev/api/vehicles/", renderData, "vehicles");
      break;
    case "home-button":
      showHomeScreen();
      hideContentWrapper();
      break;
  }
}

// Loop through buttons and add event listeners
filterButtons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});
