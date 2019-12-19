//William Jones
//2018-07-07
//Render for DSFV

self.addEventListener('message',function(e){
    var message = e.data;
    var area = {startY:21, endY: 40};
   
   /*
   var lineCount = 10;
   
   for(var i =0; i< message.resY-(lineCount-1); i = i + lineCount){
       area.startY = i;
       area.endY = i + lineCount;
       
       var renderData = render(e.data, area);
        self.postMessage(renderData);

   }    
    */
   
   var lineCount = Math.ceil(0.0485 * message.resY + 2.76);
   var chunkCount = Math.round(message.resY / lineCount); //Number of 10 line chuncks rounded to the closest whole number
   
   for(var i = 0; i < chunkCount; i++){
       area.startY = i * lineCount;
       area.endY = (i * lineCount) + lineCount;// + (lineCount - 1);
       
       var renderData = render(e.data, area);
       self.postMessage(renderData);
   }  
   
   //Checking to see if there are lines that didn't get rendered.
   if((message.resY - (lineCount * chunkCount)) > 0){
       area.startY = lineCount * chunkCount;
       area.endY = message.resY;
       
       var renderData = render(e.data, area);
       self.postMessage(renderData);
   }
   
   
}, false);


function render(settings, area){
            
    var renderData = [
        //{posX: 0, posY:0, ARGB:{alpha:0, red:0, green:0, blue:0}}
    ];
    
    var multiplier = 2.718; 
    
    //Set the cavnas Rez

    
    //Testing with this equation.
    //dy/dx = sin(x*y)
    
    //Disable Controls.
    
    //Collect Settings.
    //var resX = +document.getElementById('inputOutputWidth').value;
    //var resY = +document.getElementById('inputOutputHeight').value;
    resX = settings.resX;
    resY = settings.resY;
    
    //Calc X and Y inc.
    //var xInc = (+document.getElementById('inputWindowXMax').value - +document.getElementById('inputWindowXMin').value) / +document.getElementById('inputOutputWidth').value;
    //var yInc = (+document.getElementById('inputWindowYMax').value - +document.getElementById('inputWindowYMin').value) / +document.getElementById('inputOutputHeight').value;
    var xInc = settings.xInc;
    var yInc = settings.yInc;
    
    //Processing loop.    
    for(pY = area.startY; pY < area.endY; pY++){
        for(pX = 0; pX < resX; pX++){
            
            //var minX = +document.getElementById('inputWindowXMin').value;
            //var maxY = +document.getElementById('inputWindowYMax').value;
            var minX = settings.minX;
            var maxY = settings.maxY;
            
            var x = minX + (xInc * pX);
            var y = maxY + (-yInc * pY);
            
            
            //var valu = eval('Math.sin((x)*(y))'); //Equation to process.
            //var valu = Math.sin((x)*(y)); //Equation to process.
            //var valu = x/y;

            //var valu = (3-y)* Math.cos(x);
            //var valu = eval("Math.round((Math.sin(x)-y)*Math.cos(x*y))");
            
            var valu = eval(settings.equation);
            
            
            var num = (Math.atan(multiplier * valu)) / (Math.PI / 2);
                       
            if(num > 0){
                
                var znum = ((Math.PI / 2) - Math.atan(multiplier * valu)) / (Math.PI / 2);
                
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc,
                    ARGB:{alpha: Math.round((num * settings.positiveColorARGB.alpha) + (znum * settings.zeroColorARGB.alpha)),
                        red: Math.round((num * settings.positiveColorARGB.red) + (znum * settings.zeroColorARGB.red)),
                        green: Math.round((num * settings.positiveColorARGB.green) + (znum * settings.zeroColorARGB.green)),
                        blue: Math.round((num * settings.positiveColorARGB.blue) + (znum * settings.zeroColorARGB.blue))
                    },
                    hexColor: ''});
            } else if (num < 0){
                
                //Inverting the num and valu
                num = num * -1;
                valu = valu * -1;
                
                var znum = ((Math.PI / 2) - Math.atan(multiplier * valu)) / (Math.PI / 2);
                
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc,
                    ARGB:{alpha: Math.round((num * settings.negativeColorARGB.alpha) + (znum * settings.zeroColorARGB.alpha)),
                        red: Math.round((num * settings.negativeColorARGB.red) + (znum * settings.zeroColorARGB.red)),
                        green: Math.round((num * settings.negativeColorARGB.green) + (znum * settings.zeroColorARGB.green)),
                        blue: Math.round((num * settings.negativeColorARGB.blue) + (znum * settings.zeroColorARGB.blue))
                    },
                    hexColor: ''});
                
            } else if (num == 0){
                renderData.push({posX:pX, posY:pY, xInc: xInc, yInc: yInc, ARGB: settings.zeroColorARGB, hexColor: ''});
            }

        }
    }
    
    return renderData;
}