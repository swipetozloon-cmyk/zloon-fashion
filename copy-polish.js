/* Keeps visible storefront and dashboard wording consistent after dynamic content loads. */
(() => {
  const corrections = [
    [/No price tags\. Just your next look\./g, 'Clear prices. Find your next look.'],
    [/Zloon womenswear/g, "ZLOON Women's Wear"],
    [/Zloon menswear/g, "ZLOON Men's Wear"],
    [/Zloon Plus/g, 'ZLOON Plus'],
    [/Zloon Spotlight/g, 'ZLOON Spotlight'],
    [/Zloon profile/g, 'ZLOON profile'],
    [/About Zloon/g, 'About ZLOON'],
    [/Discover Zloon/g, 'Discover ZLOON'],
    [/Zloon by Zenz/g, 'ZLOON by ZENZ'],
    [/Zenz/g, 'ZENZ'],
    [/Zloon/g, 'ZLOON'],
    [/E-mail/g, 'Email']
  ];
  function polish(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];let node;
    while(node=walker.nextNode()) if(node.parentElement && !node.parentElement.closest('script,style')) nodes.push(node);
    nodes.forEach(text=>{let value=text.nodeValue;corrections.forEach(([from,to])=>value=value.replace(from,to));if(value!==text.nodeValue)text.nodeValue=value});
  }
  function start(){polish();new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)polish(node.parentElement);else if(node.nodeType===Node.ELEMENT_NODE)polish(node)}))).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
