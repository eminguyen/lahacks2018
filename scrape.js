const fetch = require('node-fetch')
const JSDOM = require('jsdom').JSDOM

let url = 'https://me.me/';
var i;
var list = [];

fetch(url)
  .then(resp => resp.text())
  .then(text => {
    let dom = new JSDOM(text)
    let { document } = dom.window;
    let tempList = document.getElementsByTagName("img");
    for(i = 0; i < tempList.length; i++ ) {
      var link = (tempList[i].getAttribute("src"));
      if (link.startsWith("https")){
        list.push(link);
      }
    }
    exports.list = list;
   })
