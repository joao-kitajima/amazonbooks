import amazonbooks = require("teem");

class IndexRoute {
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		let pageSettings = {
			layout: "landingPage"
		};
		
		res.render("index/index", pageSettings);
	}
	
	public async dashboard(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/dashboard");
	}

	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/authors");
	}
}

export = IndexRoute;
