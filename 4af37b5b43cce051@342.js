// https://observablehq.com/@npogeant/crypto-market-top-100-currencies@342
import define1 from "./e93997d5089d7165@2303.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["CMC Crypto Portfolio Tracker - CleanSummary 04 06 2021.csv",new URL("./files/7ea5b00f839b9adccfc7c7256fcb990af28389c7be8c37f5088aad59e3ebe751c7609f13bf48ac4955049cb7a16f401113c2cd72efc1bff7bbb30bada2920c6d",import.meta.url)],["Charter Bold.ttf",new URL("./files/9c27e4ba737048627c68018574b3da09092f1bffe5e835379e0c2cae541c69c8d032e89c60461c83869502b2ef3ea6980a65f6dceb5ffb0d6da9b2731b8de97d",import.meta.url)],["Charter Regular.ttf",new URL("./files/c5eacc6a12dad780ea122453314cbc5a1044f0ce5cb6baffdb99b33afaa5de09efa64972a07e2d4f97cd95983352c90bbb6fb218614ce11b6c612a178d8df6b5",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`<h1>Crypto Market <br/><i>Top 100 Currencies</h2> `
)});
  main.variable(observer()).define(["md"], function(md){return(
md`### June 4 2021 `
)});
  main.variable(observer("viewof variable")).define("viewof variable", ["radio"], function(radio){return(
radio({
  title: 'Variable',
  options: [
    { label: 'Market Capitalization', value: 'market_cap' },
    { label: 'Volume 24h', value:'volume_24h' },
    { label: 'Price', value: 'price' },
    { label: 'Circulating Supply', value: 'circulating_supply' }
  ],
  value: 'market_cap'
})
)});
  main.variable(observer("variable")).define("variable", ["Generators", "viewof variable"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","data","width","height","pack"], function(d3,data,width,height,pack)
{
  
	const root = d3.hierarchy({children: data})
	.sum(function(d) { return d['market_cap']; })
	.sort(function(a, b) { return b['market_cap'] - a['market_cap']; })
  
  const svg = d3.create("svg")
      .attr("class","graph")
      .attr("viewBox", [0, 0, width, height])
      .attr("font-size", 10)
      .attr("font-family", "Roboto")
      .attr("text-anchor", "middle");
  
  const tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "5px")
    .style("color", "white")
    .style("position", "absolute");
  
  let showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("<b>Currency: " + d.data.symbol 
      + "</b> <br> Name: " + d.data.name
      + "</b> <br> CMC Rank: " + d.data.cmc_rank
      + "<br> Price: " + d.data.priceClean
      + "<br> Market Capitalization: " + d.data.market_capClean
      + "<br> Volume in 24h: " + d.data.volume_24hClean
      + "<br> Ciculating Supply: " + d.data.circulating_supplyClean + " " + d.data.symbol)
      .style("left", (d.x + (d3.mouse(this)[0] + 30)) + "px")
      .style("top", (d.y + (d3.mouse(this)[1] + 30)) + "px");
  }

  let moveTooltip = function(d) {
    tooltip
      .style("left", (d.x + (d3.mouse(this)[0] + 200)) + "px")
      .style("top", (d.y + (d3.mouse(this)[1] + 200)) + "px");
  }

  let hideTooltip = function(d) {
          tooltip
            .transition()
            .duration(200)
            .style("opacity", 0);
        }

  const node = svg.selectAll(".node")
	.data(pack(root).leaves())
	.enter().append("g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .on("mouseover", showTooltip)
    .on("mousemove", moveTooltip)
    .on("mouseleave", hideTooltip);

  node.append("circle")
       .data(pack(root).leaves())
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .attr("fill", function (d) {  
        if (d.data.symbol == "BTC") {
                return 'goldenrod';
              } else {
                return 'black';
              }
            });
  
  node.append("text")
        .attr("class","labels")
        .attr("dy", ".2em")
        .text(function(d) {
            return d.data.symbol ;
        })
        .attr("font-family", "Roboto")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle")
  
  node.append("text")
        .attr("class","SecondLabels")
        .attr("dy", "1.8em")
        .text(function(d) {
            return d.data.market_capClean;
        })
        .attr("font-family", "Roboto")
        .attr("font-size", function(d){
            return d.r/7;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle");
  
svg.node().drawData = function updateData(variable) {
  
  var dict = {
      market_cap: "market_capClean",
      volume_24h: "volume_24hClean",
      price: "priceClean",
      circulating_supply: "circulating_supplyClean"
  };

	var root = d3.hierarchy({children: data})
	.sum(function(d) { return d[variable]; })
	.sort(function(a, b) { return b[variable] - a[variable]; })

	var node = svg.selectAll(".node")
	  .data(pack(root).leaves())
    .transition()
    .duration(2000)
	  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
    .select("circle")
      .attr("id", function(d) { return d.id; })
      .attr("r", function(d) { return d.r; })
      .attr("fill", function (d) {  
        if (d.data.symbol == "BTC") {
                return 'goldenrod';
              } else {
                return 'black';
              }
            });

   svg.selectAll(".node").select(".labels")
        .transition()
        .duration(2000)
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.symbol;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white")
        .attr("font-family", "Roboto");

     svg.selectAll(".node").select(".SecondLabels")
        .transition()
        .delay(500)
        .duration(1000)   
        .attr("dy", "1.8em")
        .text(function(d) {
            return d.data[dict[variable]];
        })
        .attr("font-family", "Roboto")
        .attr("font-size", function(d){
            return d.r/7;
        })
        .attr("fill", "white")
        .style("text-anchor", "middle");
}
  
  return svg.node();
}
);
  main.variable(observer()).define(["chart","variable"], function(chart,variable){return(
chart.drawData(variable)
)});
  main.variable(observer("data")).define("data", ["FileAttachment","millionsFormat","supplyFormat"], async function(FileAttachment,millionsFormat,supplyFormat){return(
(await FileAttachment("CMC Crypto Portfolio Tracker - CleanSummary 04 06 2021.csv").csv())
      .map(({symbol, name, cmc_rank, market_cap, volume_24h, price, circulating_supply}) => ({
        symbol: symbol, 
        market_cap: market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
        cmc_rank : cmc_rank,
        name : name,
        market_capClean: millionsFormat(market_cap.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),
        volume_24h: volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
        volume_24hClean: millionsFormat(volume_24h.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)),  
        price: price.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
        priceClean: millionsFormat(price.replace(/\,/g, '')),
        circulating_supply: circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2),
        circulating_supplyClean: supplyFormat(circulating_supply.replace(/\,/g, '').replace(/\./g, '').slice(0,-2)) 
}))
)});
  main.variable(observer("pack")).define("pack", ["d3","width","height"], function(d3,width,height){return(
d3.pack()
  .size([width, height])
  .padding(1.5)
)});
  main.variable(observer("width")).define("width", function(){return(
1000
)});
  main.variable(observer("height")).define("height", function(){return(
600
)});
  main.variable(observer("supplyFormat")).define("supplyFormat", ["d3"], function(d3){return(
function supplyFormat(x) {
  var s = d3.format(".3s")(x);
  switch (s[s.length - 1]) {
    case "G": return s.slice(0, -1) + "B";
  }
  return s;
}
)});
  main.variable(observer("millionsFormat")).define("millionsFormat", ["d3"], function(d3){return(
d3.format("$,")
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.variable(observer("charter")).define("charter", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("Charter Bold.ttf")
)});
  main.variable(observer()).define(["html","FileAttachment"], async function(html,FileAttachment){return(
html`
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto&display=swap">

<style>
html {
  margin: 0;
}

@font-face {
	font-family: "CharterBold";
	src: url(${await FileAttachment('Charter Bold.ttf')
};

@font-face {
	font-family: "CharterRegular";
	src: url(${await FileAttachment('Charter Regular.ttf')
};

h1 {
  margin-bottom: 20px;
  width: 100%;
  font-family: "CharterBold";
  font-size: 40px;
}

.category {
  font-family: "CharterBold";
  font-size: 15px;
  left: 350px;
  text-align: center;
  margin-bottom: 30px;
}

#title {
  margin-bottom: 10px;
}

text.title {
  font-family: "CharterBold";
  font-size: 40px;
  text-align: center;
}


</style>`
)});
  return main;
}
