import amazonbooks = require("teem");

class IndexRoute {
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/index");
	}

	public async teste(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/teste");
	}
}

export = IndexRoute;
