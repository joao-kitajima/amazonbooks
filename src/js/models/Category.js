"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonbooks_1 = require("../amazonbooks");
class Category {
    // get todas categorias
    static async listarCategorias() {
        let catList = [];
        await amazonbooks_1.db.all(`SELECT * FROM Category`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((cat) => {
                catList.push(cat);
            });
        });
        return catList;
    }
}
exports.default = Category;
//# sourceMappingURL=Category.js.map