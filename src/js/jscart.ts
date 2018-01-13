interface CartItemInput {
	id: string,
	price: number
}
interface CartItem {
	id: string,
	price: number,
	quantity: number,
	total: number
}

function Cart(items: Array<CartItemInput>): void {

	this.items = [];
	this.shippingTotal = 0;
	this.subtotal = 0;
	this.total = 0;

	this.updateSubtotal = function():void {
		let subtotal:number = 0;
		for(let i:number = 0; i < this.items.length; i++) {
			subtotal += this.items[i].total;
		}
		this.subtotal = subtotal;
	}
	this.updateTotal = function():void {
		this.total = this.shippingTotal + this.subtotal;
	}

	this.init = function(): boolean {
		if(items.length < 1) {
			return false;
		}

		for(let i:number = 0; i < items.length; i++) {
			let newItem: CartItem = new this.Item(items[i].id, items[i].price);
			this.items[i] = newItem;
			this.addQuantityEventListener(items[i].id);
		}

		this.updateCartItems();
		this.updateCartShippingEl();
		this.updateCartTotalEl();
		return true;
	}

	this.Item = function(id: string, price: number) {
		this.id = id;
		this.price = price;
		this.quantity = 0;
		this.total = 0;
	}

	this.getCartItem = function(itemId:string):CartItem {
		for(let i:number = 0; i < this.items.length; i++) {
			if (this.items[i].id === itemId) {
				return this.items[i];
			}
		}
	}

	this.addQuantityEventListener = function(itemId: string) {
		let el:HTMLElement = document.getElementById('quantity' + itemId);
		el.addEventListener('input', function(e): void {
			let el = e.target;
			let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
			let quantity:number = parseInt(el.value);
			let item = this.getCartItem(itemId);
			item.quantity = quantity;
			this.updateCartItems();
			this.updateCartTotalEl();
		}.bind(this), false );
	}

	// add event listeners to individual product buy now buttons
	this.addBuyNowEventListener = function(itemId: string) {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getCartItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateCartShippingEl();
		// 	this.updateCartTotalEl();
		// }.bind(this), false );
	}

	// add event listener to shipping radio buttons
	this.addShippingEventListener = function() {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getCartItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateCartShippingEl();
		// 	this.updateCartTotalEl();
		// }.bind(this), false );
	}

	// add event listener to pay now / submit button
	this.addPayNowEventListener = function() {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getCartItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateCartShippingEl();
		// 	this.updateCartTotalEl();
		// }.bind(this), false );
	}

	this.updateCartItems = function():void {
		for(let i = 0; i < this.items.length; i++) {
			// update cart items totals
			let price:number = this.items[i].price;
			let quantity:number = this.items[i].quantity;
			let total:number = this.getItemTotal(price, quantity);
			this.items[i].total = total;

			this.updateCartItemTotalEl(this.items[i]);
		}
		this.updateSubtotal();
		let subtotal:number = this.subtotal;
		let subtotalEl:HTMLElement = document.getElementById('totalSubTotal');
		subtotalEl.innerHTML = '£' + subtotal;
	}

	this.updateCartShippingEl = function(): void {
		let shippingTotal:number = this.shippingTotal;
		let shippingTotalEl:HTMLElement = document.getElementById('totalShippingTotal');
		shippingTotalEl.innerHTML = '£' + shippingTotal;
	}

	this.updateCartTotalEl = function(): void {
		this.updateTotal();
		let total:number = this.total;
		let totalTotalEl:HTMLElement = document.getElementById('totalTotal');
		totalTotalEl.innerHTML = '£' + total;
	}

	this.getItemTotal = function(price: number, quantity: number):number {
		return price * quantity;
	}

	this.updateCartItemTotalEl = function(item: CartItem):boolean {
		let el:HTMLElement = document.getElementById('total' + item.id);
		if(!el) {
			return false;
		}
		el.innerHTML = '£' + item.total;
		return true;
	}
}

let i1 = { id:'AOCPaperback', price: 12.5 };
let i2 = { id: 'AOCAudioCD', price: 10 };
let i3 = { id: 'PWPamphlet', price: 2.5 };

let itemArray = [i1,i2,i3];

let cart = new Cart(itemArray);
cart.init();