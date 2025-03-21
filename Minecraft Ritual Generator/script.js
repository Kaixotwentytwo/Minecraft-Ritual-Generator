'use strict';

let body = document.querySelector('body'),
    x = document.querySelector('#input_x'),
    z = document.querySelector('#input_z'),
    grid = document.querySelector('.grid'),
    confirmButton = document.querySelector('#confirmSizes'),
    blockPallete = document.querySelector('.blockPallete'),
    blockPalleteItems,
    giveCommandButton = document.querySelector('#giveCommandButton'),
    commandInput = document.querySelector('#commandInput'),
    AddBlockButton = document.getElementById("AddBlockButton"),
    TakePlayerCoordsButton = document.getElementById("TakePlayerCoordsButton"),
    AddGridLayerLowerButton = document.getElementById("AddGridLayerLower"),
    AddGridLayerUpperButton = document.getElementById("AddGridLayerUpper"),
    addLayerButton = document.querySelectorAll(".addLayerButton"),
    customCommandBlock = document.getElementById("CustomCommand"),
    playerCoordInput = document.getElementsByClassName("playerCoordInput"),
    coordsPlayerBlock = document.getElementsByClassName("coordsPlayerBlock"),
    EntityInput = document.getElementById("EntityInput")
;

let xnzRestrictions = 15,
    countOfObjects,
    playerX,
    playerZ,
    inputCount = 0,
    xx,
    zz,
    lowerCount = 0,
    upperCount = 0,
    startCommand = "execute at @a",
    resultCommand = "",
    commandsList = [],
    allGrids
;

function AddEventsOnButtons() {
    blockPalleteItems = document.querySelectorAll('.blockPalleteItem');
    for (let i = 1; i < blockPalleteItems.length; i++) {
        blockPalleteItems[i].setAttribute("status", "no");
        blockPalleteItems[i].addEventListener("click", function() {
            blockPalleteItems.forEach(e => e.setAttribute("status", "no"));
            this.setAttribute("status", "yes");
        });
    }
}
AddEventsOnButtons();

function placeHoldersOnCustomCommandButton() {
    var placeholders = ["summon creeper",
                        "summon zombie ~ ~3 ~",
                        "summon lightning_bolt",
                        "give @s diamond_block",
                        "summon tnt",
                        "fill ~3 ~3 ~3 ~-3 ~-3 ~-3 water keep",
                        "fill ~3 ~3 ~3 ~-3 ~-3 ~-3 air destroy",
                        'tellraw @a {"text":"Herobrine joined the game","color":"yellow"}',
                        "clear @s diamond",
                        "kick @a",
                        "kill @r",
                        "summon sheep",
                        "summon cow",
                        "summon pig",
                        "summon chicken",
                        "summon giant",
                        "summon armor_stand ~ ~3 ~",
                        "summon boat ~ ~5 ~",
                        "setblock ~ ~ ~ lava",
                        "setblock ~ ~-1 ~ magma destroy",
                        "say SCP - SUUUCK",
                        "tp @s ~ ~3 ~",
                        "tp @a ~ ~100 ~"
                       ];
    
    let random = Math.floor(Math.random() * placeholders.length);
    
    customCommandBlock.setAttribute("placeholder", placeholders[random]);
}
placeHoldersOnCustomCommandButton();

playerCoordInput[0].addEventListener("input", makeOutlineThroughInputs);
playerCoordInput[1].addEventListener("input", makeOutlineThroughInputs);
AddGridLayerLowerButton.addEventListener("click", AddLayerLower);
AddGridLayerUpperButton.addEventListener("click", AddLayerUpper);
TakePlayerCoordsButton.addEventListener('click', TakePlayerCoordsFunction);
AddBlockButton.addEventListener('click', AddNewBlock);
confirmButton.addEventListener('click', ConfirmButton); // Кнопка "Подтвердить"
giveCommandButton.addEventListener('click', finalButton); // Финальная кнопка "Получить команду"

function removeDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
}

