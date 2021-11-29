import amazonbooks = require("teem");
import { db, executar, scalar } from '../amazonbooks';


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
		res.render(
			'index/report',
			{
				earliest_date: await scalar('SELECT MIN(proScrapDate) FROM Product;'),
				latest_date: await scalar('SELECT MAX(proScrapDate) FROM Product;'),
				total_records: await scalar('SELECT COUNT(proCode) FROM Product;'),
				total_books: await scalar('SELECT COUNT(DISTINCT autCode) FROM Author;'),
				total_authors: await scalar('SELECT COUNT(DISTINCT proName) FROM Product;'),
				total_publishers: await scalar('SELECT COUNT(DISTINCT proPublisher) FROM Product;'),
				total_categories: await scalar('SELECT COUNT(DISTINCT catName) FROM Category;'),
				total_reviews: await scalar('SELECT SUM(proReview) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" GROUP BY proName);'),
				total_pages: await scalar('SELECT SUM(proPages) FROM (SELECT proName, proPages AS proPages FROM Product WHERE proPages IS NOT NULL AND proPages != "N/A" GROUP BY proName);'),
				avg_price: await scalar('SELECT ROUND(AVG(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName);'),
				max_price: await scalar('SELECT ROUND(MAX(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName);'),
				min_price: await scalar('SELECT ROUND(MIN(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName) WHERE proPrice  >= 0;'),
				avg_stars: await scalar('SELECT ROUND(AVG(proStar), 2) FROM (SELECT proName, proStar FROM Product WHERE proStar != "N/A" AND proStar IS NOT NULL GROUP BY proName);'),
				max_reviews_perbook: await scalar('SELECT MAX(proReview) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" AND proReview IS NOT NULL GROUP BY proName);'),
				avg_reviews_perbook: await scalar('SELECT CAST(ROUND(AVG(proReview)) AS INTEGER) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" AND proReview IS NOT NULL GROUP BY proName);'),
			}
		);
	}


	/* VISÃO GERAL */
	public async visao_geral(req: amazonbooks.Request, res: amazonbooks.Response){
		let rows: any[];
		// Cards
		let sumRevCat = {}, sumAutCat = [], avgPagCat = [], avgPriCat = [], dateCat = [],
		minMaxDate = {}, sumPriCat = [], freqProCat = []

		/// Graficos
		let seriesRevPag = [], seriesStrPag = [], seriesPriPag = [], seriesTyp = [], seriesPriStr = []
		let catRevPag = {}, catStrPag = {}, catPriPag = {}, catTyp = { data: []}, catPriStr = {}
		let categoriesTyp = []


		/* CARD */
		/* Categoria com maior e menur numero de reviews */
		rows = await executar(`SELECT sum(a.proReview) as somaReview, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A"
		GROUP BY a.catCode
		ORDER BY somaReview DESC;`);
		sumRevCat["max"] = {name: rows[0].catName, data: rows[0].somaReview};
		sumRevCat["min"] = {name: rows[rows.length - 1].catName, data: rows[rows.length - 1].somaReview};
		
		/* CARD */
		/* Categorias com maior e menor numero de autores registrados */
		rows = await executar(`SELECT count(DISTINCT autCode) as somaAutor, c.catName FROM Product p
		INNER JOIN Category c ON c.catCode = p.catCode
		GROUP BY p.catCode
		ORDER BY somaAutor DESC;`);
		sumAutCat["max"] = {name: rows[0].catName, data: rows[0].somaAutor};
		sumAutCat["min"] = {name: rows[rows.length - 1].catName, data: rows[rows.length - 1].somaAutor};

		/* CARD */
		/* Categorias com maior e menor numero de pag medias registrados */
		rows = await executar(`SELECT round(avg(a.proPages),0) as avgPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPages != "N/A"
		GROUP BY a.catCode
		ORDER BY avgPages DESC;`);
		avgPagCat["max"] = {name: rows[0].catName, data: rows[0].avgPages};
		avgPagCat["min"] = {name: rows[rows.length - 1].catName, data: rows[rows.length - 1].avgPages};

		/* CARD */
		/* Categorias com maior média de preço dos livros */
		rows = await executar(`SELECT round(avg(a.proPrice),2) as avgPrice, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != -1 and a.proPrice != "N/A"
		GROUP BY a.catCode
		ORDER BY avgPrice DESC;`);
		rows.forEach((r)=>{
			avgPriCat.push({name: r.catName , data: r.avgPrice })
		})
		avgPriCat["max"] = {name: rows[0].catName, data: rows[0].avgPrice};
		avgPriCat["min"] = {name: rows[rows.length - 1].catName, data: rows[rows.length - 1].avgPrice};

		/* CARD */
		/* Categoria livro mais novos e mais velhos registrados */
		rows = await executar(`SELECT max(a.proPublishedDate) as dataMax, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPublishedDate != "N/A"
		GROUP BY a.catCode
		ORDER BY dataMax DESC
		limit 1;`);
		minMaxDate["max"] = { name: rows[0].catName, data: rows[0].dataMax}
		rows = await executar(`SELECT min(a.proPublishedDate) as dataMin, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPublishedDate != "N/A"
		GROUP BY a.catCode
		ORDER BY dataMin 
		limit 1;`);
		minMaxDate["min"] = { name: rows[0].catName, data: rows[0].dataMin}

		/* TOP */
		/* Categoria preço soma de preços registrados */
		rows = await executar(`SELECT round(sum(a.proPrice), 2) as totalPrice, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1
		GROUP BY a.catCode
		ORDER BY totalPrice DESC;`);
		rows.forEach((r)=>{
			sumPriCat.push({name: r.catName, data: r.totalPrice }) 
		})

		/* TOP */
		rows = await executar(`SELECT count(DISTINCT proName) as freq, c.catName from Product p
		INNER JOIN Category c ON c.catCode = p.catCode
		GROUP BY p.catCode
		ORDER BY freq DESC;`);
		rows.forEach((r)=>{
			freqProCat.push({name: r.catName, data: r.freq})
		})

		/* TOP */
		/* type & Freq /categoria */
		rows = await executar(`SELECT proType, count(proType) as freq
		FROM Product
		WHERE proType != "Not Exists" and proType != "Not exists"
		GROUP BY proType
		ORDER BY freq DESC`);
		rows.forEach((r)=>{
			catTyp.data.push(r.freq);
			categoriesTyp.push(r.proType);
		});
		seriesTyp.push(catTyp);

		/* DSP */
		/* review x pages /categoria */
		rows = await executar(`SELECT a.proReview, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
		rows.forEach((r)=>{
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
		});

		/* DSP */
		/* star x pages /categoria */
		rows = await executar(`SELECT a.proStar, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proStar != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
		rows.forEach((r)=>{
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
		});

		/* DSP */
		/* price x pages /categoria */
		rows = await executar(`SELECT a.proPrice, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPages != "N/A"
		ORDER BY a.catCode`);
		rows.forEach((r)=>{
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
		});

		/* DSP */
		/* price x stars /categoria */
		rows = await executar(`SELECT a.proPrice, a.proStar, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proStar != "N/A"
		ORDER BY a.catCode`);
		rows.forEach((r)=>{
			var pp = catPriStr[r.catName]

			if(!pp){
				pp = {
					name: r.catName,
					data: []
				}
				catPriStr[r.catName] = pp;
				seriesPriStr.push(pp);
			}

			pp.data.push([r.proPrice, r.proStar]);
		});

		
		res.render("index/general", 
		{
			dateCat: dateCat,
			minMaxDate: minMaxDate,
		 	avgPagCat: avgPagCat, 
		 	avgPriCat: avgPriCat, 
			sumAutCat: sumAutCat,
			sumRevCat: sumRevCat,
			seriesPriStr: JSON.stringify(seriesPriStr),
			sumPriCat: JSON.stringify(sumPriCat),
			freqProCat: JSON.stringify(freqProCat),
			seriesRevPag: JSON.stringify(seriesRevPag),
			seriesStrPag: JSON.stringify(seriesStrPag),
			seriesPriPag: JSON.stringify(seriesPriPag),
			seriesTyp: JSON.stringify(seriesTyp),
			categoriesTyp: JSON.stringify(categoriesTyp)
		});
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
