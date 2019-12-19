//Local Veribles
var negativeColorARGB = {alpha:0, red:0, green:0, blue:0};
var zeroColorARGB = {alpha:0, red:0, green:0, blue:0};
var positiveColorARGB = {alpha:0, red:0, green:0, blue:0};

var equation = 'Math.sin(x*y)';

$(document).ready(function(){
    updateColors();
});

$('#colorNegative').change(function(){
    updateColors();
});

$('#colorZero').change(function(){
    updateColors();
});

$('#colorPositive').change(function(){
    updateColors();
});

$(function(){

    $(".dropdown-menu li a").click(function(){
        if($(this).text != 'Custom'){
            equation = $(this).text();
        } else {
            
        }
    });

});

function updateColors(){
    //Pulling in colors.
    var negHex = document.getElementById("colorNegative").value;
    var zeroHex = document.getElementById("colorZero").value;
    var posHex = document.getElementById("colorPositive").value;
    
    //Converting from hex to argb
    negativeColorARGB = hexToRgbA(negHex);
    zeroColorARGB = hexToRgbA(zeroHex);
    positiveColorARGB = hexToRgbA(posHex);
}

function updateCanvas(){
    var c = document.getElementById("canvasGraphic");
    c.width = +document.getElementById('inputOutputWidth').value;
    c.height = +document.getElementById('inputOutputHeight').value;
    
}

$('#inputCustomEQ').change(function(){
    equation = $('#inputCustomEQ').val();
});

function downloadCanvas(link, canvasId, filename) {
    /*
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
    */
    //When the user saves a image I take a snap shot of the settings.
    //insertData();
    
    var canvas = document.getElementById("canvasGraphic");
    var url = canvas.toDataURl('image/jpeg');
}

function download(){
    
    //Inserting the data into the run database.
    insertData();
        
    var canvas = document.getElementById("canvasGraphic");
    var dt = canvas.toDataURL('image/jpeg');
    
    //Getting the date.
    var curDate = new Date();
    downloadLink.download = curDate.getFullYear().toString() + (curDate.getMonth() + 1).toString() + curDate.getDay().toString() +
                                            curDate.getHours().toString() + curDate.getMinutes().toString() + curDate.getSeconds().toString() + 'eupollo.jpg';
    
    this.href = dt;
}

downloadLink.addEventListener('click', download, false);

//document.getElementById('download').addEventListener('click', function() {
    
    
    /*
    downloadCanvas(this, 'canvasGraphic', curDate.getFullYear().toString() + (curDate.getMonth() + 1).toString() + curDate.getDay().toString() +
                                            curDate.getHours().toString() + curDate.getMinutes().toString() + curDate.getSeconds().toString() + 'eupollo.png');
}, false);
*/


$('#btnTestInsert').click(function(){
    if(typeof(Worker) !== 'undefinded'){
        console.log('workers supported');
        
        worker = new Worker('js/DSFVrender.js');
        
        worker.addEventListener('message', function(e){
            console.log(e.data);
        })
        
        worker.postMessage('test');
        
    } else {
        console.log('worker not supported');
    }
});


function insertData(){
    //Getting the data I want to send out.
    var data = { xMin: document.getElementById("inputWindowXMin").value,
                    xMax: document.getElementById("inputWindowXMax").value,
                    yMin: document.getElementById("inputWindowYMin").value,
                    yMax: document.getElementById("inputWindowYMax").value,
                    equation: equation,
                    resWidth: document.getElementById("inputOutputWidth").value,
                    resHeight: document.getElementById("inputOutputHeight").value,
                    negColor: negativeColorARGB.red + ',' + negativeColorARGB.green + ',' + negativeColorARGB.blue + ',' + negativeColorARGB.alpha,
                    zeroColor: zeroColorARGB.red + ',' + zeroColorARGB.green + ',' + zeroColorARGB.blue + ',' + zeroColorARGB.alpha,
                    posColor: positiveColorARGB.red + ',' + positiveColorARGB.green + ',' + positiveColorARGB.blue + ',' + positiveColorARGB.alpha,
                }
    
    //obj = { "table":"customers", "limit":10 };
    dbParam = JSON.stringify(data);
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
        }
    };
    xmlhttp.open("GET", "php_scripts/DSFV_insert.php?x=" + dbParam, true);
    xmlhttp.send();
}



$('#btnRender').click(function(){
    //render();
    var worker; // worker for renderer
    
    if(typeof(Worker) !== 'undefined'){
        
        if(typeof(worker) === 'undefined' ){
            worker = new Worker('js/DSFVrender.js');
        }
        
        
        worker.addEventListener('message', function(e){
            //renderingState(true);
            //updateCanvas();
            renderCanvas(e.data);
        });
        
        updateCanvas();
        //renderingState(false);
        worker.postMessage(collectNeededData());
        
    } else {
        console.log('worker not supported');
    }
    
});

function collectNeededData(){
    var renderSettings = {
        resX: +document.getElementById('inputOutputWidth').value,
        resY: +document.getElementById('inputOutputHeight').value,
        xInc: (+document.getElementById('inputWindowXMax').value - +document.getElementById('inputWindowXMin').value) / +document.getElementById('inputOutputWidth').value,
        yInc: (+document.getElementById('inputWindowYMax').value - +document.getElementById('inputWindowYMin').value) / +document.getElementById('inputOutputHeight').value,
        minX: +document.getElementById('inputWindowXMin').value,
        maxX: +document.getElementById('inputWindowXMax').value,
        minY: +document.getElementById('inputWindowYMax').value,
        maxY: +document.getElementById('inputWindowYMax').value,
        equation: equation,
        negativeColorARGB: negativeColorARGB,
        zeroColorARGB: zeroColorARGB,
        positiveColorARGB:  positiveColorARGB
    }
 
    return renderSettings;
}

