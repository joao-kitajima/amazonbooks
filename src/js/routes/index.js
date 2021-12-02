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
    /* DIAGNÓSTICO */
    async relatorio(req, res) {
        res.render('index/report', {
            earliest_date: await (0, amazonbooks_1.scalar)('SELECT MIN(proScrapDate) FROM Product;'),
            latest_date: await (0, amazonbooks_1.scalar)('SELECT MAX(proScrapDate) FROM Product;'),
            total_records: await (0, amazonbooks_1.scalar)('SELECT COUNT(proCode) FROM Product WHERE proCode != "N/A" AND proCode IS NOT NULL;'),
            total_authors: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT autCode) FROM Author WHERE autCode != "N/A" AND autCode IS NOT NULL;'),
            total_books: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proName) FROM Product WHERE proName != "N/A" AND proName IS NOT NULL;'),
            total_publishers: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proPublisher) FROM Product WHERE proPublisher != "N/A" AND proPublisher IS NOT NULL;'),
            total_categories: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT catName) FROM Category;'),
            total_reviews: await (0, amazonbooks_1.scalar)('SELECT SUM(proReview) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" GROUP BY proName);'),
            total_pages: await (0, amazonbooks_1.scalar)('SELECT SUM(proPages) FROM (SELECT proName, proPages AS proPages FROM Product WHERE proPages IS NOT NULL AND proPages != "N/A" GROUP BY proName);'),
            avg_price: await (0, amazonbooks_1.scalar)('SELECT ROUND(AVG(proPrice), 2) FROM (SELECT proName, proPrice FROM Product GROUP BY proName);'),
            max_price: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, MAX(p.proPrice) AS proPrice FROM Product p INNER JOIN Author a ON p.autCode = a.autCode WHERE p.proPrice != "N/A" AND p.proPrice IS NOT NULL;'),
            min_price: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, MIN(p.proPrice) AS proPrice FROM Product p INNER JOIN Author a ON p.autCode = a.autCode WHERE p.proPrice != "N/A" AND p.proPrice IS NOT NULL AND p.proPrice > 0;'),
            avg_stars: await (0, amazonbooks_1.scalar)('SELECT ROUND(AVG(proStar), 2) FROM (SELECT proName, proStar FROM Product WHERE proStar != "N/A" AND proStar IS NOT NULL GROUP BY proName);'),
            max_reviews_perbook: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, MAX(p.proReview) AS proReview FROM Product p INNER JOIN Author a ON p.autCode = a.autCode WHERE p.proReview != "N/A" AND p.proReview IS NOT NULL;'),
            avg_reviews_perbook: await (0, amazonbooks_1.scalar)('SELECT CAST(ROUND(AVG(proReview)) AS INTEGER) FROM (SELECT proName, MAX(proReview) AS proReview FROM Product WHERE proReview != "N/A" AND proReview IS NOT NULL GROUP BY proName);'),
            longest_book: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, MAX(p.proPages) AS proPages FROM Product p INNER JOIN Author a ON p.autCode = a.autCode WHERE p.proPages != "N/A" AND p.proPages IS NOT NULL;'),
            shortest_book: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, MIN(p.proPages) AS proPages FROM Product p INNER JOIN Author a ON p.autCode = a.autCode WHERE p.proPages != "N/A" AND p.proPages IS NOT NULL AND p.proPages > 1;'),
            most_consistent_author: await (0, amazonbooks_1.executar)('SELECT a.autName, COUNT(p.autCode) AS autCode FROM Author a INNER JOIN Product p ON a.autCode = p.autCode GROUP BY a.autName ORDER BY COUNT(p.autCode) DESC LIMIT 1;'),
            oldest_book: await (0, amazonbooks_1.executar)('SELECT a.autName, p.proName, MIN(p.proPublishedDate) AS proPublishedDate FROM Author a INNER join Product P ON a.autCode = p.autCode;'),
            avg_publishing_date: await (0, amazonbooks_1.scalar)('SELECT CAST(ROUND(AVG(proPublishedDate), 1) AS INTEGER) FROM Product;'),
            most_consistent_book: await (0, amazonbooks_1.executar)('SELECT p.proName, a.autName, COUNT(p.proCode) AS proCode FROM Product p INNER JOIN Author a ON a.autCode = p.autCode GROUP BY proName ORDER BY proCode DESC LIMIT 1;'),
            most_consistent_publisher: await (0, amazonbooks_1.executar)('SELECT proPublisher, COUNT(proPublisher) AS proPublisherCount FROM Product WHERE proPublisher != "N/A" AND proPublisher IS NOT NULL GROUP BY proPublisher ORDER BY COUNT(proPublisher) DESC LIMIT 1;')
        });
    }
    /* AUTORES */
    async autores(req, res) {
        let rows;
        let mostAvgStar = { data: 0, name: "" };
        let avgPriAut = [], freqAut = [], avgPagAut = [], autRev = [];
        /* CARD */
        /* maior estrela entre os top 10 consistentes */
        rows = await (0, amazonbooks_1.executar)(`SELECT autName, sum(a.proReview) as reviews, round(avg(a.proStar),2) as avgStars
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Author at ON at.autCode = a.autCode
		WHERE a.proReview != "N/A" and a.proStar != "N/A"
		GROUP by a.autCode
		ORDER BY reviews DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            if (r.avgStars > mostAvgStar.data) {
                mostAvgStar.data = r.avgStars;
                mostAvgStar.name = r.autName;
            }
        });
        /* TOP */
        /* Autor preço médio de preços registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice), 2) as avgPrice, at.autName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Author at ON at.autCode = a.autCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1
		GROUP BY a.autCode
		ORDER BY avgPrice DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            avgPriAut.push({ name: r.autName, data: r.avgPrice });
        });
        /* TOP */
        /* Autor media pag registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPages),2) as avgPages, at.autName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Author at ON at.autCode = a.autCode
		WHERE  a.proPages != "N/A"
		GROUP BY a.autCode
		ORDER BY avgPages DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            avgPagAut.push({ name: r.autName, data: r.avgPages });
        });
        /* TOP */
        /* autor x review */
        rows = await (0, amazonbooks_1.executar)(`SELECT autName, sum(a.proReview) as reviews
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Author at ON at.autCode = a.autCode
		WHERE a.proReview != "N/A"
		GROUP by a.autCode
		ORDER BY reviews DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            autRev.push({ name: r.autName, data: r.reviews });
        });
        /* TOP */
        /* Freq autor pos */
        rows = await (0, amazonbooks_1.executar)(`Select a.autName, count(p.autCode) as freq FROM Product p
		INNER JOIN Author a ON a.autCode = p.autCode
		GROUP BY p.autCode
		ORDER by freq DESC
		LIMIT 10`);
        rows.forEach((r) => {
            freqAut.push({ name: r.autName, data: r.freq });
        });
        res.render('index/authors', {
            mostConsistent: await (0, amazonbooks_1.executar)(`Select a.autName, count(p.autCode) as freq FROM Product p
			INNER JOIN Author a ON a.autCode = p.autCode
			GROUP BY p.autCode
			ORDER by freq DESC
			LIMIT 1`),
            mostReviewed: await (0, amazonbooks_1.executar)(`SELECT autName, sum(a.proReview) as reviews
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			INNER JOIN Author at ON at.autCode = a.autCode
			WHERE a.proReview != "N/A"
			GROUP by a.autCode
			ORDER BY reviews DESC
			LIMIT 1;`),
            mostAvgStar: mostAvgStar,
            mostExpensive: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice),2) as avgPrice, at.autName
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			INNER JOIN Author at ON at.autCode = a.autCode
			WHERE a.proPrice != -1 and a.proPrice != "N/A"
			GROUP BY a.autCode
			ORDER BY avgPrice DESC
			LIMIT 1;`),
            leastExpensive: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice),2) as avgPrice, at.autName
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			INNER JOIN Author at ON at.autCode = a.autCode
			WHERE a.proPrice != -1 and a.proPrice != "N/A"
			GROUP BY a.autCode
			ORDER BY avgPrice
			LIMIT 1;`),
            mostPages: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPages),0) as avgPages, at.autName
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			INNER JOIN Author at ON at.autCode = a.autCode
			WHERE  a.proPages != "N/A"
			GROUP BY a.autCode
			ORDER BY avgPages DESC
			LIMIT 1;`),
            leastPages: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPages),0) as avgPages, at.autName
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			INNER JOIN Author at ON at.autCode = a.autCode
			WHERE  a.proPages != "N/A"
			GROUP BY a.autCode
			ORDER BY avgPages 
			LIMIT 1;`),
            avgPriAut: JSON.stringify(avgPriAut),
            freqAut: JSON.stringify(freqAut),
            avgPagAut: JSON.stringify(avgPagAut),
            autRev: JSON.stringify(autRev)
        });
    }
    /* EDITORAS */
    async editoras(req, res) {
        let rows;
        let mostAvgStar = { data: 0, name: "" };
        let pubPri = [], pubFreq = [], pubRev = [];
        /* CARD */
        /* maior estrela entre os top 10 consistentes */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proPublisher, sum(a.proReview) as reviews, round(avg(a.proStar),2) as avgStars
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		WHERE a.proReview != "N/A" and a.proStar != "N/A" and a.proPublisher != "N/A"
		GROUP by a.proPublisher
		ORDER BY reviews DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            if (r.avgStars > mostAvgStar.data) {
                mostAvgStar.data = r.avgStars;
                mostAvgStar.name = r.proPublisher;
            }
        });
        /* TOP */
        /* pri x pub */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice), 2) as avgPrice, a.proPublisher
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPublisher != "N/A"
		GROUP BY a.proPublisher
		ORDER BY avgPrice DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            pubPri.push({ name: r.proPublisher, data: r.avgPrice });
        });
        /* TOP */
        /* pub x freq */
        rows = await (0, amazonbooks_1.executar)(`Select proPublisher, count(proPublisher) as freq FROM Product p
		WHERE proPublisher != "N/A"
		GROUP BY proPublisher
		ORDER by freq DESC
		LIMIT 10`);
        rows.forEach((r) => {
            pubFreq.push({ name: r.proPublisher, data: r.freq });
        });
        /* TOP */
        /* pub x review */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proPublisher, sum(a.proReview) as reviews
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		WHERE a.proReview != "N/A" and a.proPublisher != "N/A"
		GROUP by a.proPublisher
		ORDER BY reviews DESC
		LIMIT 10;`);
        rows.forEach((r) => {
            pubRev.push({ name: r.proPublisher, data: r.reviews });
        });
        res.render("index/publishers", {
            mostConsistent: await (0, amazonbooks_1.executar)(`Select proPublisher, count(proPublisher) as freq FROM Product
			WHERE proPublisher != "N/A"
			GROUP BY proPublisher
			ORDER by freq DESC
			LIMIT 1;`),
            mostReviewed: await (0, amazonbooks_1.executar)(`SELECT proPublisher, sum(a.proReview) as reviews
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			WHERE a.proReview != "N/A" and a.proPublisher != "N/A"
			GROUP by proPublisher
			ORDER BY reviews DESC
			LIMIT 1;`),
            mostExpensive: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice),2) as avgPrice, a.proPublisher
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			WHERE a.proPrice != -1 and a.proPrice != "N/A" and a.proPublisher != "N/A"
			GROUP BY a.proPublisher
			ORDER BY avgPrice DESC
			LIMIT 1;`),
            leastExpensive: await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice), 2) as avgPrice, a.proPublisher
			FROM Product a
			INNER JOIN (SELECT proName,
						MAX(proCode) as proCode
						FROM Product 
						GROUP BY proName) AS b
			ON a.proName = b.proName and a.proCode = b.proCode
			WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPublisher != "N/A"
			GROUP BY a.proPublisher
			ORDER BY avgPrice 
			LIMIT 1;	`),
            mostAvgStar: mostAvgStar,
            pubPri: JSON.stringify(pubPri),
            pubFreq: JSON.stringify(pubFreq),
            pubRev: JSON.stringify(pubRev)
        });
    }
    /* VISÃO GERAL */
    async visao_geral(req, res) {
        let rows;
        // Cards
        let sumRevCat = {}, sumAutCat = [], avgPagCat = [], avgPriCat = [], dateCat = [], minMaxDate = {}, sumPriCat = [], freqProCat = [];
        /// Graficos
        let seriesRevPag = [], seriesStrPag = [], seriesPriPag = [], seriesTyp = [], seriesPriStr = [];
        let catRevPag = {}, catStrPag = {}, catPriPag = {}, catTyp = { data: [] }, catPriStr = {};
        let categoriesTyp = [];
        let total_records = {};
        /* CARD */
        /* Categoria com maior e menur numero de reviews */
        rows = await (0, amazonbooks_1.executar)(`SELECT sum(a.proReview) as somaReview, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A"
		GROUP BY a.catCode
		ORDER BY somaReview DESC;`);
        sumRevCat["max"] = { name: rows[0].catName, data: rows[0].somaReview };
        sumRevCat["min"] = { name: rows[rows.length - 1].catName, data: rows[rows.length - 1].somaReview };
        /* CARD */
        /* Categorias com maior e menor numero de autores registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT count(DISTINCT autCode) as somaAutor, c.catName FROM Product p
		INNER JOIN Category c ON c.catCode = p.catCode
		GROUP BY p.catCode
		ORDER BY somaAutor DESC;`);
        sumAutCat["max"] = { name: rows[0].catName, data: rows[0].somaAutor };
        sumAutCat["min"] = { name: rows[rows.length - 1].catName, data: rows[rows.length - 1].somaAutor };
        /* CARD */
        /* Categorias com maior e menor numero de pag medias registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPages),0) as avgPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPages != "N/A"
		GROUP BY a.catCode
		ORDER BY avgPages DESC;`);
        avgPagCat["max"] = { name: rows[0].catName, data: rows[0].avgPages };
        avgPagCat["min"] = { name: rows[rows.length - 1].catName, data: rows[rows.length - 1].avgPages };
        /* CARD */
        /* Categorias com maior média de preço dos livros */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(avg(a.proPrice),2) as avgPrice, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != -1 and a.proPrice != "N/A"
		GROUP BY a.catCode
		ORDER BY avgPrice DESC;`);
        rows.forEach((r) => {
            avgPriCat.push({ name: r.catName, data: r.avgPrice });
        });
        avgPriCat["max"] = { name: rows[0].catName, data: rows[0].avgPrice };
        avgPriCat["min"] = { name: rows[rows.length - 1].catName, data: rows[rows.length - 1].avgPrice };
        /* CARD */
        /* Categoria livro mais novos e mais velhos registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT max(a.proPublishedDate) as dataMax, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPublishedDate != "N/A"
		GROUP BY a.catCode
		ORDER BY dataMax DESC
		limit 1;`);
        minMaxDate["max"] = { name: rows[0].catName, data: rows[0].dataMax };
        rows = await (0, amazonbooks_1.executar)(`SELECT min(a.proPublishedDate) as dataMin, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPublishedDate != "N/A"
		GROUP BY a.catCode
		ORDER BY dataMin 
		limit 1;`);
        minMaxDate["min"] = { name: rows[0].catName, data: rows[0].dataMin };
        /* TOP */
        /* Categoria preço soma de preços registrados */
        rows = await (0, amazonbooks_1.executar)(`SELECT round(sum(a.proPrice), 2) as totalPrice, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1
		GROUP BY a.catCode
		ORDER BY totalPrice DESC;`);
        rows.forEach((r) => {
            sumPriCat.push({ name: r.catName, data: r.totalPrice });
        });
        /* TOP */
        /* Freq livros distintos categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT count(DISTINCT proName) as freq, c.catName from Product p
		INNER JOIN Category c ON c.catCode = p.catCode
		GROUP BY p.catCode
		ORDER BY freq DESC;`);
        rows.forEach((r) => {
            freqProCat.push({ name: r.catName, data: r.freq });
        });
        /* TOP */
        /* type & Freq /categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT proType, count(proType) as freq
		FROM Product
		WHERE proType != "Not Exists" and proType != "Not exists"
		GROUP BY proType
		ORDER BY freq DESC`);
        rows.forEach((r) => {
            catTyp.data.push(r.freq);
            categoriesTyp.push(r.proType);
        });
        seriesTyp.push(catTyp);
        /* DSP */
        /* review x pages /categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proReview, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proReview != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
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
        /* DSP */
        /* star x pages /categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proStar, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proStar != "N/A" and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
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
        /* DSP */
        /* price x pages /categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proPrice, a.proPages, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proPages != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
            var pp = catPriPag[r.catName];
            if (!pp) {
                pp = {
                    name: r.catName,
                    data: []
                };
                catPriPag[r.catName] = pp;
                seriesPriPag.push(pp);
            }
            pp.data.push([r.proPrice, r.proPages]);
        });
        /* DSP */
        /* price x stars /categoria */
        rows = await (0, amazonbooks_1.executar)(`SELECT a.proPrice, a.proStar, c.catName
		FROM Product a
		INNER JOIN (SELECT proName,
					MAX(proCode) as proCode
					FROM Product 
					GROUP BY proName) AS b
		ON a.proName = b.proName and a.proCode = b.proCode
		INNER JOIN Category c ON c.catCode = a.catCode
		WHERE a.proPrice != "N/A" and a.proPrice != -1 and a.proStar != "N/A"
		ORDER BY a.catCode`);
        rows.forEach((r) => {
            var pp = catPriStr[r.catName];
            if (!pp) {
                pp = {
                    name: r.catName,
                    data: []
                };
                catPriStr[r.catName] = pp;
                seriesPriStr.push(pp);
            }
            pp.data.push([r.proPrice, r.proStar]);
        });
        res.render("index/general", {
            dateCat: dateCat,
            minMaxDate: minMaxDate,
            avgPagCat: avgPagCat,
            avgPriCat: avgPriCat,
            sumAutCat: sumAutCat,
            sumRevCat: sumRevCat,
            seriesPriStr: JSON.stringify(seriesPriStr),
            sumPriCat: JSON.stringify(sumPriCat),
            freqProCat: JSON.stringify(freqProCat),
            seriesRevPag: JSON.stringify(seriesRevPag),
            seriesStrPag: JSON.stringify(seriesStrPag),
            seriesPriPag: JSON.stringify(seriesPriPag),
            seriesTyp: JSON.stringify(seriesTyp),
            categoriesTyp: JSON.stringify(categoriesTyp),
            total_records: await (0, amazonbooks_1.scalar)('SELECT COUNT(proCode) FROM Product WHERE proCode != "N/A" AND proCode IS NOT NULL;'),
            total_sum: await (0, amazonbooks_1.scalar)('SELECT ROUND(SUM(proPrice), 2) AS sumPrice FROM (SELECT proName, proPrice FROM Product WHERE proPrice > 0 AND proPrice IS NOT NULL AND proPrice != "N/A" GROUP BY proName);'),
            total_authors: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT autCode) FROM Author WHERE autCode != "N/A" AND autCode IS NOT NULL;'),
            total_books: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proName) FROM Product WHERE proName != "N/A" AND proName IS NOT NULL;'),
            total_publishers: await (0, amazonbooks_1.scalar)('SELECT COUNT(DISTINCT proPublisher) FROM Product WHERE proPublisher != "N/A" AND proPublisher IS NOT NULL;')
        });
    }
    /* AUTOAJUDA */
    async autoajuda(req, res) {
        let ajuList = [];
        const rows = await (0, amazonbooks_1.executar)(`SELECT proScrapDate as date, proPosition, proName
		From Product
		WHERE catCode = 1 and proPosition <= 5 and proName IN (Select proName FROM Product
				WHERE proPublisher != "N/A" and catCode = 1
				GROUP BY proName
				ORDER by count(proName) DESC
				LIMIT 5)
		ORDER by proName, proScrapDate `);
        let livros = {}, series = [], datas = {}, categories = [];
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let l = livros[row.proName];
            if (!l) {
                l = {
                    name: row.proName,
                    data: []
                };
                livros[row.proName] = l;
                series.push(l);
            }
            let d = datas[row.date];
            if (!d) {
                datas[row.date] = row.date;
                categories.push(row.date);
            }
            l.data.push(row.proPosition);
        }
        res.render("index/selfHelp", { series: JSON.stringify(series), categories: JSON.stringify(categories) });
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
}
module.exports = IndexRoute;
//# sourceMappingURL=index.js.map