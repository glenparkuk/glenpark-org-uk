interface Item {
	itemId: string
	price: number
}

function Cart(Item[]: items) {
	this.init = function() {
		for(let i = 0; i < items.length-1; i++) {
			this['price' + items[i].itemId] = items[i].price
		}
	}

	// this.priceAOCPaperback: 12.5,
	// this.priceAOCCD: 10,
	// this.pricePWPamphlet: 2.5,

	this.quantityAOCPaperback: number,
	this.quantityAOCCD: number,
	this.quantityPWPamphlet: number,
	
	this.totalAOCPaperback: number,
	this.totalAOCCD: number,
	this.totalPWPamphlet: number,

	this.getItemQuantity = function(string: itemId) {
		q = document.getElementById(itemId).value;
		return q;
	}
	
	this.getItemTotal = function(number: itemPrice, number: itemQuantity) {
		return itemPrice * itemQuantity;
	}
	
	this.updateCart = function() {
		
	}

	this.addQuantityEventListener = function(string: itemId) {
		el = document.getElementById(itemId)
		el.addEventListener('change', function(string: itemId) {
			this['quantity' + itemId] = this.getItemQuantity(itemId);
			this['total' + itemId] = getItemTotal(this['price' + itemId], this['quantity' + itemId]);
			this.updateCart();
		});
	}
}

let AOCPaperback = new Item('AOCPaperback', 12.5);
let AOCCD = new Item('AOCCD', 10);
let PWPamphlet = new Item('PWPamphlet', 2.5);

let itemArray = [AOCPaperback, AOCCD, PWPamphlet];

let cart = new Cart(itemArray);
cart.init();