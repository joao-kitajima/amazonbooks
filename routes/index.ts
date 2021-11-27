import amazonbooks = require("teem");
import { db } from '../amazonbooks';

class IndexRoute {
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		let pageSettings = {
			layout: "landingPage"
		};
		
		res.render("index/index", pageSettings);
	}
	
	public async dashboard(req: amazonbooks.Request, res: amazonbooks.Response) {
		let catList = []; 

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
					res.render("index/dashboard", {catList: catList, db: db});
				})	
			}
			catch (error) { throw error; }
		  })();

		
	}

	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		let autList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						autList.push(a)
					})
					res.render("index/authors", {autList: autList});
				})	
			}
			catch (error) { throw error; }
		  })();

	}

	public async livros(req: amazonbooks.Request, res: amazonbooks.Response){
		let livList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						livList.push(a)
					})
					res.render("index/books", {livList: livList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}

	public async autoajuda(req: amazonbooks.Request, res: amazonbooks.Response){
		let ajuList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						ajuList.push(a)
					})
					res.render("index/selfHelp", {ajuList: ajuList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}

	public async ficcao(req: amazonbooks.Request, res: amazonbooks.Response){
		let ficList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						ficList.push(a)
					})
					res.render("index/fiction", {ficList: ficList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}

	public async politica(req: amazonbooks.Request, res: amazonbooks.Response){
		let polList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						polList.push(a)
					})
					res.render("index/politics", {polList: polList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}

	public async academicos(req: amazonbooks.Request, res: amazonbooks.Response){
		let acaList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						acaList.push(a)
					})
					res.render("index/academics", {acaList: acaList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}

	public async editoras(req: amazonbooks.Request, res: amazonbooks.Response){
		let pubList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all(`
				  SELECT proName, proPrice, proPublisher, c.catName 
					FROM Product p 
					INNER JOIN Category c 
					INNER JOIN Product_Category pc 
					WHERE proPublisher = "Todolivro" and p.proCode = pc.proCode and c.catCode = pc.catCode ;`, 
				  async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						pubList.push(a)
					})
					res.render("index/publishers", {pubList: pubList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}
}

export = IndexRoute;
