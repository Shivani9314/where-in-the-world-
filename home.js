async function restCountriesData() {
  const loader = document.getElementById("loader");
  try {
    // Show the loader
    loader.style.display = "block";

    let countries = await fetch("https://restcountries.com/v3.1/all", {
      method: "GET",
    }).then((response) => response.json());

    // Hide the loader
    loader.style.display = "none";

    return countries;
  } catch (error) {
    // Hide the loader in case of an error
    loader.style.display = "none";
    alert(`Failed to fetch data: ${error.message}`);
  }
}

function render(countries) {
  try {
    let countryContainer = document.querySelector(".card-container > .content-container");

    countryContainer.innerHTML = "";
    countries.forEach((country) => {
      let countryDiv = document.createElement("div");
      countryDiv.classList.add("card");

      countryDiv.addEventListener("click", () => {
        window.location.href = `country.html?country=${country.cca3}`;
      });

      let img = document.createElement("img");
      img.setAttribute("src", country.flags.png);
      img.setAttribute("alt", country.flags.alt);

      let countryName = document.createElement("h3");
      countryName.innerText = country.name.common;

      let population = document.createElement("p");
      let populationLabel = document.createElement("span");
      populationLabel.innerText = "Population: ";
      let populationNumber = document.createElement("span");
      populationNumber.innerText = country.population.toLocaleString("en-us");

      population.appendChild(populationLabel);
      population.appendChild(populationNumber);

      let region = document.createElement("p");
      let regionLabel = document.createElement("span");
      regionLabel.innerText = "Region: ";
      let regionName = document.createElement("span");
      regionName.innerText = country.region;

      region.appendChild(regionLabel);
      region.appendChild(regionName);

      let capital = document.createElement("p");
      let capitalLabel = document.createElement("span");
      capitalLabel.innerText = "Capital: ";
      let capitalName = document.createElement("span");
      capitalName.innerText = country.capital ? country.capital[0] : "N/A";

      capital.appendChild(capitalLabel);
      capital.appendChild(capitalName);

      countryDiv.appendChild(img);
      countryDiv.appendChild(countryName);
      countryDiv.appendChild(population);
      countryDiv.appendChild(region);
      countryDiv.appendChild(capital);

      countryContainer.appendChild(countryDiv);
    });
  } catch (error) {
    alert(`Failed to render countries: ${error.message}`);
  }
}

function handleTheme() {
  try {
    const preferredTheme = sessionStorage.getItem("theme");

    if (preferredTheme === "dark") {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    let themeToggle = document.getElementById("toggle-theme");
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");

      const isDarkMode = document.body.classList.contains("dark-mode");
      sessionStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  } catch (error) {
    alert(`Failed to handle theme: ${error.message}`);
  }
}

function populateDropdown(countries) {
  try {
    let dropdown = document.querySelector("#filter");

    let regions = countries.reduce((acc, country) => {
      if (country.region && !acc.includes(country.region)) {
        acc.push(country.region);
      }
      return acc;
    }, []);

    regions.forEach((region) => {
      let option = document.createElement("option");
      option.setAttribute("value", region);
      option.innerText = region;

      dropdown.appendChild(option);
    });
  } catch (error) {
    alert(`Failed to populate dropdown: ${error.message}`);
  }
}

function searchCountry(countries, value) {
  try {
    let region = document.querySelector("#filter").value;
    let filteredData = countries
      .filter((country) => {
        if (region === "") {
          return true;
        } else {
          return country.region === region;
        }
      })
      .filter((country) => {
        return country.name.common.toLowerCase().includes(value.toLowerCase());
      });
    render(filteredData);
  } catch (error) {
    alert(`Failed to search countries: ${error.message}`);
  }
}

function filteredCountries(countries, region) {
  try {
    let filteredData;

    if (region === "") {
      filteredData = countries;
    } else {
      filteredData = countries.filter((country) => country.region === region);
    }

    render(filteredData);
  } catch (error) {
    alert(`Failed to filter countries: ${error.message}`);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    let countries = await restCountriesData();
    render(countries);
    populateDropdown(countries);

    const searchInput = document.querySelector(".search-container input");
    searchInput.addEventListener("input", () => {
      searchCountry(countries, searchInput.value);
    });

    const filterDropDown = document.querySelector("#filter");
    filterDropDown.addEventListener("change", () => {
      filteredCountries(countries, filterDropDown.value);
    });

    handleTheme();
  } catch (error) {
    alert(`Failed to initialize: ${error.message}`);
  }
});
