"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const amazonbooks_1 = require("../amazonbooks");
class Product {
    // Listar TODOS os produtos
    static async listProducts() {
        var proList = [];
        await amazonbooks_1.db.all(`SELECT * FROM Product`, async (err, rows) => {
            if (err) {
                throw err;
            }
            await rows.forEach((pro) => {
                proList.push(pro);
            });
        });
        return proList;
    }
}
exports.default = Product;
//# sourceMappingURL=Product.js.map