function finalButton() {
    
    if (EntityInput.value != "") {
        startCommand = `execute at ${EntityInput.value}`;
    }
    
    commandsList = [];

    commandInput.value = "";
    
    allGrids = document.querySelectorAll(".blocksGrid");
    let xr, zr, temp = "";
    let checkAir = document.querySelector("#detectAir").checked;
    
    let lastPartOfCommand = "say Boom!";
    if (customCommandBlock.value != '') {
        lastPartOfCommand = customCommandBlock.value;
    }
    
    playerX = +document.getElementById("detectAirX").value;
    playerZ = +document.getElementById("detectAirZ").value;
    
    for (let count = 0; count < allGrids.length; count++) {
        // absolute coords
        let ItemList = allGrids[count];
        
        for (let i = 0; i < ItemList.length - 1; i++) {
            if ((+ItemList[i].getAttribute("x")==playerX)&&(+ItemList[i].getAttribute("z")==playerZ)) 
            {
                xr = playerX;
                zr = playerZ;
            }
        }
        // установка относительных координат
        for (let k = 0; k < ItemList.length; k++) {
            let currentX = +ItemList[k].getAttribute("x");
            let currentZ = +ItemList[k].getAttribute("z");

            ItemList[k].setAttribute("xr", currentX-xr);
            ItemList[k].setAttribute("zr", currentZ-zr);
        }
    }    
    
    let listOfLayer = [];
    for (let number = 0; number < allGrids.length; number++) {
        console.log(allGrids.length, number, listOfLayer, allGrids[number].getAttribute("layer"));
        let grids = document.querySelectorAll('.blocksGrid');
        listOfLayer.push(+allGrids[number].getAttribute("layer"));
        
        CreateCommand(listOfLayer[number], grids[number].children);
        commandInput.value = startCommand + removeDuplicates(commandsList).join('') + ` run ${lastPartOfCommand}`;
    }
}

function CreateCommand(layer, ItemList) {
    
    console.log(layer);
    
    let grids = document.querySelectorAll('.blocksGrid');
    let countOfGrids = grids.length;

    let xr, zr, temp = "";
    let checkAir = document.querySelector("#detectAir").checked;

    for (let i = 0; i < ItemList.length - 1; i++) {
        if ((+ItemList[i].getAttribute("x")==playerX)&&(+ItemList[i].getAttribute("z")==playerZ)) 
        {
            xr = playerX;
            zr = playerZ;
        }
    }
    // установка относительных координат
    for (let k = 0; k < ItemList.length; k++) {
        let currentX = +ItemList[k].getAttribute("x");
        let currentZ = +ItemList[k].getAttribute("z");

        ItemList[k].setAttribute("xr", currentX-xr);
        ItemList[k].setAttribute("zr", currentZ-zr);
    }

    for (let l = 0; l < ItemList.length-1; l++) {

        let nowX = +ItemList[l].getAttribute("xr");
        let nowZ = +ItemList[l].getAttribute("zr");

        if ((checkAir) && (ItemList[l].style.background=="")) {
            temp = ` if block ~${nowX} ~${layer} ~${nowZ} air`;
            commandsList.push(temp);
            continue;
        }

        if (ItemList[l].style.background=="rgb(138, 5, 32)") {
            temp = ` if block ~${nowX} ~${layer} ~${nowZ} redstone_wire`;
            commandsList.push(temp);
            continue;
        }

        if ((ItemList[l].style.background!="rgb(138, 5, 32)")&&(ItemList[l].style.background!="")) {        
            temp = ` if block ~${nowX} ~${layer} ~${nowZ} ${ItemList[l].getAttribute("block_id")}`;
            commandsList.push(temp);
            continue;
        }
    }
}

function AddLayerLower() {
    lowerCount-=1;
    
    let newGrid = document.createElement("div");
    newGrid.setAttribute("class", "grid blocksGrid");
    newGrid.setAttribute("oncontextmenu", "return false;");
    newGrid.setAttribute("layer", lowerCount);
    newGrid.style.visibility = "visible";
    
    grid.parentElement.prepend(newGrid);
    
    let Itemlist = grid.children;

    newGrid.style.setProperty('grid-template-columns', `repeat(${xx}, 1fr)`);
    newGrid.style.setProperty('grid-template-rows', `repeat(${zz}, 1fr)`);

    for (let i = 0; i < countOfObjects; i++) {
        let item = document.createElement("item");
        newGrid.appendChild(item);

        newGrid.children[i].addEventListener('click', setBlockFunction);
        newGrid.children[i].addEventListener('contextmenu', function() 
                                          {this.style.background = "";});

        newGrid.children[i].setAttribute("x", (i)%(+x.value)+1);
        newGrid.children[i].setAttribute("z", Math.floor((i)/(+x.value)+1));
        newGrid.children[i].setAttribute("index", i);

        newGrid.children[i].innerHTML = `${(i)%(+x.value)+1} ${Math.floor((i)/(+x.value)+1)}`;
    }
    
    let layerText = document.createElement("h1");
    layerText.innerHTML = `Слой №${lowerCount}`;
    layerText.setAttribute("class", "main_text text white");
    layerText.style.position = "absolute";
    layerText.style.left = "calc(50% - 2.5em)";
    layerText.style.top = "calc(100% - var(--mm)/2)";

    newGrid.appendChild(layerText);
}

