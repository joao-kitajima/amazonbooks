import { db } from '../amazonbooks'

export default class Product{
    public proCode: number;
    public autCode: number;
    public catCode: number;
    public proName: string;
    public proType: string;
    public proPrice: number;
    public proPosition: number;
    public proStar: number;
    public proReview: number;
    public proLanguage: string;
    public proPages: number;
    public proPublishedDate: Date;
    public proScrapDate: Date;
    public proLink: string;
    public proPublisher: string;
    public proImage: string;


    // Listar TODOS os produtos
    public static async listProducts(): Promise<Product[]> {
        var proList: Product[] = [];

        await db.all(`SELECT * FROM Product`, async (err, rows) =>{
            if(err){
                throw err;
            }
            await rows.forEach((pro)=>{
                proList.push(pro);
            })
        });

        return proList;
    }
}