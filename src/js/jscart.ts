interface Item {
	id: string,
	price: number,
	quantity: number,
	total: number
}

function Cart(items: Array<Item>): void {

	this.items = {};

	this.init = function() {
		if(items.length < 1) {
			return false;
		}

		for(let i = 0; i < items.length; i++) {
			this.items[items[i].id] = items[i];
			this.addQuantityEventListener(items[i].id);
		}

		this.updateCart();
	}

	this.getItemQuantity = function(itemId: string) {
		let q = (<HTMLInputElement>document.getElementById('quantity' + itemId)).value;
		return q;
	}
	
	this.getItemTotal = function(price: number, quantity: number) {
		return price * quantity;
	}
	
	this.updateCart = function() {
		let subtotal = 0;
		let subtotalElement = document.getElementById('totalSubTotal');
		for(let i = 0; i < this.items.length-1; i++) {
			this.updateItemTotalElement(this.items[i].id);
			subtotal += this.items[i].total;
		}
		subtotalElement.innerHTML = '£' + subtotal;
	}

	this.updateItemTotalElement = function(itemId: string) {
		let el = document.getElementById('total' + itemId);
		el.innerHTML = '£' + this.items[itemId].total;
	}

	this.addQuantityEventListener = function(itemId: string) {
		let el = document.getElementById('quantity' + itemId);
		el.addEventListener('input', this.onQuantityUpdateEvent ); // TODO: use event object - this.onQuantityUpdate(e)
	}
	this.onQuantityUpdateEvent = function(e: any) {
		let el = e.target;
		let itemId = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		cart.onQuantityUpdate(itemId); // TODO: I don't like this - I should be able to use this.onQuantityUpdate(itemId)
	}
	this.onQuantityUpdate = function(itemId: string) {
		console.log("onQuantityUpdate");
		let item = this.items[itemId];
		item.quantity = this.getItemQuantity(itemId);
		item.total = this.getItemTotal(item.price, item.quantity);
		this.updateCart();
	}
}

let AOCPaperback = { id:'AOCPaperback', price: 12.5, quantity: 0, total: 0 };
let AOCCD = { id: 'AOCAudioCD', price: 10, quantity: 0, total: 0 };
let PWPamphlet = { id: 'PWPamphlet', price: 2.5, quantity: 0, total: 0 };

let itemArray = [AOCPaperback, AOCCD, PWPamphlet];

let cart = new Cart(itemArray);
cart.init();