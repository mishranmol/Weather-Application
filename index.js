// first we will fetch the tabs

const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const user_container = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessbutton = document.querySelector("[data-grantAccess]");

//intial need of the variables

let currentTab = usertab; //we need current tab because to know which tab onto we have to switch mtlb agr 1st pr khade hai toh 2nd pr jaana and vice-versa and by default out tab should be open on the usertab  
const API_KEY = "b941ccd0aef60bb58859f7a556f888a1";
currentTab.classList.add("current-tab");
getCoordinates();


// one thing is pending ??


function switchtab(clickedtab) {

    if (clickedtab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedtab;
        currentTab.classList.add("current-tab");

        //we are checking that whether the searchform tab is visible or not 
        if (!searchForm.classList.contains("active")) {

            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }

        else {
            //main phele search weather wale tab pr tha aur ab your/user weather wala tab pr switch krna hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // when we are switching then we are getting the weather of our location automatically it means it is getting the cordinates 
            getCoordinates();
        }
    }
}

// switching of tabs
usertab.addEventListener("click", () => {
    // pass on the clicked tab as the input paramter 
    switchtab(usertab);
});

searchtab.addEventListener("click", () => {
    // pass on the clicked tab as the input paramter 
    switchtab(searchtab);
});

//check if coordinates are present or not 
function getCoordinates() {
    // we are writng the user-coordinate in bracket cause by this name only we have saved the values in sessionStorage
    const coordinates = sessionStorage.getItem("user-coordinate");
    // if the coordinates is not with us then we have to show the grantAcess window 
    if (!coordinates) {
        grantAccessContainer.classList.add("active");

        // so now we have two step process
        // 1-> when we will click on the grantAcess button then find the location of the user using Geolocation Api and 2-> when we get the latitude and longitude of the user then save that data onto the sessionStorage



    }

    // but if the coordinates are with us 
    else {
        const ele = JSON.parse(coordinates);
        fetchUserWeatherInfo(ele);
    }
}

// why async ?
async function fetchUserWeatherInfo(a) {

    const { lat, lon } = a;
    // make grant location invisible
    grantAccessContainer.classList.remove("active");
    //now make the loader visible
    loadingScreen.classList.add("active");

    // now API call
    try {

        const k = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data = await k.json();

        // now since our data has came so remove the loader
        loadingScreen.classList.remove("active");

        // now make visible the userweather
        userInfoContainer.classList.add("active");
        // now make the data render on screen which we have fetched
        renderWeatherInfo(data);

    }
    catch (e) {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(info) {
    // now yha se hum log vo values nikalenge jo hum userweather mtlb User ki UI pr show krni hai 
    //firstly we have to fetch the elements

    // since we are adding the values dynamically so we need the elements 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");


    // fetch values from weatherinfo object and put into userweather UI
    // we have used optional chainging
    cityName.innerText = info?.name;
    // countryIcon.src= `https://flagcdn.com/144108`
    desc.innerText = info?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${info?.weather?.[0].icon}.png`;
    temp.innerText = `${info?.main?.temp} °F`;
    windspeed.innerText = `${info?.wind?.speed} m/s`;
    humidity.innerText = `${info?.main?.humidity} %`;
    cloud.innerText = `${info?.clouds?.all} %`;

}

function getlocation() {

    // if support is available of geolocation api
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showposition);
    }

    else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showposition(position) {

    const usercoordinate = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinate", JSON.stringify(usercoordinate));
    fetchUserWeatherInfo(usercoordinate);

}

grantAccessbutton.addEventListener("click", getlocation);

// used to take the input from the user when they will search for another city weather 
const searchcity = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchcity.value;

    if (city === "") return;

    else {
        fetchSearchWeatherInfo(city);
    }
});

// since we are making the API call so make it async
async function fetchSearchWeatherInfo(city) {

    // since we are making the call for another city
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {

        const k = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);

        const data = await k.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("Active");
        renderWeatherInfo(data);
    }

    catch (e) {

    }
}
