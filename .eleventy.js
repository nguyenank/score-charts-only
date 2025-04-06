import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import pluginRss from "@11ty/eleventy-plugin-rss";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginIcons from "eleventy-plugin-icons";

import { strToSlug, getTags, getAllTags } from "./config/filters.js";

import  allGames from "./src/_data/allGames.json" with { type: "json" };

const imageConfig = {
    extensions: "html",
    formats: ["webp"],
    widths: [600, 900],
    defaultAttributes: {
        loading: "lazy",
        decoding: "async",
        sizes: "100vw"
    }
};

export default function (eleventyConfig) {
    /*================================*/
    /*   plugins and configurations   */
    /*================================*/
    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(eleventyImageTransformPlugin, imageConfig);

    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: false,
        excerpt_separator: "<!-- excerpt -->",
        excerpt_alias: "excerpt"
    });

    eleventyConfig.addPlugin(pluginIcons, {
        sources: [{ name: "custom", path: "./src/assets/icons" }]
    });

    /*===================================================*/
    /* files that need to be copied to the build folder  */
    /*===================================================*/
    eleventyConfig.addPassthroughCopy("./src/assets/icons");
    eleventyConfig.addPassthroughCopy("./src/assets/sprite.svg");

    /*=================*/
    /*     Layouts     */
    /*=================*/
    eleventyConfig.addLayoutAlias("page", "layouts/page");
    eleventyConfig.addLayoutAlias("article", "layouts/article");
    eleventyConfig.addLayoutAlias("game", "layouts/game");

    /*=================*/
    /*   Collections   */
    /*=================*/
    for (const tag of getAllTags(allGames)) {
        eleventyConfig.addCollection(tag, function (collectionsApi) {
            return collectionsApi.getFilteredByTag("game").filter(
                function (item) {
                    if (!item.data.gameObj) {
                        return false;
                    }
                    return getTags(item.data.gameObj).includes(tag);
                }
            );
        });
    }

    /*=================*/
    /*     Filters     */
    /*=================*/
    eleventyConfig.addFilter("strToSlug", strToSlug);
    eleventyConfig.addFilter("getTags", getTags);
    eleventyConfig.addFilter("getAllTags", getAllTags);

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        markdownTemplateEngine: "njk"
    };
}
