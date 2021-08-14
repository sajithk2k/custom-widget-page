const axios = require('axios');
var slots;
//started edit here
axios.get('https://flipkart-page-api.now.sh')
  .then(function (response) {
    // handle success
    getData(response.data);
    // console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

  function getData(d){
      let widgets=[];
      slots= d;
      getAllWidgets(widgets,d,"100%");
      for(let i=0;i<widgets.length;i++){
        console.log(widgets[i]);
      }
      loadwidgets(widgets);
  }

  //decompose slots into widgets
  function loadwidgets(widgets){
    document.getElementById("widget-div").innerHTML="";
      for(let i=0;i<widgets.length;i++){
          let c = widgets[i].imageCount;
          let div = document.createElement("div");
          div.style.width =  widgets[i].grow;
          div.style.height = "200px";
          div.style.display = "flex";
          div.style.flexGrow ="1";
          div.style.paddingTop="20px";
          div.style.justifyContent = "space-between"
          for(let j=0;j<c;j++){
            let img = document.createElement("img");
            img.src = widgets[i].assets[j].imageUrl;
            img.style.margin="0 10px";
            img.style.height = "200px";
            img.style.flexGrow = "1";
            img.classList.add("widget-img");
            div.append(img);
          }
          document.getElementById('widget-div').append(div);
      }
      
      var imgs = document.getElementsByClassName("widget-img");
    
      for (let i = 0; i < imgs.length; i++) {
        (function(index) {
             imgs[index].addEventListener("click", function() {
                imgs[index].classList.toggle("imgborder");
                if(imgs[index].classList.contains("imgborder"))localStorage.setItem(index+"",index+"");
                else localStorage.removeItem(index+"");
              })
        })(i);
     }
    for (let i = 0; i < localStorage.length; i++){
      let imgno = Number(localStorage.getItem(localStorage.key(i)));
      imgs[imgno].classList.add("imgborder");
  }
  }
  function checkIfContainer(container){
    return container.hasOwnProperty('children');
  }

  function getAllWidgets(widgets,slots,parentGrow){
      for(let i=0;i<slots.length;i++){
          let temp = slots[i].grow;
          temp = Number(temp.slice(0,-1));
          temp = (temp/100) * Number(parentGrow.slice(0,-1)) +" ";
          slots[i].grow = temp;
          if(checkIfContainer(slots[i]))getAllWidgets(widgets,slots[i].children,slots[i].grow);
          else {
            widgets.push(slots[i]);
          }
      }
  }
//search widgets by pincode
//  function searchWidgets(pincode){
//     console.log(pincode);
//     console.log(currwidgets);
//       var results = [];
//       for(let i = 0;i<currwidgets.length;i++){
//         if(currwidgets[i].hasOwnProperty('serviceablePincodes')){ 
//           if(currwidgets[i].serviceablePincodes.includes(pincode)){
//             results.push(currwidgets[i]);
//           }
//         }
//         else{
//           results.push(currwidgets[i]);
//         }
//       }
//       console.log(results);
//       loadwidgets(results);
//  }
function checkForPincode(pincode,w){
  if(!w.hasOwnProperty("serviceablePincodes"))return true;
  else if(w.serviceablePincodes.includes(pincode))return true;
  else return false;
}

function searchWidgets(pincode,container,results){
  console.log("called search");
  console.log(container);
  let children = container.children;
  console.log(children);
  let temp = [],flag = true;
  for(let i=0;i<children.length;i++){
    if(checkIfContainer(children[i]))searchWidgets(pincode,children[i],results);
    else{
      if(!checkForPincode(pincode,children[i]))flag = false;
      temp.push(children[i]);
    }
    }
    if(flag){
      for(let i=0;i<temp.length;i++){
        results.push(temp[i]);
      }
  }
}

  var pcbox = document.getElementById("pincode-box");
  pcbox.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.code === "Enter") {
      var results = [];
      console.log("Enter pressed");
      var pincode = event.currentTarget.value;
      console.log(results);
    for(let i=0;i<slots.length;i++){
      if(!checkIfContainer(slots[i])){
        console.log("Slot: "+ i +"is a Widget");
        if(checkForPincode(pincode,slots[i]))results.push(slots[i]);
        console.log(results);
      }
      else searchWidgets(pincode,slots[i],results);
      console.log("Slot: "+ i);
      console.log(results);
    }
     loadwidgets(results);
    }
  });









