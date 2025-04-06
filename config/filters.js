import slugify from "slugify";

export function strToSlug(str) {
    const options = {
        replacement: "-",
        remove: /[&,+()$~%.'":*?<>{}]/g,
        lower: true
    };
    return slugify(str, options);
}

export function getTags(gameObj) {
    return [
        gameObj.season,
        gameObj.homeTeam,
        gameObj.awayTeam,
        gameObj.isRegularSeason ? "Regular Season" : "Playoffs"
    ];
}

export function getAllTags(allGames) {
    var tags = new Set();
    allGames.forEach((game) => {
        for (const tag of getTags(game)) {
            tags.add(tag);
        }
    });
    return Array.from(tags);
}
