const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

function fmtdir(p) {
    return path.join(__dirname, p);
}

function emitPageHTML(name) {
    let data = require(fmtdir(`./data/${name}.json`));
    const template = fs.readFileSync(fmtdir(`./templates/need/${name}-hb.html`), {encoding: "utf8", flag: "r"});
    const buildHTML= Handlebars.compile(template);
    let html = buildHTML(data);
    
    fs.writeFileSync(fmtdir(`./static/${name}.html`), html);
}

const pages = [
    "animals",
    "donations",
    "emotional",
    "food",
    "housing",
    "meals",
    "shelters",
    "translation",
    "transportation"
];

for (let i = 0; i < pages.length; i++) {
    let page = pages[i];
    console.log(`Building page "${page}"`);
    emitPageHTML(page);
    console.log(`Page "${page}" emitted.`);
}
console.log("Finished");