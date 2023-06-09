export const regionsByCountry = {
    india: [
        "Andhra Pradesh",
        "Karnataka",
        "Tamil Nadu",
        "Madhya Pradesh",
        "West Bengal",
        "Uttar Pradesh",
        "Placebo",
    ],
    brazil: ["Ceara", "Piaui", "Acre", "Pernambuco", "Minas Gerais", "Placebo"],
    russia: [
        "Samara region",
        "Sverdlovsk region",
        "Pskov region",
        "Kaluga region",
        "Astrakhan region",
        "Tula region",
        "Placebo",
    ],
};

export function updateRegionNamesOnPage(country, regionsByCountry) {
    const stateHeadings = document.querySelectorAll(".region-title");

    stateHeadings.forEach((heading, i) => {
        const region = regionsByCountry[country][i];
        heading.href = `/research_viz_sc/${country}/${region.toLowerCase().replace(" ", "_")}`;
    });
}

export function updateRegions(country, regionsByCountry) {
    const regionsNav = document.getElementById("regions-nav");
    regionsNav.innerHTML = "";

    if (country !== "/") {
        const regions = regionsByCountry[country];
        for (let region of regions) {
            const regionLink = document.createElement("a");
            regionLink.href = `/${country}/${region.toLowerCase().replace(" ", "_")}`;
            regionLink.onclick = route;
            regionLink.textContent = region;
            regionsNav.appendChild(regionLink);
        }
    }
}
