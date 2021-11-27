"use strict";
const amazonbooks_1 = require("../amazonbooks");
class IndexRoute {
    async index(req, res) {
        let pageSettings = {
            layout: "landingPage"
        };
        res.render("index/index", pageSettings);
    }
    async dashboard(req, res) {
        let catList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT * from Category', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((c) => {
                        catList.push(c);
                    });
                    res.render("index/dashboard", { catList: catList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async autores(req, res) {
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
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
    async livros(req, res) {
        let livList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        livList.push(a);
                    });
                    res.render("index/books", { livList: livList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async autoajuda(req, res) {
        let ajuList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        ajuList.push(a);
                    });
                    res.render("index/selfHelp", { ajuList: ajuList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async ficcao(req, res) {
        let ficList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        ficList.push(a);
                    });
                    res.render("index/fiction", { ficList: ficList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async politica(req, res) {
        let polList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        polList.push(a);
                    });
                    res.render("index/politics", { polList: polList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async academicos(req, res) {
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
                    res.render("index/academics", { acaList: acaList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async editoras(req, res) {
        let pubList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await amazonbooks_1.db.all(`
				  SELECT proName, proPrice, proPublisher, c.catName 
					FROM Product p 
					INNER JOIN Category c 
					INNER JOIN Product_Category pc 
					WHERE proPublisher = "Todolivro" and p.proCode = pc.proCode and c.catCode = pc.catCode ;`, async (err, rows) => {
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