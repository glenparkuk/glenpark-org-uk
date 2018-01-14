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

	this.shippingMatrix = {
		'1': {largeLetter: 2.50, smallParcel: 3.25},
		'2': {largeLetter: 3.80, smallParcel: 7.95},
		'3': {largeLetter: 4.5, smallParcel: 8.95},
		'4': {largeLetter: 6.5, smallParcel: 11}
	}

	this.updateShippingTotal = function():void {
		if(this.shippingRegion == 1 || this.shippingRegion == 2 || this.shippingRegion == 3 || this.shippingRegion == 4) {
			let AOCPaperback:CartItem = this.getItem('AOCPaperback');
			let AOCAudioCD:CartItem = this.getItem('AOCAudioCD');
			let PWPamphlet:CartItem = this.getItem('PWPamphlet');

			if( AOCAudioCD.quantity == 0 && AOCPaperback.quantity == 0 && PWPamphlet.quantity == 0 ) {
				this.shippingTotal = 0;
			} else if ( AOCAudioCD.quantity == 1 && AOCPaperback.quantity == 0 && PWPamphlet.quantity < 6 ) {
				let shippingTotal:number = this.shippingMatrix[this.shippingRegion].largeLetter;
				this.shippingTotal = shippingTotal;
			} else {
				let shippingTotal:number = this.shippingMatrix[this.shippingRegion].smallParcel;
				this.shippingTotal = shippingTotal;	
			}
		} else {
			this.shippingTotal = 0;
		}
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
			let newItem:CartItem = new this.Item(items[i].id, items[i].price);
			this.items[i] = newItem;
			this.addBuynowEventListener(items[i].id);
			this.addQuantityEventListener(items[i].id);
		}
		this.addShippingEventListener();
		//this.addPayNowBtnEventListener();

		this.updateDOMItems();
		this.updateDOMShipping();
		this.updateDOMTotal();
		return true;
	}

	this.Item = function(id: string, price: number) {
		this.id = id;
		this.price = price;
		this.quantity = 0;
		this.total = 0;
	}

	this.getItem = function(itemId:string):CartItem {
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
			let item = this.getItem(itemId);
			item.quantity = quantity;
			this.updateDOMItems();
			this.updateDOMShipping();
			this.updateDOMTotal();
		}.bind(this), false );
	}

	// add event listeners to individual product buy now buttons
	this.addBuynowEventListener = function(itemId: string):void {
		let el:HTMLElement = document.getElementById('buynow' + itemId);
		if(el) {
			el.addEventListener('click', function(e): void {
				let el = e.target;
				let itemId:string = el.id.replace('buynow', ''); // TODO: improve this with data targets in HTML
				let item = this.getItem(itemId);
				item.quantity++;
				
				let quantityEl:HTMLInputElement = (<HTMLInputElement>document.getElementById('quantity' + item.id));
				if(quantityEl) {
					quantityEl.value = item.quantity;
				} else {
					console.log('Error: Item total element not found.')
				}

				//let cartOffset:number = document.getElementById('buyNow').offsetTop;
				//console.log(cartOffset);
				window.scrollTo(0, 2650);
			}.bind(this), false );
		}
	}

	// add event listener to shipping radio buttons
	this.addShippingEventListener = function() {
		let el:HTMLElement = document.getElementById('shippingOptions');
		let shippingArr = el.getElementsByTagName('input');
		
		for(let i:number = 0; i < shippingArr.length; i++) {
			shippingArr[i].addEventListener('change', function(e): void {
				let el:HTMLInputElement = e.target;
				let shippingRegion:number = parseInt(el.value);
				if(this.shippingRegion !== shippingRegion) {
					this.shippingRegion = shippingRegion;
					this.updateDOMShipping();
					this.updateDOMTotal();
				}
			}.bind(this), false );
		}
	}

		

	// add event listener to pay now / submit button
	this.addPayNowBtnEventListener = function() {
		// let el:HTMLElement = document.getElementById('quantity' + itemId);
		// el.addEventListener('input', function(e): void {
		// 	let el = e.target;
		// 	let itemId:string = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
		// 	let quantity:number = parseInt(el.value);
		// 	let item = this.getItem(itemId);
		// 	item.quantity = quantity;
		// 	this.updateDOMShipping();
		// 	this.updateDOMTotal();
		// }.bind(this), false );
	}

	this.updateDOMItems = function():void {
		for(let i = 0; i < this.items.length; i++) {
			// update cart items totals
			let item:CartItem = this.items[i];
			let price:number = item.price;
			let quantity:number = item.quantity;
			let total:number = this.getItemTotal(price, quantity);
			item.total = total;

			// update total
			let el:HTMLElement = document.getElementById('total' + item.id);
			if(el) {
				el.innerHTML = '£' + item.total;
			} else {
				console.log('Error: Item total element not found.')
			}
		}
		this.updateSubtotal();
		let subtotal:number = this.subtotal;
		let subtotalEl:HTMLElement = document.getElementById('totalSubTotal');
		subtotalEl.innerHTML = '£' + subtotal;
	}

	this.updateDOMShipping = function(shippingRegion:number): void {
		this.updateShippingTotal();
		let shippingTotal:number = this.shippingTotal;
		let shippingTotalEl:HTMLElement = document.getElementById('totalShippingTotal');
		shippingTotalEl.innerHTML = '£' + shippingTotal;
	}

	this.updateDOMTotal = function(): void {
		this.updateTotal();
		let total:number = this.total;
		let totalTotalEl:HTMLElement = document.getElementById('totalTotal');
		totalTotalEl.innerHTML = '£' + total;
	}

	this.getItemTotal = function(price: number, quantity: number):number {
		return price * quantity;
	}
}
/*
let i1 = { id:'AOCPaperback', price: 12.5 };
let i2 = { id: 'AOCAudioCD', price: 10 };
let i3 = { id: 'PWPamphlet', price: 2.5 };

let itemArray = [i1,i2,i3];

let cart = new Cart(itemArray);
cart.init();
*/