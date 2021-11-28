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
    /*
    public async diagnostico(req: amazonbooks.Request, res: amazonbooks.Response) {




        res.render("index/report", {catList: JSON.stringify(await Category.listCategories()), autList: JSON.stringify(await Author.listAuthors()), proList: JSON.stringify(await Product.listProducts())});
    }
    */
    /* DIAGNÓSTICO */
    async diagnostico(req, res) {
        let catList = [];
        let proList = [];
        let autList = [];
        await amazonbooks_1.db.all('SELECT * from Category', async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((cat) => {
                catList.push(cat);
            });
        });
        await amazonbooks_1.db.all('SELECT * from Product', async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((p) => {
                proList.push(p);
            });
        });
        await amazonbooks_1.db.all('SELECT * from Author', async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((aut) => {
                autList.push(aut);
            });
            res.render("index/report", { autList: JSON.stringify(autList), catList: JSON.stringify(catList), proList: JSON.stringify(proList) });
        });
    }
    /* VISÃO GERAL */
    async visao_geral(req, res) {
        let seriesRevPag = [], seriesStrPag = [];
        let catRevPag = {}, catStrPag = {};
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
            res.render("index/general", { seriesRevPag: JSON.stringify(seriesRevPag), seriesStrPag: JSON.stringify(seriesStrPag) });
        });
    }
    /* AUTOAJUDA */
    async autoajuda(req, res) {
        let ajuList = [];
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