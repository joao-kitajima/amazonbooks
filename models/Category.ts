import { db } from '../amazonbooks';

export default class Category {
    public catCode: number;
    public catName: string;
    public catLink: string;


    // get todas categorias
    public static async listarCategories(): Promise<Category[]>{
        let catList: Category[] = [];
        await db.all(`SELECT * FROM Category`, async (err, rows) =>{
            if (err){
                throw err;
            }
            await rows.forEach((cat)=> {
                catList.push(cat);
            })
        });
        
        return catList;
    } 
    // get categoria especifica
}