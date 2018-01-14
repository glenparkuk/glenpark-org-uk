function Cart(items) {
    this.items = [];
    this.shippingRegion = null;
    this.shippingTotal = 0;
    this.subtotal = 0;
    this.total = 0;
    this.shippingMatrix = {
        '1': { largeLetter: 2.52,
            smallParcel1000: 3.50,
            smallParcel2000: 5.50 },
        '2': { largeLetter: 3.80,
            smallParcel250: 4.10,
            smallParcel500: 5.80,
            smallParcel750: 7.20,
            smallParcel1000: 8.60,
            smallParcel1250: 9.85,
            smallParcel1500: 11.10,
            smallParcel1750: 12.30,
            smallParcel2000: 13.45 },
        '3': { largeLetter: 4.75,
            smallParcel250: 5.15,
            smallParcel500: 8.05,
            smallParcel750: 10.70,
            smallParcel1000: 13.30,
            smallParcel1250: 14.90,
            smallParcel1500: 16.50,
            smallParcel1750: 18.10,
            smallParcel2000: 19.65 },
        '4': { largeLetter: 5.05,
            smallParcel250: 5.60,
            smallParcel500: 8.70,
            smallParcel750: 11.40,
            smallParcel1000: 14.05,
            smallParcel1250: 15.85,
            smallParcel1500: 17.75,
            smallParcel1750: 19.60,
            smallParcel2000: 21.40 }
    };
    this.updateShippingTotal = function () {
        if (this.shippingRegion == 1 || this.shippingRegion == 2 || this.shippingRegion == 3 || this.shippingRegion == 4) {
            var AOCPaperback = this.getItem('AOCPaperback');
            var AOCAudioCD = this.getItem('AOCAudioCD');
            var PWPamphlet = this.getItem('PWPamphlet');
            if (AOCAudioCD.quantity == 0 && AOCPaperback.quantity == 0 && PWPamphlet.quantity == 0) {
                this.shippingTotal = 0;
            }
            else if (AOCAudioCD.quantity == 1 && AOCPaperback.quantity == 0 && PWPamphlet.quantity < 6) {
                var shippingTotal = this.shippingMatrix[this.shippingRegion].largeLetter;
                this.shippingTotal = shippingTotal;
            }
            else {
                // if (this.totalWeight > 250) {
                // 	var parcelWeight = 500;
                // } else if (this.totalWeight > 500) {
                // 	var parcelWeight = 750;
                // }
                var shippingTotal = this.shippingMatrix[this.shippingRegion].smallParcel + parcelWeight;
                this.shippingTotal = shippingTotal;
            }
        }
        else {
            this.shippingTotal = 0;
        }
    };
    this.updateSubtotal = function () {
        var subtotal = 0;
        for (var i = 0; i < this.items.length; i++) {
            subtotal += this.items[i].total;
        }
        this.subtotal = subtotal;
    };
    this.updateTotal = function () {
        this.total = this.shippingTotal + this.subtotal;
    };
    this.init = function () {
        if (items.length < 1) {
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            var newItem = new this.Item(items[i].id, items[i].price);
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
    };
    this.Item = function (id, price, weight) {
        this.id = id;
        this.price = price;
        this.weight = weight;
        this.quantity = 0;
        this.totalWeight = 0;
        this.total = 0;
    };
    this.getItem = function (itemId) {
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id === itemId) {
                return this.items[i];
            }
        }
    };
    this.addQuantityEventListener = function (itemId) {
        var el = document.getElementById('quantity' + itemId);
        el.addEventListener('input', function (e) {
            var el = e.target;
            var itemId = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
            var quantity = parseInt(el.value) || 0;
            var item = this.getItem(itemId);
            item.quantity = quantity;
            this.updateDOMItems();
            this.updateDOMShipping();
            this.updateDOMTotal();
        }.bind(this), false);
    };
    // add event listeners to individual product buy now buttons
    this.addBuynowEventListener = function (itemId) {
        var el = document.getElementById('buynow' + itemId);
        if (el) {
            el.addEventListener('click', function (e) {
                var el = e.target;
                var itemId = el.id.replace('buynow', ''); // TODO: improve this with data targets in HTML
                var item = this.getItem(itemId);
                item.quantity++;
                var quantityEl = document.getElementById('quantity' + item.id);
                if (quantityEl) {
                    quantityEl.value = item.quantity;
                }
                else {
                    console.log('Error: Item total element not found.');
                }
                //let cartOffset:number = document.getElementById('buyNow').offsetTop;
                //console.log(cartOffset);
                window.scrollTo(0, 2650);
            }.bind(this), false);
        }
    };
    // add event listener to shipping radio buttons
    this.addShippingEventListener = function () {
        var el = document.getElementById('shippingOptions');
        var shippingArr = el.getElementsByTagName('input');
        for (var i = 0; i < shippingArr.length; i++) {
            shippingArr[i].addEventListener('change', function (e) {
                var el = e.target;
                var shippingRegion = parseInt(el.value);
                if (this.shippingRegion !== shippingRegion) {
                    this.shippingRegion = shippingRegion;
                    this.updateDOMShipping();
                    this.updateDOMTotal();
                }
            }.bind(this), false);
        }
    };
    // add event listener to pay now / submit button
    this.addPayNowBtnEventListener = function () {
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
    };
    this.updateDOMItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            // update cart items totals
            var item = this.items[i];
            var price = item.price;
            var quantity = item.quantity;
            var total = this.getItemTotal(price, quantity);
            item.total = total;
            // update total
            var el = document.getElementById('total' + item.id);
            if (el) {
                el.innerHTML = '£' + item.total;
            }
            else {
                console.log('Error: Item total element not found.');
            }
        }
        this.updateSubtotal();
        var subtotal = this.subtotal;
        var subtotalEl = document.getElementById('totalSubTotal');
        subtotalEl.innerHTML = '£' + subtotal;
    };
    this.updateDOMShipping = function (shippingRegion) {
        this.updateShippingTotal();
        var shippingTotal = this.shippingTotal;
        var shippingTotalEl = document.getElementById('totalShippingTotal');
        shippingTotalEl.innerHTML = '£' + shippingTotal;
    };
    this.updateDOMTotal = function () {
        this.updateTotal();
        var total = this.total;
        var totalTotalEl = document.getElementById('totalTotal');
        totalTotalEl.innerHTML = '£' + total;
    };
    this.getItemTotal = function (price, quantity) {
        return price * quantity;
    };
}
/*
let i1 = { id:'AOCPaperback', price: 12.5 };
let i2 = { id: 'AOCAudioCD', price: 10 };
let i3 = { id: 'PWPamphlet', price: 2.5 };

let itemArray = [i1,i2,i3];

let cart = new Cart(itemArray);
cart.init();
*/ 
