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

function renderBorder(borderCountries) {
  try {
    if (borderCountries.length != 0) {
      let borderCountryContainer = document.querySelector(".border-countries");
      // console.log(borderCountries);

      borderCountries.forEach((country) => {
        let button = document.createElement("button");
        button.innerText = country.name.common;
        button.classList.toggle("border-button");
        button.addEventListener("click", () => {
          window.location.href = `country.html?country=${country.cca3}`;
        });
        borderCountryContainer.appendChild(button);
      });
      
    }
    else{
       let borderCountryHeading = document.querySelector('.border-countries > h4');
       borderCountryHeading.innerText = "";
    }
  } catch (error) {
    alert(`Failed to render border countries: ${error.message}`);
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
    alert(error.message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get("country");
    let countries = await restCountriesData();
    let flagImg = document.getElementById("flag");
    let countryName = document.getElementById("country-name");
    let nativeName = document.getElementById("native-name");
    let population = document.getElementById("population");
    let region = document.getElementById("region");
    let subRegion = document.getElementById("sub-region");
    let capital = document.getElementById("capital");
    let domain = document.getElementById("domain");
    let currency = document.getElementById("currency");
    let language = document.getElementById("language");
    let country = countries.filter((country) => country.cca3 == countryCode)[0];
    let nativeNames = Object.values(country.name.nativeName).reduce(
      (accumalator, names) => {
        if (!accumalator.includes(names.common)) {
          accumalator.push(names.common);
        }
        return accumalator;
      },
      []
    );
    let currencies = Object.values(country.currencies).reduce(
      (accumalator, currency) => {
        if (!accumalator.includes(currency.name)) {
          accumalator.push(currency.name);
        }
        return accumalator;
      },
      []
    );
    let countryLanguage = Object.values(
      country.languages ? country.languages : {}
    );
    let borderCountries = countries.filter((index) => {
      let countryBorder = country.borders ? country.borders : [];
      return countryBorder.includes(index.cca3);
    });
    flagImg.setAttribute("src", country.flags ? country.flags.png : " ");
    flagImg.setAttribute("alt", country.flags.alt ? country.flags.alt : "");
    countryName.innerText = country.name.common;
    nativeName.innerText =
      nativeNames.length != 0 ? nativeNames.join(",") : "N/A";
    population.innerText = country.population;
    region.innerText = country.region;
    subRegion = country.subregion;
    capital.innerText = country.capital;
    domain.innerText = country.tld.length != 0 ? country.tld.join(",") : "N/A";
    currency.innerText = currencies.length != 0 ? currencies.join(",") : "N/A";
    language.innerText =
      countryLanguage.length != 0 ? countryLanguage.join(",") : "N/A";
    renderBorder(borderCountries);
    handleTheme();
  } catch (error) {
    alert(`Failed to load country details: ${error.message}`);
  }
});