function AddLayerUpper() {
    upperCount+=1;
    
    let newGrid = document.createElement("div");
    newGrid.setAttribute("class", "grid blocksGrid");
    newGrid.setAttribute("oncontextmenu", "return false;");
    newGrid.setAttribute("layer", upperCount);
    newGrid.style.visibility = "visible";
    
    grid.parentElement.append(newGrid);
    
    let Itemlist = grid.children;

    newGrid.style.setProperty('grid-template-columns', `repeat(${xx}, 1fr)`);
    newGrid.style.setProperty('grid-template-rows', `repeat(${zz}, 1fr)`);

    for (let i = 0; i < countOfObjects; i++) {
        let item = document.createElement("item");
        newGrid.appendChild(item);

        newGrid.children[i].addEventListener('click', setBlockFunction);
        newGrid.children[i].addEventListener('contextmenu', function() 
                                          {this.style.background = "";});

        newGrid.children[i].setAttribute("x", (i)%(+x.value)+1);
        newGrid.children[i].setAttribute("z", Math.floor((i)/(+x.value)+1));
        newGrid.children[i].setAttribute("index", i);

        newGrid.children[i].innerHTML = `${(i)%(+x.value)+1} ${Math.floor((i)/(+x.value)+1)}`;
    }
    
    let layerText = document.createElement("h1");
    layerText.innerHTML = `Слой №${upperCount}`;
    layerText.setAttribute("class", "main_text text white");
    layerText.style.position = "absolute";
    layerText.style.left = "calc(50% - 2.5em)";
    layerText.style.top = "calc(100% - var(--mm)/2)";

    newGrid.appendChild(layerText);
}

function generateColor() {
    let colorScheme = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C'],
            s = '';

        for (let i = 0; i < 6; i++) 
        {
            s = s + colorScheme[Math.floor(Math.random() * 13)];
        }
        return `#${s}`;
}

function ConfirmButton() { // Кнопка "Подтвердить"
    
    TakePlayerCoordsButton.setAttribute("state", "false");
    TakePlayerCoordsButton.style.setProperty("transform","rotate", "0deg");
    
    xx = x.value;
    zz = z.value;
    countOfObjects = xx * zz;
    
    if (countOfObjects != 0) {
        if (xx <= xnzRestrictions || zz <= xnzRestrictions) 
        {
            TakePlayerCoordsButton.style.display = "block";
            setTimeout(function(){
                TakePlayerCoordsButton.style.opacity = 1;
                addLayerButton[0].style.opacity = 1;
                addLayerButton[1].style.opacity = 1;
                coordsPlayerBlock[0].style.opacity = 1;
                coordsPlayerBlock[1].style.opacity = 1;
                grid.style.opacity = 1;
            }, 100);
            addLayerButton[0].style.visibility = "visible";
            addLayerButton[1].style.visibility = "visible";
            coordsPlayerBlock[0].style.visibility = "visible";
            coordsPlayerBlock[1].style.visibility = "visible";
            grid.style.visibility = "visible";
    
            let Itemlist = grid.children,
                xr, zr;

            while(Itemlist.length){
              Itemlist[0].parentNode.removeChild(Itemlist[0]);
            }
            
            grid.style.setProperty('grid-template-columns', `repeat(${xx}, 1fr)`);
            grid.style.setProperty('grid-template-rows', `repeat(${zz}, 1fr)`);

            for (let i = 0; i < countOfObjects; i++) {
                let item = document.createElement("item");
                grid.appendChild(item);

                grid.children[i].addEventListener('click', setBlockFunction);
                grid.children[i].addEventListener('contextmenu', function() 
                                                  {this.style.background = "";});
                
                grid.children[i].setAttribute("x", (i)%(+x.value)+1);
                grid.children[i].setAttribute("z", Math.floor((i)/(+x.value)+1));
                grid.children[i].setAttribute("index", i);

                grid.children[i].innerHTML = `${(i)%(+x.value)+1} ${Math.floor((i)/(+x.value)+1)}`;
            }
            
            for (let i = 0; i < Itemlist.length - 1; i++) {
                if ((+Itemlist[i].getAttribute("x")==playerX)&&(+Itemlist[i].getAttribute("z")==playerZ)) 
                {
                    xr = playerX;
                    zr = playerZ;
                }
            }
            // установка относительных координат
            for (let k = 0; k < Itemlist.length; k++) {
                let currentX = +Itemlist[k].getAttribute("x");
                let currentZ = +Itemlist[k].getAttribute("z");

                Itemlist[k].setAttribute("xr", currentX-xr);
                Itemlist[k].setAttribute("zr", currentZ-zr);
            }
            
            let layerText = document.createElement("h1");
            layerText.innerHTML = `Слой №${0}`;
            layerText.setAttribute("class", "main_text text white");
            layerText.style.position = "absolute";
            layerText.style.left = "calc(50% - 2.5em)";
            layerText.style.top = "calc(100% - var(--mm)/2)";
            
            grid.appendChild(layerText);
            
        }
        if (xx > xnzRestrictions || zz > xnzRestrictions) {
            alert("Значения слишком большие");
            if (x.value > xnzRestrictions) {x.value = xnzRestrictions;}
            if (z.value > xnzRestrictions) {z.value = xnzRestrictions;}
            
            confirmButton();
        }
    } else {alert("Введите значения x и z");}
}

