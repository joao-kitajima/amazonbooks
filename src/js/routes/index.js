"use strict";
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../ESPM/4oSemestre/Python/code/Inter/projeto/conexao.db', sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        return console.log(err.message);
    }
    else {
        console.log("Conectado ao DB com sucesso!");
    }
});
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
                await db.all('SELECT * from Category', async (err, rows) => {
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
                await db.all('SELECT autName from Author', async (err, rows) => {
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
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/books", { autList: autList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async autoajuda(req, res) {
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/selfHelp", { autList: autList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async ficcao(req, res) {
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/fiction", { autList: autList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async politica(req, res) {
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/politics", { autList: autList });
                });
            }
            catch (error) {
                throw error;
            }
        })();
    }
    async academicos(req, res) {
        let autList = [];
        (async () => {
            try {
                // Creating the Books table (Book_ID, Title, Author, Comments)
                await db.all('SELECT autName from Author', async (err, rows) => {
                    if (err) {
                        throw err;
                    }
                    await rows.forEach((a) => {
                        autList.push(a);
                    });
                    res.render("index/academics", { autList: autList });
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
                await db.all(`
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