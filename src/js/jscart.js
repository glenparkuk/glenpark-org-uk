function Cart(items) {
    this.items = {};
    this.init = function () {
        if (items.length < 1) {
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            this.items[items[i].id] = items[i];
            this.addQuantityEventListener(items[i].id);
        }
        this.updateCart();
    };
    this.getItemQuantity = function (itemId) {
        var q = document.getElementById('quantity' + itemId).value;
        return q;
    };
    this.getItemTotal = function (price, quantity) {
        return price * quantity;
    };
    this.updateCart = function () {
        var subtotal = 0;
        var subtotalElement = document.getElementById('totalSubTotal');
        for (var i = 0; i < this.items.length - 1; i++) {
            this.updateItemTotalElement(this.items[i].id);
            subtotal += this.items[i].total;
        }
        subtotalElement.innerHTML = '£' + subtotal;
    };
    this.updateItemTotalElement = function (itemId) {
        var el = document.getElementById('total' + itemId);
        el.innerHTML = '£' + this.items[itemId].total;
    };
    this.addQuantityEventListener = function (itemId) {
        var el = document.getElementById('quantity' + itemId);
        el.addEventListener('input', this.onQuantityUpdateEvent); // TODO: use event object - this.onQuantityUpdate(e)
    };
    this.onQuantityUpdateEvent = function (e) {
        var el = e.target;
        var itemId = el.id.replace('quantity', ''); // TODO: improve this with data targets in HTML
        cart.onQuantityUpdate(itemId);
    };
    this.onQuantityUpdate = function (itemId) {
        console.log("onQuantityUpdate");
        var item = this.items[itemId];
        item.quantity = this.getItemQuantity(itemId);
        item.total = this.getItemTotal(item.price, item.quantity);
        this.updateCart();
    };
}
var AOCPaperback = { id: 'AOCPaperback', price: 12.5, quantity: 0, total: 0 };
var AOCCD = { id: 'AOCAudioCD', price: 10, quantity: 0, total: 0 };
var PWPamphlet = { id: 'PWPamphlet', price: 2.5, quantity: 0, total: 0 };
var itemArray = [AOCPaperback, AOCCD, PWPamphlet];
var cart = new Cart(itemArray);
cart.init();
