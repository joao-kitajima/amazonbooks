import { db } from '../amazonbooks';

export default class Author {
    public autCode: number;
    public autName: string;

    // Listar todos autores
    public static async listarAuthors(): Promise<Author[]>{
        var autList: Author[] = [];

        await db.all(`SELECT * FROM Author`, async (err, rows) =>{
            if(err){
                throw err;
            }
            await rows.forEach((aut)=>{
                autList.push(aut);
            })
        });

        return autList;
    }

    // Listar autores de uma categoria especifica
    public static async listarAuthorsCat(catName: string): Promise<Author[]>{
        var autList: Author[] = [];

        await db.all(`SELECT * FROM Author WHERE catName = ?`, [catName], async (err, rows) =>{
            if(err){
                throw err;
            }
            await rows.forEach((aut)=>{
                autList.push(aut);
            })
        });

        return autList;
    }

    // Listar 
}