"use strict";
class IndexRoute {
    async index(req, res) {
        res.render("index/index");
    }
    async teste(req, res) {
        res.send("Eu sou um texto...");
    }
}
module.exports = IndexRoute;
//# sourceMappingURL=index.js.map