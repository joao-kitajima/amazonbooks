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
            total_records: await (0, amazonbooks_1.scalar)('SELECT COUNT(proCode) FROM Product;'),
            total_books: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT autCode) FROM Author;'),
            total_authors: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proName) FROM Product;'),
            total_publishers: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proPublisher) FROM Product;'),
            total_categories: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT catName) FROM Category;')
        });
    }
    /* VISÃO GERAL */
    async visao_geral(req, res) {
        let seriesRevPag = [], seriesStrPag = [], seriesPriPag = [], seriesTyp = [];
        let catRevPag = {}, catStrPag = {}, catPriPag = {}, catTyp = { data: [] };
        let categorias = {};
        let categoriesTyp = [];
        await amazonbooks_1.db.all(`SELECT a.proReview, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((r) => {
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
        });
        await amazonbooks_1.db.all(`SELECT a.proStar, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proStar != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((r) => {
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
        });
        await amazonbooks_1.db.all(`SELECT a.proPrice, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPages != "N/A"
		ORDER BY a.catCode`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((r) => {
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
        });
        await amazonbooks_1.db.all(`SELECT proType, count(proType) as freq
		FROM Product
		WHERE proType != "Not Exists" and proType != "Not exists"
		GROUP BY proType
		ORDER BY freq DESC`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((r) => {
                catTyp.data.push(r.freq);
                categoriesTyp.push(r.proType);
            });
            seriesTyp.push(catTyp);
            res.render("index/general", { seriesRevPag: JSON.stringify(seriesRevPag), seriesStrPag: JSON.stringify(seriesStrPag), seriesPriPag: JSON.stringify(seriesPriPag), seriesTyp: JSON.stringify(seriesTyp), categoriesTyp: JSON.stringify(categoriesTyp) });
        });
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