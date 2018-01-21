function Cart(items) {
    this.items = [];
    this.shippingRegion = null;
    this.shippingTotal = 0;
    this.subtotal = 0;
    this.total = 0;
    this.largeLetterPrices = {
        'region1': 2.52,
        'region2': 3.80,
        'region3': 4.75,
        'region4': 5.05
    };
    this.smallParcelWeightMatrix = {
        'region1': { '1000': 3.50, '2000': 5.50 },
        'region2': { '250': 4.10, '500': 5.80, '750': 7.20, '1000': 8.60, '1250': 9.85, '1500': 11.10, '1750': 12.30, '2000': 13.45 },
        'region3': { '250': 5.15, '500': 8.05, '750': 10.70, '1000': 13.30, '1250': 14.90, '1500': 16.50, '1750': 18.10, '2000': 19.65 },
        'region4': { '250': 5.60, '500': 8.70, '750': 11.40, '1000': 14.05, '1250': 15.85, '1500': 17.75, '1750': 19.60, '2000': 21.40 }
    };
    /* Initialization */
    // init
    // Item
    // addQuantityEventListener
    // addBuynowEventListener
    // addShippingEventListener
    // initialiseWeightArrays
    /* Operations */
    // getItem
    // getItemTotal
    // getWeightBracket
    /* Update Cart Object */
    // updateShippingTotal
    // updateTotalWeight
    // updateSubtotal
    // updateTotal
    /* Update DOM */
    // updateDOMItems
    // updateDOMShipping
    // updateDOMTotal
    /* Errors and debugging */
    // checkNaN
    // sendGACartError
    this.getWeightBracket = function (totalWeight, weightBrackets) {
        //console.log(weightBrackets);
        if (weightBrackets.length < 2) {
            return false;
        }
        var mid = Math.ceil(weightBrackets.length / 2);
        if (totalWeight === weightBrackets[mid])
            return weightBrackets[mid];
        if (weightBrackets.length === 2) {
            if (totalWeight > weightBrackets[0] && totalWeight < weightBrackets[1]) {
                return weightBrackets[mid];
            }
        }
        if (totalWeight < weightBrackets[mid]) {
            if (totalWeight > weightBrackets[mid - 1]) {
                return weightBrackets[mid];
            }
            var leftHalf = weightBrackets.slice(0, mid); // Check this logic
            return this.getWeightBracket(totalWeight, leftHalf);
        }
        else if (totalWeight > weightBrackets[mid]) {
            var rightHalf = weightBrackets.slice(mid, weightBrackets.length); // Check this logic
            return this.getWeightBracket(totalWeight, rightHalf);
        }
        return false;
    };
    this.updateShippingTotal = function () {
        if (this.shippingRegion == 1 || this.shippingRegion == 2 || this.shippingRegion == 3 || this.shippingRegion == 4) {
            var AOCPaperback = this.getItem('AOCPaperback');
            var AOCAudioCD = this.getItem('AOCAudioCD');
            var PWPamphlet = this.getItem('PWPamphlet');
            if (AOCAudioCD.quantity < 1 && AOCPaperback.quantity < 1 && PWPamphlet.quantity < 1) {
                // Sanity check
                this.shippingTotal = 0;
            }
            else if (AOCAudioCD.quantity == 1 && AOCPaperback.quantity == 0 && PWPamphlet.quantity < 6) {
                // Custom: if only 1 CD user large letter prices
                var shippingTotal = this.largeLetterPrices['region' + this.shippingRegion];
                this.shippingTotal = shippingTotal;
            }
            else {
                // Find small parcel weight
                var totalWeight = this.updateTotalWeight();
                var weightBrackets = this.smallParcelWeights['region' + this.shippingRegion];
                var weightBracket = this.getWeightBracket(totalWeight, weightBrackets);
                this.shippingTotal = this.smallParcelWeightMatrix['region' + this.shippingRegion][weightBracket];
            }
        }
        else {
            this.shippingTotal = 0;
        }
        return this.shippingTotal;
    };
    this.updateTotalWeight = function () {
        var totalWeight = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var itemTotalWeight = item.quantity * item.weight;
            totalWeight += itemTotalWeight;
        }
        this.totalWeight = totalWeight;
        return this.totalWeight;
    };
    this.updateSubtotal = function () {
        var subtotal = 0;
        for (var i = 0; i < this.items.length; i++) {
            subtotal += this.items[i].total;
        }
        this.subtotal = subtotal;
        return this.subtotal;
    };
    this.updateTotal = function () {
        this.total = this.shippingTotal + this.subtotal;
        return this.total;
    };
    this.init = function () {
        if (items.length < 1) {
            return false;
        }
        this.smallParcelWeights = this.initialiseWeightArrays(this.smallParcelWeightMatrix);
        for (var i = 0; i < items.length; i++) {
            var newItem = new this.Item(items[i].id, items[i].name, items[i].description, items[i].price, items[i].weight);
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
    this.Item = function (id, name, description, price, weight) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.weight = weight;
        this.quantity = 0;
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
    this.updateDOMItems = function () {
        for (var i = 0; i < this.items.length; i++) {
            // update cart items totals
            var item = this.items[i];
            var price = item.price;
            var quantity = item.quantity;
            var total = this.getItemTotal(price, quantity);
            item.total = this.checkNaN(total);
            // update total
            var el = document.getElementById('total' + item.id);
            if (el) {
                el.innerHTML = '£' + item.total.toFixed(2);
            }
            else {
                console.log('Error: Item total element not found.');
            }
        }
        this.updateTotalWeight(); // TODO: I don't think this is necessary and can be removed
        var subtotal = this.updateSubtotal();
        subtotal = this.checkNaN(subtotal);
        var subtotalEl = document.getElementById('totalSubTotal');
        subtotalEl.innerHTML = '£' + subtotal.toFixed(2);
    };
    this.updateDOMShipping = function (shippingRegion) {
        var shippingTotal = this.updateShippingTotal();
        shippingTotal = this.checkNaN(shippingTotal);
        var shippingTotalEl = document.getElementById('totalShippingTotal');
        if (shippingTotalEl) {
            shippingTotalEl.innerHTML = '£' + shippingTotal.toFixed(2);
        }
    };
    this.updateDOMTotal = function () {
        var total = this.updateTotal();
        total = this.checkNaN(total);
        var totalTotalEl = document.getElementById('totalTotal');
        if (totalTotalEl) {
            totalTotalEl.innerHTML = '£' + total.toFixed(2);
        }
    };
    this.getItemTotal = function (price, quantity) {
        return price * quantity;
    };
    this.initialiseWeightArrays = function (weightMatrix) {
        var weightArrays = {};
        for (var regionProperty in weightMatrix) {
            var weightArray = [0];
            for (var weightProperty in weightMatrix[regionProperty]) {
                weightArray.push(parseInt(weightProperty));
            }
            weightArrays[regionProperty] = weightArray.sort(function (a, b) { return a - b; });
            ;
        }
        return weightArrays;
    };
    this.checkNaN = function (variableName, number) {
        if (isNaN(number)) {
            var functionName = this.checkNaN.caller.name;
            this.sendGACartError(functionName, variableName);
            return 0;
        }
        return number;
    };
    this.sendGACartError = function (functionName, variableName) {
        ga('send', 'event', {
            'eventCategory': 'jsCart Error',
            'eventAction': functionName,
            'eventLabel': variableName
        });
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
