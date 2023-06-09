import { main } from "./main";
import {
    regionsByCountry,
    updateRegionNamesOnPage,
    updateRegions,
} from "/js/contentUtils";

function getFullPath(relativePath) {
    const basePath = "/research_sc_viz/"
    if (!relativePath.startsWith(basePath)) {
        return (basePath + relativePath).replace("//", "/")
    }
    return relativePath
}


function route(event) {
    event = event || window.event;
    event.preventDefault();

    const relativePath = event.target.getAttribute("href");
    window.history.pushState({}, "", getFullPath(relativePath));
    handleLocation();
}

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/india": "/pages/india.html",
    "/india/andhra_pradesh": "/pages/graphs.html",
    "/india/karnataka": "/pages/graphs.html",
    "/india/tamil_nadu": "/pages/graphs.html",
    "/india/madhya_pradesh": "/pages/graphs.html",
    "/india/west_bengal": "/pages/graphs.html",
    "/india/uttar_pradesh": "/pages/graphs.html",
    "/india/placebo": "/pages/graphs.html",

    "/russia": "/pages/russia.html",
    "/russia/samara_region": "/pages/graphs.html",
    "/russia/sverdlovsk_region": "/pages/graphs.html",
    "/russia/pskov_region": "/pages/graphs.html",
    "/russia/kaluga_region": "/pages/graphs.html",
    "/russia/astrakhan_region": "/pages/graphs.html",
    "/russia/tula_region": "/pages/graphs.html",
    "/russia/placebo": "/pages/graphs.html",

    "/brazil": "/pages/brazil.html",
    "/brazil/ceara": "/pages/graphs.html",
    "/brazil/piaui": "/pages/graphs.html",
    "/brazil/acre": "/pages/graphs.html",
    "/brazil/pernambuco": "/pages/graphs.html",
    "/brazil/minas_gerais": "/pages/graphs.html",
    "/brazil/placebo": "/pages/graphs.html",
};

const pagesWithThreeGraphs = [
    "/india/placebo",
    "/russia/placebo",
    "/brazil/ceara",
    "/brazil/piaui",
    "/brazil/acre",
    "/brazil/pernambuco",
    "/brazil/minas_gerais",
    "/brazil/placebo",
];

function initializePage(route) {
    const path = window.location.pathname;
    const countryPages = [
        "/pages/india.html",
        "/pages/russia.html",
        "/pages/brazil.html",
    ];
    if (route === "/pages/graphs.html") {
        main(path);
    } else if (countryPages.includes(route)) {
        const countryName = route.slice(7, -5);
        updateRegionNamesOnPage(countryName, regionsByCountry);
    } else if (route == "/pages/home.html") {
        document.getElementById("regions-nav").innerHTML = "";
    }
}

async function handleLocation() {
    const url = new URL(window.location.href);
    const base = '/research_sc_viz';
    const path = url.pathname.replace(base, '') + url.search;
    const route = routes[path] || routes[404];
    const newRoute = base + route;

    const html = await fetch(newRoute).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;
    if (pagesWithThreeGraphs.includes(path)) {
        const containter = document.querySelector(".grid-container");
        containter.lastElementChild.remove();
        const lastChild = containter.lastElementChild;
        lastChild.classList.add("brazil-style");
    }
    initializePage(route);
}

window.onpopstate = handleLocation;
window.route = route;

handleLocation();

window.addEventListener("DOMContentLoaded", (event) => {
    const url = new URL(window.location.href);
    const base = '/research_sc_viz';
    const path = url.pathname.replace(base, '') + url.search;
    // by this i want to ensure that second part of menu
    // with regions will be wisible not only on click,
        // but on page reload as well
    const parts = path.split("/");
    for (let countryName of Object.keys(regionsByCountry)) {
        if (parts.includes(countryName)) {
            updateRegions(countryName, regionsByCountry);
        }
    }
    // this part adds navigation
    const topMenuElements = document.querySelector("#main-nav").childNodes;
    for (let i = 0; i < topMenuElements.length; i++) {
        if (topMenuElements[i].nodeName === "A") {
            topMenuElements[i].addEventListener("click", (event) => {
                event.preventDefault();
                route();
                const path = window.location.pathname+window.location.search;
                const parts = path.split("/");
                for (let countryName of Object.keys(regionsByCountry)) {
                    if (parts.includes(countryName)) {
                        updateRegions(countryName, regionsByCountry);
                    }
                }
            });
        }
    }
});
