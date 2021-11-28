"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonbooks_1 = require("../amazonbooks");
class Author {
    // Listar todos autores
    static async listAuthors() {
        var autList = [];
        await amazonbooks_1.db.all(`SELECT * FROM Author`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((aut) => {
                autList.push(aut);
            });
        });
        return autList;
    }
    // Listar autores de uma categoria especifica
    static async listAuthorsCat(catName) {
        var autList = [];
        await amazonbooks_1.db.all(`SELECT * FROM Author WHERE catName = ?`, [catName], async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((aut) => {
                autList.push(aut);
            });
        });
        return autList;
    }
}
exports.default = Author;
//# sourceMappingURL=Author.js.map