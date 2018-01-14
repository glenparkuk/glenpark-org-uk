function Cart(items) {
    this.items = [];
    this.shippingRegion = null;
    this.shippingTotal = 0;
    this.subtotal = 0;
    this.total = 0;
    this.updateShippingTotal = function () {
        this.region1 = 2.50;
        this.region2 = 5;
        this.region3 = 7.5;
        this.region3 = 10;
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
            //this.addProductBtnEventListener(items[i].id);
            this.addQuantityEventListener(items[i].id);
        }
        //this.addShippingEventListener();
        //this.addPayNowBtnEventListener();
        this.updateCartItems();
        this.updateCartShipping();
        this.updateCartTotal();
        this.addShippingEventListener();
        return true;
    };
    this.Item = function (id, price) {
        this.id = id;
        this.price = price;
        this.quantity = 0;
        this.total = 0;
    };
    this.getCartItem = function (itemId) {
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
            var item = this.getCartItem(itemId);
            item.quantity = quantity;
            this.updateCartItems();
            this.updateCartShipping();
            this.updateCartTotal();
        }.bind(this), false);
    };
    // add event listeners to individual product buy now buttons
    this.addProductBtnEventListener = function (itemId) {
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
    };
    // add event listener to shipping radio buttons
    this.addShippingEventListener = function () {
        // get shipping region
        var el = document.getElementById('shippingOptions');
        var shippingArr = el.getElementsByTagName('input');
        for (var i = 0; i < shippingArr.length; i++) {
            shippingArr[i].addEventListener('change', function (e) {
                var item = e.target;
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
            }.bind(this), false);
        }
        this.updateCartShipping();
        this.updateCartTotal();
    };
    // add event listener to pay now / submit button
    this.addPayNowBtnEventListener = function () {
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
    };
    this.updateCartItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            // update cart items totals
            var price = this.items[i].price;
            var quantity = this.items[i].quantity;
            var total = this.getItemTotal(price, quantity);
            this.items[i].total = total;
            this.updateCartItemTotalEl(this.items[i]);
        }
        this.updateSubtotal();
        var subtotal = this.subtotal;
        var subtotalEl = document.getElementById('totalSubTotal');
        subtotalEl.innerHTML = '£' + subtotal;
    };
    this.updateCartShipping = function (shippingRegion) {
        this.updateShippingTotal();
        var shippingTotal = this.shippingTotal;
        var shippingTotalEl = document.getElementById('totalShippingTotal');
        shippingTotalEl.innerHTML = '£' + shippingTotal;
    };
    this.updateCartTotal = function () {
        this.updateTotal();
        var total = this.total;
        var totalTotalEl = document.getElementById('totalTotal');
        totalTotalEl.innerHTML = '£' + total;
    };
    this.getItemTotal = function (price, quantity) {
        return price * quantity;
    };
    this.updateCartItemTotalEl = function (item) {
        var el = document.getElementById('total' + item.id);
        if (!el) {
            return false;
        }
        el.innerHTML = '£' + item.total;
        return true;
    };
}
var i1 = { id: 'AOCPaperback', price: 12.5 };
var i2 = { id: 'AOCAudioCD', price: 10 };
var i3 = { id: 'PWPamphlet', price: 2.5 };
var itemArray = [i1, i2, i3];
var cart = new Cart(itemArray);
cart.init();