function setBlockFunction() {
    let ItemList = grid.children;
    
    for (let i = 1; i < blockPalleteItems.length; i++) {
        if (blockPalleteItems[i].getAttribute("status")=="yes") {
            if (i==1) { // redstone
                event.currentTarget.style.background = "rgb(138, 5, 32)";
            }
            if (i>1) {
                event.currentTarget.style.background = blockPalleteItems[i].style.background;
                event.currentTarget.setAttribute("block_id", blockPalleteItems[i].children[0].value);
            }
        }
    }
}

function makeOutline() {
    let ItemList = grid.children;
    for(let k = 0; k < ItemList.length; k++) {
        ItemList[k].style.outline = '';
        ItemList[k].style.color = '';
    }
    event.currentTarget.style.outline = "3px solid cyan";
    event.currentTarget.style.color = "cyan";
    let returnX = event.currentTarget.innerHTML[0];
    let returnZ = event.currentTarget.innerHTML[2];

    document.getElementById("detectAirX").value = returnX;
    document.getElementById("detectAirZ").value = returnZ;
}

function makeOutlineThroughInputs() {
    let inputX = +playerCoordInput[0].value;
    let inputZ = +playerCoordInput[1].value;
    
    if ((typeof(+inputX) == "number")&&(typeof(+inputZ) == "number")) {
        let ItemList = grid.children;
        for(let k = 0; k < ItemList.length; k++) {
            ItemList[k].style.outline = '';
            ItemList[k].style.color = '';
            
            if ((ItemList[k].getAttribute("x")==inputX)&&(ItemList[k].getAttribute("z")==inputZ)) {
                ItemList[k].style.outline = '3px solid cyan';
                ItemList[k].style.color = 'cyan';
            }
        }
    }
}

function TakePlayerCoordsFunction() {
    let state = TakePlayerCoordsButton.getAttribute("state");
    if (state=="false") {state=false;} if (state=="true") {state=true;}
    state = !state;
    
    TakePlayerCoordsButton.setAttribute("state", state);
    
    let ItemList = grid.children;
    
    for (let i = 0; i < ItemList.length; i++) {
        if (state) {
            ItemList[i].addEventListener("click", makeOutline, true);
        }
        if (!state) {
            ItemList[i].removeEventListener("click", makeOutline, true);
        }
    }
}

function AddNewBlock() { // Кнопка "Добавить блоки"
    
    function generateRandomPlaceHolders() {
        let listOfPlaceHolders = ["diamond_block",
                                  "dirt",
                                  "stone",
                                  "oak_log",
                                  "oak_planks",
                                  "spruce_planks",
                                  "birch_planks",
                                  "stone_bricks",
                                  "cobblestone",
                                  "sand",
                                  "sandstone",
                                  "short_grass",
                                  "glass",
                                  "iron_bars",
                                  "torch",
                                  "redstone_torch",
                                  "soul_torch",
                                  "candle",
                                  "blue_candle"
                                 ];
        
        return listOfPlaceHolders[Math.floor(Math.random()*listOfPlaceHolders.length)];
    }
    
    inputCount+=1;
    
    let newInputForNewBlock = document.createElement("div");
    let inputInside_newInputForNewBlock = document.createElement("input");
    
    newInputForNewBlock.style.background = generateColor();
    newInputForNewBlock.setAttribute("class", "blockPalleteItem");
    newInputForNewBlock.setAttribute("status", "no");
    
    inputInside_newInputForNewBlock.setAttribute("class", "input smallInput addBlockInput");
    inputInside_newInputForNewBlock.setAttribute("type", "text");
    inputInside_newInputForNewBlock.setAttribute("maxlength", "64");
    inputInside_newInputForNewBlock.setAttribute("name", `input_number_${inputCount}`);
    inputInside_newInputForNewBlock.setAttribute("placeholder", generateRandomPlaceHolders());
    
    
    
    AddBlockButton.parentElement.appendChild(newInputForNewBlock);
    newInputForNewBlock.appendChild(inputInside_newInputForNewBlock);
    
    AddEventsOnButtons();
    
}
