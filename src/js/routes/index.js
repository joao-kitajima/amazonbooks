"use strict";
const amazonbooks_1 = require("../amazonbooks");
class IndexRoute {
    /* PÁGINA INICIAL */
    async index(req, res) {
        let pageSettings = {
            layout: "landingPage"
        };
        res.render("index/index", pageSettings);
    }
    /* DIAGNÓSTICO */
    async diagnostico(req, res) {
        res.render('index/report', {
            earliest_date: await (0, amazonbooks_1.scalar)('SELECT MIN(proScrapDate) FROM Product;'),
            latest_date: await (0, amazonbooks_1.scalar)('SELECT MAX(proScrapDate) FROM Product;'),
            total_records: await (0, amazonbooks_1.scalar)('SELECT COUNT(proCode) FROM Product;'),
            total_books: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT autCode) FROM Author;'),
            total_authors: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proName) FROM Product;'),
            total_publishers: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proPublisher) FROM Product;'),
            total_categories: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT catName) FROM Category;'),
            total_reviews: await (0, amazonbooks_1.scalar)('SELECT SUM(proReview) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" GROUP BY proName);'),
            total_pages: await (0, amazonbooks_1.scalar)('SELECT SUM(proPages) FROM (SELECT proName, proPages AS proPages FROM Product WHERE proPages IS NOT NULL AND proPages != "N/A" GROUP BY proName);'),
            avg_price: await (0, amazonbooks_1.scalar)('SELECT ROUND(AVG(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName);'),
            max_price: await (0, amazonbooks_1.scalar)('SELECT ROUND(MAX(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName);'),
            min_price: await (0, amazonbooks_1.scalar)('SELECT ROUND(MIN(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName) WHERE proPrice  >= 0;'),
            avg_stars: await (0, amazonbooks_1.scalar)('SELECT ROUND(AVG(proStar), 2) FROM (SELECT proName, proStar FROM Product WHERE proStar != "N/A" AND proStar IS NOT NULL GROUP BY proName);'),
            max_reviews_perbook: await (0, amazonbooks_1.scalar)('SELECT MAX(proReview) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" AND proReview IS NOT NULL GROUP BY proName);'),
            avg_reviews_perbook: await (0, amazonbooks_1.scalar)('SELECT CAST(ROUND(AVG(proReview)) AS INTEGER) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" AND proReview IS NOT NULL GROUP BY proName);'),
        });
    }
    /* VISÃO GERAL */
    async visao_geral(req, res) {
        let rows;
        // Cards
        let sumRevCat = {}, sumAutCatMax = {}, sumAutCatMin = {}, avgPagCat = {};
        /// Graficos
        let seriesRevPag = [], seriesStrPag = [], seriesPriPag = [], seriesTyp = [];
        let catRevPag = {}, catStrPag = {}, catPriPag = {}, catTyp = { data: [] };
        let categoriesTyp = [];
        await amazonbooks_1.db.get(`SELECT sum(a.proReview) as somaReview, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A"
		GROUP BY a.catCode
		ORDER BY somaReview DESC;`, async (err, row) => {
            sumRevCat["data"] = row.somaReview;
            sumRevCat["name"] = row.catName;
        });
        rows = await (0, amazonbooks_1.executar)(`SELECT count(DISTINCT autCode) as somaAutor, c.catName FROM Product p
		INNER JOIN Category c ON c.catCode = p.catCode
		GROUP BY p.catCode
		ORDER BY somaAutor DESC;`);
        sumAutCatMax["name"] = rows[0].catName;
        sumAutCatMax["data"] = rows[0].somaAutor;
        sumAutCatMin["name"] = rows[rows.length - 1].catName;
        sumAutCatMin["data"] = rows[rows.length - 1].somaAutor;
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPages),0) as avgPages, c.catName
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
        sumAutCatMax["name"] = rows[0].catName;
        sumAutCatMax["data"] = rows[0].somaAutor;
        sumAutCatMin["name"] = rows[rows.length - 1].catName;
        sumAutCatMin["data"] = rows[rows.length - 1].somaAutor;
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proReview, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
            var c = catRevPag[r.catName];
            if (!c) {
                c = {
                    name: r.catName,
                    data: []
                };
                catRevPag[r.catName] = c;
                seriesRevPag.push(c);
            }
            c.data.push([r.proReview, r.proPages]);
        });
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proStar, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proStar != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
            var sp = catStrPag[r.catName];
            if (!sp) {
                sp = {
                    name: r.catName,
                    data: []
                };
                catStrPag[r.catName] = sp;
                seriesStrPag.push(sp);
            }
            sp.data.push([r.proStar, r.proPages]);
        });
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proPrice, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
            var pp = catPriPag[r.catName];
            if (!pp) {
                pp = {
                    name: r.catName,
                    data: []
                };
                catPriPag[r.catName] = pp;
                seriesPriPag.push(pp);
            }
            pp.data.push([r.proPrice, r.proPages]);
        });
        rows = await (0, amazonbooks_1.executar)(`SELECT proType, count(proType) as freq
		FROM Product
		WHERE proType != "Not Exists" and proType != "Not exists"
		GROUP BY proType
		ORDER BY freq DESC`);
        rows.forEach((r) => {
            catTyp.data.push(r.freq);
            categoriesTyp.push(r.proType);
        });
        seriesTyp.push(catTyp);
        res.render("index/general", { sumAutCatMax: sumAutCatMax, sumAutCatMin: sumAutCatMin, sumRevCat: sumRevCat, seriesRevPag: JSON.stringify(seriesRevPag), seriesStrPag: JSON.stringify(seriesStrPag), seriesPriPag: JSON.stringify(seriesPriPag), seriesTyp: JSON.stringify(seriesTyp), categoriesTyp: JSON.stringify(categoriesTyp) });
    }
    /* AUTOAJUDA */
    async autoajuda(req, res) {
        let ajuList = [];
        res.render("index/selfHelp");
    }
    /* INFANTIL */
    async infantil(req, res) {
        let kidList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        kidList.push(a);
                    });
                    res.render("index/kids", { kidList: kidList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    /* DIREITO */
    async direito(req, res) {
        let dirList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        dirList.push(a);
                    });
                    res.render("index/laws", { dirList: dirList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    /* HQs e MANGÁS */
    async hqs_mangas(req, res) {
        let acaList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        acaList.push(a);
                    });
                    res.render("index/hqs_mangas", { acaList: acaList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    /* AUTORES */
    async autores(req, res) {
        let autList = [];
        (async () => {
            try {
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/authors", { autList: autList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    /* EDITORAS */
    async editoras(req, res) {
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
                await amazonbooks_1.db.all(`
				  SELECT * from Category;`, async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        pubList.push(a);
                    });
                    res.render("index/publishers", { pubList: pubList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
}
module.exports = IndexRoute;
//# sourceMappingURL=index.js.map