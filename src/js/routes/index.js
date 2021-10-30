"use strict";
class IndexRoute {
    async index(req, res) {
        res.render("index/index");
    }
    async autores(req, res) {
        res.render("index/authors");
    }
}
module.exports = IndexRoute;
//# sourceMappingURL=index.js.map