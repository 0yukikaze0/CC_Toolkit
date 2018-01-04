let plCalc = new Vue({
    el: '#plCalcWidget',
    delimiters: ['${','}'],
    data: {
        denom: 100000000,
        buyPriceInSatoshis: 0,
        quantity: 0,
        buyFee: 0.25,
        buy: {
            fee : 0,
            totalPayable : 0
        },
        sellPriceInSatoshis : 0,
        sellQuantity: 0,
        sellFee: 0.25,
        sell: {
            fee : 0,
            totalReceivable : 0
        }
    },
    watch: {
        buyPriceInSatoshis : () => {
            plCalc.calculateBuy();
        },
        quantity : () => {
            plCalc.calculateBuy();
        },
        buyFee : () => {
            plCalc.calculateBuy();
        },
        sellPriceInSatoshis : () => {
            plCalc.calculateSell();
        },
        sellQuantity : () => {
            plCalc.calculateSell();
        },
        sellFee: () => {
            plCalc.calculateSell();
        },
    },
    methods: {
        calculateBuy : () => {
            plCalc.buy.fee = parseInt((plCalc.buyPriceInSatoshis * plCalc.quantity) * (plCalc.buyFee / 100));
            plCalc.buy.totalPayable = plCalc.buy.fee + (plCalc.buyPriceInSatoshis * plCalc.quantity);
        },
        calculateSell : () => {
            console.log('calc')
            plCalc.sell.fee = parseInt((plCalc.sellPriceInSatoshis * plCalc.sellQuantity) * (plCalc.sellFee / 100));
            plCalc.sell.totalReceivable = (plCalc.sellPriceInSatoshis * plCalc.sellQuantity) - plCalc.sell.fee;
        }
    }
})