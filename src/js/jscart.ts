interface CartItemInput {
	id: string,
	name: string,
	description: string,
	price: number,
	weight: number
}
interface CartItem {
	id: string,
	name: string,
	description: string,
	price: number,
	quantity: number,
	weight: number,
	total: number
}

function Cart(items: Array<CartItemInput>): void {

	this.items = [];
	this.shippingRegion = null;
	this.shippingTotal = 0;
	this.subtotal = 0;
	this.total = 0;

	this.largeLetterPrices = {
		'region1': 2.52,
		'region2': 3.80,
		'region3': 4.75,
		'region4': 5.05,
	}
	this.smallParcelWeightMatrix = {
		'region1': {'1000': 3.50, '2000': 5.50,},
		'region2': {'250': 4.10, '500': 5.80, '750': 7.20, '1000': 8.60, '1250': 9.85, '1500': 11.10, '1750': 12.30, '2000': 13.45, },
		'region3': {'250': 5.15, '500': 8.05, '750': 10.70, '1000': 13.30, '1250': 14.90, '1500': 16.50, '1750': 18.10, '2000': 19.65, },
		'region4': {'250': 5.60, '500': 8.70, '750': 11.40, '1000': 14.05, '1250': 15.85, '1500': 17.75, '1750': 19.60, '2000': 21.40, }
	}

	this.getWeightBracket = function(totalWeight:number, weightBrackets:number[]):number | boolean {
		//console.log(weightBrackets);
		if(weightBrackets.length < 2) {
			return false
		}
		let mid:number = Math.ceil(weightBrackets.length/2);
		if(totalWeight === weightBrackets[mid]) return weightBrackets[mid];
		if(weightBrackets.length === 2) {
			if(totalWeight > weightBrackets[0] && totalWeight < weightBrackets[1]){
				return weightBrackets[mid];
			}
		}
		if(totalWeight < weightBrackets[mid]) {
			if(totalWeight > weightBrackets[mid-1]){
				return weightBrackets[mid];
			}
			let leftHalf:number[] = weightBrackets.slice(0, mid); // Check this logic
			return this.getWeightBracket(totalWeight, leftHalf)
		} else if(totalWeight > weightBrackets[mid]) {
			let rightHalf:number[] = weightBrackets.slice(mid, weightBrackets.length); // Check this logic
			return this.getWeightBracket(totalWeight, rightHalf);
		}
		return false;
	}
	
	this.updateShippingTotal = function():void {
		if(this.shippingRegion == 1 || this.shippingRegion == 2 || this.shippingRegion == 3 || this.shippingRegion == 4) {
			let AOCPaperback:CartItem = this.getItem('AOCPaperback');
			let AOCAudioCD:CartItem = this.getItem('AOCAudioCD');
			let PWPamphlet:CartItem = this.getItem('PWPamphlet');

			if( AOCAudioCD.quantity < 1 && AOCPaperback.quantity < 1 && PWPamphlet.quantity < 1 ) {
				// Sanity check
				this.shippingTotal = 0;
			} else if ( AOCAudioCD.quantity == 1 && AOCPaperback.quantity == 0 && PWPamphlet.quantity < 6 ) {
				// Custom: if only 1 CD user large letter prices
				let shippingTotal:number = this.largeLetterPrices['region' + this.shippingRegion]
				this.shippingTotal = shippingTotal;
			} else {
				// Find small parcel weight
				let weightBrackets:number[] = this.smallParcelWeights['region'+this.shippingRegion];
				let weightBracket = this.getWeightBracket(this.totalWeight, weightBrackets);
				this.shippingTotal = this.smallParcelWeightMatrix['region'+this.shippingRegion][weightBracket];
			}
		} else {
			this.shippingTotal = 0;
		}
	}
	this.updateTotalWeight = function():void {
		let totalWeight:number = 0;
		for(let i:number = 0; i < this.items.length; i++) {
			let item:CartItem = this.items[i];
			let itemTotalWeight:number = item.quantity * item.weight;
			totalWeight += itemTotalWeight;
		}
		this.totalWeight = totalWeight;
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
		this.smallParcelWeights = this.initialiseWeightArrays(this.smallParcelWeightMatrix);

		for(let i:number = 0; i < items.length; i++) {
			let newItem:CartItem = new this.Item(items[i].id, items[i].name, items[i].description, items[i].price, items[i].weight);
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

	this.Item = function(id:string, name:string, description:string, price:number, weight:number) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.weight = weight;
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
				el.innerHTML = '£' + item.total.toFixed(2);
			} else {
				console.log('Error: Item total element not found.')
			}
		}
		this.updateTotalWeight();
		this.updateSubtotal();
		let subtotal:number = this.subtotal;
		let subtotalEl:HTMLElement = document.getElementById('totalSubTotal');
		subtotalEl.innerHTML = '£' + subtotal.toFixed(2);
	}

	this.updateDOMShipping = function(shippingRegion:number): void {
		this.updateShippingTotal();
		let shippingTotal:number = this.shippingTotal;
		let shippingTotalEl:HTMLElement = document.getElementById('totalShippingTotal');
		shippingTotalEl.innerHTML = '£' + shippingTotal.toFixed(2);
	}

	this.updateDOMTotal = function(): void {
		this.updateTotal();
		let total:number = this.total;
		let totalTotalEl:HTMLElement = document.getElementById('totalTotal');
		totalTotalEl.innerHTML = '£' + total.toFixed(2);
	}

	this.getItemTotal = function(price: number, quantity: number):number {
		return price * quantity;
	}

	this.initialiseWeightArrays = function(weightMatrix:object):object {
		let weightArrays:object = {}
		for(let regionProperty in weightMatrix) {
			let weightArray:number[] = [0];
			for( let weightProperty in weightMatrix[regionProperty] ) {
				weightArray.push(parseInt(weightProperty))
			}
			weightArrays[regionProperty] = weightArray.sort(function(a, b){return a - b});;
		}
		return weightArrays;
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