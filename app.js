// Using api to convert currency

let BaseURL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/";
// this api returns date of last update and exchange rate from provided to all others

let currcodeFrom = "INR";//making default currency code
let currcodeTo = "USD";
let rate = 0;
let inputs = document.querySelectorAll("input");
let url = `${BaseURL}${currcodeFrom.toLowerCase()}.json`;//initial inr to usd


// Making options for select tag
//Note:- We have connected countrylist.js and app.js in index.html therefore in browser we can access countrylist.js from appp.js
let currencys = document.querySelectorAll("select");
for (let select of currencys) {
    for(let currcode in countryObj){
        let option = document.createElement("option");
        option.value = currcode;
        option.innerText = currcode;
        select.append(option);

        //Setting default value of select tags
        if(currcode == "INR" && select.id == "from"){
            option.selected = true;
        }
        else  if(currcode == "USD" && select.id == "to"){
            option.selected = true;
        }
    }

    //Adding event listener to select tags to update the flag and currency code
    select.addEventListener("change",(e)=>{
        updateFlag(e.target);// .target gives the element on which event is triggered
        
        // changing currency code on select change
        if(select.id == "from"){
            currcodeFrom = e.target.value;
        }
        else if(select.id == "to"){
            currcodeTo = e.target.value;
        }
        // changing exchange rate on select change
        url = `${BaseURL}${currcodeFrom.toLowerCase()}.json`;
        (async ()=>{
            let response = await fetch(url);
            let data = await response.json();
            rate = data[currcodeFrom.toLowerCase()][currcodeTo.toLowerCase()];
            inputs[0].value = 1;
            inputs[1].value = (inputs[0].value*rate).toFixed(2);
        })();
    });
}

//Updating flag images
function updateFlag(element){
    let currcode = element.value;
    let cuntrycode = countryObj[currcode];
    let flafurl = `https://flagsapi.com/${cuntrycode}/flat/64.png`;
    //NOW to update the flag image we need to get the image tag
    //here we have to get the image tag of the parent element of the select tag ie .currencyto or .currencyfrom
    let parent = element.parentElement;
    let img = parent.querySelector("img");
    img.src=flafurl;
}



//Getting Default exchange rate from api if select is not changed
(async ()=>{
    let response = await fetch(url);
    let data = await response.json();
    rate = data[currcodeFrom.toLowerCase()][currcodeTo.toLowerCase()];
    // console.log(rate);
    inputs[0].value = 1;
    inputs[1].value = (inputs[0].value*rate).toFixed(2);
})();


//checking which operator to use in case of value change
let op = "";
inputs[0].addEventListener("input",(e)=>{
    op = "multiply";
    inputs[1].value = "";
    });
inputs[1].addEventListener("input",(e)=>{
    op = "divide";
    inputs[0].value = "";
    });

    
    
//Adding button functions
let btn = document.querySelectorAll("button");
    
for(let button of btn){
    
    button.addEventListener("click",async (e)=>{
        e.preventDefault();//to prevent the default behaviour of the event ie to reload the page
        if(button.id == "convert"){
            // console.log("convert");
            // exluding the negative values and empty values
            for(let input of inputs){
                if(input.value == "" || input.value <0){  
                    input.value = 1;
                }
            }
            
            //calculating upto 2 decimal places
            if (op == "multiply") {
                inputs[1].value = (inputs[0].value * rate).toFixed(2);
            }
            else if (op == "divide") {
                inputs[0].value = (inputs[1].value / rate).toFixed(2);
            }
        }
        else if(button.id == "reset"){
            // console.log("reset");
            //Resetting the input fields
            inputs = document.querySelectorAll("input");
            inputs[0].value = 1;
            inputs[1].value = (inputs[0].value*rate).toFixed(2);
        }
    });   
}
//Doing same as convert button when enter key is pressed
for(let input of inputs){
    input.addEventListener("keypress",(e)=>{
        if(e.key == "Enter"){
            e.preventDefault(); //to prevent the default behaviour of the event ie to add a new line
            // exluding the negative values and empty values
            for(let input of inputs){
                if(input.value == "" || input.value <0){  
                    input.value = 1;
                }
            }
            
            //calculating upto 2 decimal places
            if (op == "multiply") {
                inputs[1].value = (inputs[0].value * rate).toFixed(2);
            }
            else if (op == "divide") {
                inputs[0].value = (inputs[1].value / rate).toFixed(2);
            }
        }
    });
}
