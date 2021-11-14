import amazonbooks = require("teem");
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../../ESPM/4oSemestre/Python/code/Inter/projeto/conexao.db', sqlite3.OPEN_READONLY, (err) =>{
    if (err){
        return console.log(err.message);
    } else {
        console.log("Conectado ao DB com sucesso!");
    }
});

class IndexRoute {
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		let pageSettings = {
			layout: "landingPage"
		};
		
		res.render("index/index", pageSettings);
	}
	
	public async dashboard(req: amazonbooks.Request, res: amazonbooks.Response) {
		
		var catList = []; 

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT * from Category', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((c)=>{
						catList.push(c)
					})
					res.render("index/dashboard", {cat: catList});
				})	
			}
			catch (error) { throw error; }
		  })();

		
	}

	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		res.render("index/authors");
	}
}

export = IndexRoute;
