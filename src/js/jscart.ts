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
	this.shippingRegion = null;
	this.shippingTotal = 0;
	this.subtotal = 0;
	this.total = 0;

	this.updateShippingTotal = function():void {
		this.region1 = 2.50;
		this.region2 = 5;
		this.region3 = 7.5;
		this.region3 = 10;
	}

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
			//this.addProductBtnEventListener(items[i].id);
			this.addQuantityEventListener(items[i].id);
		}
		//this.addShippingEventListener();
		//this.addPayNowBtnEventListener();

		this.updateCartItems();
		this.updateCartShipping();
		this.updateCartTotal();
		this.addShippingEventListener()
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
			let quantity:number = parseInt(el.value) || 0;
			let item = this.getCartItem(itemId);
			item.quantity = quantity;
			this.updateCartItems();
			this.updateCartShipping();
			this.updateCartTotal();
		}.bind(this), false );
	}

	// add event listeners to individual product buy now buttons
	this.addProductBtnEventListener = function(itemId: string) {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getCartItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateCartShipping();
		// 	this.updateCartTotal();
		// }.bind(this), false );
	}

	// add event listener to shipping radio buttons
	this.addShippingEventListener = function() {
		// get shipping region

		let el:HTMLElement = document.getElementById('shippingOptions');
		let shippingArr = el.getElementsByTagName('input');
		
		for(let i:number = 0; i < shippingArr.length; i++) {
			shippingArr[i].addEventListener('change', function(e): void {
				let item = e.target;
				// if (item.value = 'region1') {
				// 	console.log('region1');
				// 	this.shippingRegion = 5;
				// } else if(item.value = 'region2'){
				// 	console.log('region2');
				// 	this.shippingRegion = 10;
				// } else if(item.value = 'region3'){
				// 	console.log('region3');
				// 	this.shippingRegion = 15;
				// } else if(item.value = 'region4'){
				// 	console.log('region4');
				// 	this.shippingRegion = 20;
				// }			

				// return shippingRegion = this.shippingRegion;

			}.bind(this), false );
		}

		this.updateCartShipping();
		this.updateCartTotal();
	}

		

	// add event listener to pay now / submit button
	this.addPayNowBtnEventListener = function() {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getCartItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateCartShipping();
		// 	this.updateCartTotal();
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

	this.updateCartShipping = function(shippingRegion:number): void {
		this.updateShippingTotal();
		let shippingTotal:number = this.shippingTotal;
		let shippingTotalEl:HTMLElement = document.getElementById('totalShippingTotal');
		shippingTotalEl.innerHTML = '£' + shippingTotal;
	}

	this.updateCartTotal = function(): void {
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