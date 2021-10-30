import amazonbooks = require("teem");

class IndexRoute {
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/index");
	}

	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/authors");
	}
}

export = IndexRoute;