function render(){
    
    renderingState(false);
        
    var renderData = [
        //{posX: 0, posY:0, ARGB:{alpha:0, red:0, green:0, blue:0}}
    ];
    
    var multiplier = 2.718; 
    
    //Set the cavnas Rez

    
    //Testing with this equation.
    //dy/dx = sin(x*y)
    
    //Disable Controls.
    
    //Collect Settings.
    var resX = +document.getElementById('inputOutputWidth').value;
    var resY = +document.getElementById('inputOutputHeight').value;
    
    
    //Calc X and Y inc.
    var xInc = (+document.getElementById('inputWindowXMax').value - +document.getElementById('inputWindowXMin').value) / +document.getElementById('inputOutputWidth').value;
    var yInc = (+document.getElementById('inputWindowYMax').value - +document.getElementById('inputWindowYMin').value) / +document.getElementById('inputOutputHeight').value;
        
    //Processing loop.    
    for(pY = 0; pY < resY; pY++){
        for(pX = 0; pX < resX; pX++){
            
            var minX = +document.getElementById('inputWindowXMin').value;
            var maxY = +document.getElementById('inputWindowYMax').value;
            
            var x = minX + (xInc * pX);
            var y = maxY + (-yInc * pY);
            
            
            //var valu = eval('Math.sin((x)*(y))'); //Equation to process.
            //var valu = Math.sin((x)*(y)); //Equation to process.
            //var valu = x/y;

            //var valu = (3-y)* Math.cos(x);
            //var valu = eval("Math.round((Math.sin(x)-y)*Math.cos(x*y))");
            
            var valu = eval(equation);
            
            
            var num = (Math.atan(multiplier * valu)) / (Math.PI / 2);
                       
            if(num > 0){
                
                var znum = ((Math.PI / 2) - Math.atan(multiplier * valu)) / (Math.PI / 2);
                
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc,
                    ARGB:{alpha: Math.round((num * positiveColorARGB.alpha) + (znum * zeroColorARGB.alpha)),
                        red: Math.round((num * positiveColorARGB.red) + (znum * zeroColorARGB.red)),
                        green: Math.round((num * positiveColorARGB.green) + (znum * zeroColorARGB.green)),
                        blue: Math.round((num * positiveColorARGB.blue) + (znum * zeroColorARGB.blue))
                    },
                    hexColor: ''});
            } else if (num < 0){
                
                //Inverting the num and valu
                num = num * -1;
                valu = valu * -1;
                
                var znum = ((Math.PI / 2) - Math.atan(multiplier * valu)) / (Math.PI / 2);
                
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc,
                    ARGB:{alpha: Math.round((num * negativeColorARGB.alpha) + (znum * zeroColorARGB.alpha)),
                        red: Math.round((num * negativeColorARGB.red) + (znum * zeroColorARGB.red)),
                        green: Math.round((num * negativeColorARGB.green) + (znum * zeroColorARGB.green)),
                        blue: Math.round((num * negativeColorARGB.blue) + (znum * zeroColorARGB.blue))
                    },
                    hexColor: ''});
                
            } else if (num == 0){
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc, ARGB: zeroColorARGB, hexColor: ''});
            }
            
            //console.log('test');
            
        }
    }
    
    /*
    for(i = 0; i< renderData.length; i++){
        renderData[i].hexColor = ('#' + renderData[i].ARGB.red.toString(16) + renderData[i].ARGB.green.toString(16) + renderData[i].ARGB.blue.toString(16));// + (renderData[i].ARGB.alpha * 255).toString(16).substring(0,2));
    }
    */
    
    console.log(renderData);
    renderingState(true);
    updateCanvas();
    renderCanvas(renderData);
}

//Function converts the hex value to RGBA
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length == 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        var rgbText = 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
        var argb = { red: (c>>16)&255, green: (c>>8)&255, blue: c&255, alpha: 255};
        return argb;
    }
    throw new Error('Bad Hex');
}

function renderCanvas(imageData){
    //Getting the canvas.
    var c = document.getElementById("canvasGraphic");
    var ctx = c.getContext("2d");
    
    //Clearing canvas
    //ctx.clearRect(0, 0, +document.getElementById('inputOutputWidth').value, +document.getElementById('inputOutputHeight').value);
    
    for(i=0; i< imageData.length; i++){
        ctx.fillStyle = "rgba(" + imageData[i].ARGB.red + "," + imageData[i].ARGB.green + ","
                + imageData[i].ARGB.blue + "," +(imageData[i].ARGB.alpha/255)+")";
        ctx.fillRect( imageData[i].posX, imageData[i].posY, 1, 1 );
    }
}

function myFunction() {
    var x = document.getElementById("colorNegative").value;
    document.getElementById("demo").innerHTML = x;
}

//Rendering graphic controls
function renderingState(state){
    if(state){
        $("#renderArea").html('<canvas id="canvasGraphic"></canvas>')
    } else {
        $("#renderArea").html('<div class=\"loader\"></div>')
    }
}