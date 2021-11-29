import amazonbooks = require("teem");
import { db } from '../amazonbooks';
import Category from '../models/Category';
import Author from '../models/Author';
import Product from '../models/Product';

class IndexRoute {
	/* PÁGINA INICIAL */
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		let pageSettings = {
			layout: "landingPage"
		};
		
		res.render("index/index", pageSettings);
	}


	/* DIAGNÓSTICO */
	public async diagnostico(req: amazonbooks.Request, res: amazonbooks.Response) {
		let total_records = {};
		let total_authors = {};
		let total_books = {};


		await db.all(
			'SELECT COUNT(proCode) FROM Product;',
			async(err, rows) => {
				if(err) {
					throw err;
				}

				await rows.forEach(
					(record_line) => {
						total_records = record_line;
					}
				)

				// res.render('index/report',  { total_records: JSON.stringify(total_records) });
			}
		);


		await db.all(
			'SELECT COUNT(DISTINCT proName) FROM Product;',
			async(err, rows) => {
				if(err) {
					throw err;
				}

				await rows.forEach(
					(books_line) => {
						total_books = books_line;
					}
				)

				// res.render('index/report', { total_books: JSON.stringify(total_books) });
			}
		);


		await db.all(
			'SELECT COUNT(autCode) FROM Author;',
			async(err, rows) => {
				if(err) {
					throw err;
				}

				await rows.forEach(
					(author_line) => {
						total_authors = author_line;
					}
				)

				res.render(
					'index/report',
					{
						total_records: JSON.stringify(total_records),
						total_books: JSON.stringify(total_books),
						total_authors: JSON.stringify(total_authors)
					}
				);
			}
		);
	}


	/* VISÃO GERAL */
	public async visao_geral(req: amazonbooks.Request, res: amazonbooks.Response){
		let seriesRevPag = [], seriesStrPag = [], seriesPriPag = [], seriesTyp = []
		let catRevPag = {}, catStrPag = {}, catPriPag = {}, catTyp = { data: []}
		let categorias = {}
		let categoriesTyp = []

		await db.all(`SELECT a.proReview, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) =>{
			if(err){
				throw err;
			}
			await rows.forEach((r)=>{
				var c = catRevPag[r.catName]

				if(!c){
					c = {
						name: r.catName,
						data: []
					}
					catRevPag[r.catName] = c;
					seriesRevPag.push(c);
				}

				c.data.push([r.proReview, r.proPages]);
			})
			
		})	

		await db.all(`SELECT a.proStar, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proStar != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) =>{
			if(err){
				throw err;
			}
			await rows.forEach((r)=>{
				var sp = catStrPag[r.catName]

				if(!sp){
					sp = {
						name: r.catName,
						data: []
					}
					catStrPag[r.catName] = sp;
					seriesStrPag.push(sp);
				}

				sp.data.push([r.proStar, r.proPages]);
			})
		})

		await db.all(`SELECT a.proPrice, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) =>{
			if(err){
				throw err;
			}
			await rows.forEach((r)=>{
				var pp = catPriPag[r.catName]

				if(!pp){
					pp = {
						name: r.catName,
						data: []
					}
					catPriPag[r.catName] = pp;
					seriesPriPag.push(pp);
				}

				pp.data.push([r.proPrice, r.proPages]);
			})
			
		})

		await db.all(`SELECT proType, count(proType) as freq
		FROM Product
		WHERE proType != "Not Exists" and proType != "Not exists"
		GROUP BY proType
		ORDER BY freq DESC`, async (err, rows) =>{
			if(err){
				throw err;
			}
			await rows.forEach((r)=>{
				catTyp.data.push(r.freq);
				categoriesTyp.push(r.proType);
			})
			seriesTyp.push(catTyp);
			res.render("index/general", {seriesRevPag: JSON.stringify(seriesRevPag), seriesStrPag: JSON.stringify(seriesStrPag), seriesPriPag: JSON.stringify(seriesPriPag), seriesTyp: JSON.stringify(seriesTyp), categoriesTyp: JSON.stringify(categoriesTyp)});
		})
	}


	/* AUTOAJUDA */
	public async autoajuda(req: amazonbooks.Request, res: amazonbooks.Response){
		let ajuList = [];

		res.render("index/selfHelp")
	}


	/* INFANTIL */
	public async infantil(req: amazonbooks.Request, res: amazonbooks.Response){
		let kidList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						kidList.push(a)
					})
					res.render("index/kids", {kidList: kidList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* DIREITO */
	public async direito(req: amazonbooks.Request, res: amazonbooks.Response){
		let dirList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						dirList.push(a)
					})
					res.render("index/laws", {dirList: dirList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* HQs e MANGÁS */
	public async hqs_mangas(req: amazonbooks.Request, res: amazonbooks.Response){
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
					res.render("index/hqs_mangas", {acaList: acaList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* AUTORES */
	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		let autList = [];

		(async () => {
			try {
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


	/* EDITORAS */
	public async editoras(req: amazonbooks.Request, res: amazonbooks.Response){
		let pubList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	// await db.all(`
				//   SELECT proName, proPrice, proPublisher, c.catName 
				// 	FROM Product p 
				// 	INNER JOIN Category c 
				// 	INNER JOIN Product_Category pc 
				// 	WHERE proPublisher = "Todolivro" and p.proCode = pc.proCode and c.catCode = pc.catCode ;`, 
				//   async (err, rows) =>{
				// 	if(err){
				// 		throw err;
				// 	}
				// 	await rows.forEach((a)=>{
				// 		pubList.push(a)
				// 	})
				// 	res.render("index/publishers", {pubList: pubList});
				// })

				await db.all(`
				  SELECT * from Category;`, 
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
