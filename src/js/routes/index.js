"use strict";
class IndexRoute {
    async index(req, res) {
        let pageSettings = {
            layout: "landingPage"
        };
        res.render("index/landingPageBodyContent", pageSettings);
    }
    async dashboard(req, res) {
        res.render("index/index");
    }
    async autores(req, res) {
        res.render("index/authors");
    }
}
module.exports = IndexRoute;
//# sourceMappingURL=index.js.map