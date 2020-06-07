"use strict";
const fs = require('fs-extra');

// Example template patterns to update:  
// js: <script src='/build/bundle.js' defer></script>
// css: <link rel='stylesheet' href='/build/bundle.css'>

// get the bundles per extension if we have a hashed bundle
function getHashedBundles(bundleInfo = {}) {  
  return Object.keys(bundleInfo).reduce((a, key) => {
    const parts = key.split('.');
    const ext = parts.slice(-1)[0];
    if (Object.keys(a).includes(parts.slice(-1)[0]) && parts.length === 3) {
      a[ext] = key;
      console.log(`html-build ${ext}-bundle:`, key);
    };
    return a;  
  }, {js: '', css: ''});
};

module.exports = function (options = {}) {
  const {
    template = 'src/template.html', 
    target = 'public/index.html'
  } = options;

  return {
    name: "update-html-bundle-hash",

    // update the indexHtml if we have a hashed bundle  
    async generateBundle(_, bundleInfo) {
      const bundles = getHashedBundles(bundleInfo);
      const buffer = await fs.readFile(template);
      const indexHtml = Object.keys(bundles).reduce((a, ext) => {
        if (bundles[ext]) a = a.replace(`bundle.${ext}`, bundles[ext]);
        return a;
      }, buffer.toString("utf8"));
      fs.writeFile(target, indexHtml);
    }

  };
};