"use strict";
const fs = require('fs-extra');

// Example template patterns in "template.html" to update:  
// - <meta name="version" content="1.0.0"> 
// - js: <script src='/build/bundle.js' defer></script>
// - css: <link rel='stylesheet' href='/build/bundle.css'>

// to update the pakage json "version"" " use: npm version patch -git-tag-version false

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
    target = 'public/index.html',
    version = ''
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
      }, buffer.toString("utf8").replace('1.0.0', version));
      fs.writeFile(target, indexHtml);
    }
  };
};
