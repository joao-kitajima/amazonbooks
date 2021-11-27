import {db} from '../amazonbooks';

lista = []

db.all(`SELECT proPosition, proScrapDate FROM Product
    WHERE proName = "Mulheres que correm com os lobos";`, async (err, rows) =>{
    if(err){
        throw err;
    }
    await rows.forEach((c)=>{
        lista.push(c)
    })
});

console.log(lista);    
var options = {
    chart: {
      type: 'line'
    },
    series: [{
      name: 'sales',
      data: [30,40,35,50,49,60,70,91,125]
    }],
    xaxis: {
      categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
    }
}

var chart = new ApexCharts(document.querySelector("#chart_01"), options);
var chart2 = new ApexCharts(document.querySelector("#chart_02"), options);

chart.render();