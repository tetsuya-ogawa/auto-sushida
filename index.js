var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var Tesseract = require('tesseract.js');


//WebブラウザーはChrome
var driver = new webdriver.Builder().
   withCapabilities(webdriver.Capabilities.chrome()).
   build();
driver.manage().timeouts().implicitlyWait(3000);
driver.switchTo().defaultContent();
var $ = driver.findElement.bind(driver);

let counter = 0;

function screenShot(callback) {
    counter++;
    driver.takeScreenshot().then(function(data) {
        var base64Data = data.replace(/^data:image\/png;base64,/, "");
        require('fs').writeFile(counter+".png", base64Data, 'base64', function (err) {
            if (err) console.log(err);
        });
    });
    setTimeout(function(){ callback(counter) },268);
}

function sendText(counter) {
    Tesseract.recognize(counter+".png",{ lang:"eng" }).then(function(e){
        var text = e.text.replace(/Q/g,'').replace(/—/g,'-');
        driver.actions().sendKeys(text).perform();
        console.log(text);
    });

}

driver.get('http://neutral.x0.com/home/sushida/play1.html').then(function() {
    process.stdin.on('data', function (data) {
        if(data == 0){
          driver.takeScreenshot().then(function(data) {
            var base64Data = data.replace(/^data:image\/png;base64,/, "");
            require('fs').writeFile("寿司打.png", base64Data, 'base64', function (err) {
              if (err) console.log(err);
            });
          });
        }else{
          screenShot(sendText)
        }
    });
});
