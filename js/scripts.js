var obj = JSON.parse(foodMenu);
var food = obj.food;
var currentTable;

window.onload = function loadMenu(){
	var txt="";
	for(var index=0; index<food.length; index++){
		var name = food[index].name;
		var price = food[index].price;
		var id = "food" + food[index].id;
		txt+='<div id="' + id + '" class="item" draggable="true" ondragstart="drag(event)"><h5>' + name + '</h5>Rs. ' + price +  '</div>';
	}
	document.getElementById('items').innerHTML = txt;
}

var orderTracker=new Map();
for(var i=1;i<=5;i++){
	orderTracker.set("table" + i , new Map());
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
  	var count=0;
  	var currentTable = ev.target.id;
  	var thisTable = orderTracker.get(ev.target.id);

  	if(thisTable.has(data)){
  		count = thisTable.get(data);
  	}
  	count++;
  	thisTable.set(data,count);
  	setCount(currentTable);
}

function setCount(currentTable){
	var numberOfOrders=0;
	  	var thisTable = orderTracker.get(currentTable);
	thisTable.forEach(function(value, key) {
		numberOfOrders+=parseInt(value);
	});
  	var tableId = "orderCount"+currentTable[5];
  	document.getElementById(tableId).innerHTML= 'Total Order Count : ' + numberOfOrders;
}

function generateBill(tabId){
	var thisTable = orderTracker.get(tabId);
	var total=0;
	var text="";
	thisTable.forEach(function(value, key) {
		var foodId = key[4];
		var bill = food[foodId].price*value;
		text+='<div id="itemName' + foodId + '" class="col-sm-4">' + food[foodId].name + '</div>';
		text+='<div id="itemQuantity' + foodId + '" class="col-sm-3" contenteditable="true">' + value + '</div>';
		text+='<div id="itemTotal' + foodId + '" class="col-sm-3">' + bill + '</div>';
		text+='<div id="delImg' + foodId +'"class="col-sm-2"><img id="del' + foodId + '"src="images/delete.png" height="20px" onclick="removeItem(id)"></div>';
		total+=bill;
	});

	document.getElementById('bill').innerHTML=text;
	document.getElementById('totalAmount').innerHTML=total;

	$('#getBill').modal('show');
	currentTable=tabId;
}

function updateOrder(){
	var thisTable = orderTracker.get(currentTable);
	var element;
	var count;
	var total = 0;
	var numberOfOrders=0;
	thisTable.forEach(function(value, key) {
		element = document.getElementById("itemQuantity" + key[4]);
		count = element.innerHTML;
		thisTable.set(key,count);
		var foodId = key[4];
		var bill = food[foodId].price*count;
		total+=bill;
	});

	document.getElementById('totalAmount').innerHTML=total;
  	setCount(currentTable);
	$("#getBill").modal('hide');

}

function removeItem(id){
	var thisTable = orderTracker.get(currentTable);
	var key = "food" + id[3];
	thisTable.delete(key);
	setCount(currentTable);

	document.getElementById("itemName" + id[3]).style.display="none";
	document.getElementById("itemQuantity" + id[3]).style.display="none";
	document.getElementById("itemTotal" + id[3]).style.display="none";
	document.getElementById("delImg" + id[3]).style.display="none";

	var total=0;
	thisTable.forEach(function(value, key) {
		element = document.getElementById("itemQuantity" + key[4]);
		count = element.innerHTML;
		thisTable.set(key,count);
		var foodId = key[4];
		var bill = parseInt(food[foodId].price)*parseInt(count);
		total+=bill;
	});

	document.getElementById('totalAmount').innerHTML=total;
}


function closeSession(){
	var clearTable = orderTracker.get(currentTable);
	clearTable.clear();
	$("#getBill").modal('hide');
	var orderCount = 'orderCount' + currentTable[5];
  	document.getElementById(orderCount).innerHTML= '';
}

function searchTable() {
    var input, filter, tableAll, text, i;
    input = document.getElementById("searchTable");
    filter = input.value.toLowerCase();
    tableAll = document.getElementById("tableAll");
    text = tableAll.getElementsByTagName("h6");
    for (i = 1; i <= text.length; i++) {
    	console.log(text[i-1]);
        if (text[i-1].innerHTML.toLowerCase().indexOf(filter) == -1) {
            document.getElementById("table" + i ).style.display = "none";
        } else {
            document.getElementById("table" + i ).style.display = "";
        }
    }
}

function searchMenu() {
    var input, filter, menuAll, text, i;
    input = document.getElementById("searchMenu");
    filter = input.value.toUpperCase();
    menuAll = document.getElementById("items");
    text = menuAll.getElementsByTagName("h5");
    for (i = 0; i < text.length; i++) {
        if (text[i].innerHTML.toUpperCase().indexOf(filter) > -1 || food[i].type.toUpperCase().indexOf(filter) > -1) {
            document.getElementById("food" + i ).style.display = "";
        } else {
            document.getElementById("food" + i ).style.display = "none";
        }
    }
}
