function callback(){

var bg = chrome.extension.getBackgroundPage();

var HTML = bg.HTML;

document.write(bg.IMG);
document.write(HTML);

}
callback();
