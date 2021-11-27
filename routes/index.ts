﻿import amazonbooks = require("teem");
import { db } from '../amazonbooks';
import Category from '../models/Category';

class IndexRoute {
	/* PÁGINA INICIAL */
	public async index(req: amazonbooks.Request, res: amazonbooks.Response) {
		let pageSettings = {
			layout: "landingPage"
		};
		
		res.render("index/index", pageSettings);
	}
	

	/* DIAGNÓSTICO */
	public async diagnostico(req: amazonbooks.Request, res: amazonbooks.Response) {
		let autList = []; 
		let proList = [];
		let catList: Promise<Category[]>
		catList = Category.listarCategories();

		(async () => {
			try {
		
				await db.all(`SELECT proPosition, proScrapDate, proName FROM Product
					WHERE proName = "Mulheres que correm com os lobos";`, async (err, rows)=>{
						if(err){
							throw err;
						}
						await rows.forEach((p) =>{
							proList.push(p)
						})
					})
				await db.all('SELECT * from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						autList.push(a)
					})
					res.render("index/report", {catList: await catList.then((result => result)), db: db, autList: autList, proList: proList});
				})	
			}
			catch (error) { throw error; }
		  })();

		
	}


	/* VISÃO GERAL */
	public async visao_geral(req: amazonbooks.Request, res: amazonbooks.Response){
		let livList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						livList.push(a)
					})
					res.render("index/general", {livList: livList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* AUTOAJUDA */
	public async autoajuda(req: amazonbooks.Request, res: amazonbooks.Response){
		let ajuList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						ajuList.push(a)
					})
					res.render("index/selfHelp", {ajuList: ajuList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* INFANTIL */
	public async infantil(req: amazonbooks.Request, res: amazonbooks.Response){
		let kidList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						kidList.push(a)
					})
					res.render("index/kids", {kidList: kidList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* DIREITO */
	public async direito(req: amazonbooks.Request, res: amazonbooks.Response){
		let dirList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						dirList.push(a)
					})
					res.render("index/laws", {dirList: dirList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* HQs e MANGÁS */
	public async hqs_mangas(req: amazonbooks.Request, res: amazonbooks.Response){
		let acaList = [];

		(async () => {
			try {
			  	// Creating the Books table (Book_ID, Title, Author, Comments)
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						acaList.push(a)
					})
					res.render("index/hqs_mangas", {acaList: acaList});
				})	
			}
			catch (error) { throw error; }
		  })();
	}


	/* AUTORES */
	public async autores(req: amazonbooks.Request, res: amazonbooks.Response) {
		let autList = [];

		(async () => {
			try {
			  	await db.all('SELECT autName from Author', async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						autList.push(a)
					})
					res.render("index/authors", {autList: autList});
				})	
			}
			catch (error) { throw error; }
		  })();


	}


	/* EDITORAS */
	public async editoras(req: amazonbooks.Request, res: amazonbooks.Response){
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

				await db.all(`
				  SELECT * from Category;`, 
				  async (err, rows) =>{
					if(err){
						throw err;
					}
					await rows.forEach((a)=>{
						pubList.push(a)
					})
					res.render("index/publishers", {pubList: pubList});
				})
			}
			catch (error) { throw error; }
		  })();
	}
}

export = IndexRoute;
