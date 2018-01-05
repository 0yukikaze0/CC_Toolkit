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
        },
        pl: {
            profit : 0,
            profitPercent : 0,
            loss : 0,
            lossPercent : 0
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
            plCalc.calculateBreakEven();
        },
        calculateSell : () => {
            plCalc.sell.fee = parseInt((plCalc.sellPriceInSatoshis * plCalc.sellQuantity) * (plCalc.sellFee / 100));
            plCalc.sell.totalReceivable = (plCalc.sellPriceInSatoshis * plCalc.sellQuantity) - plCalc.sell.fee;
            plCalc.calculatePL();
        },
        calculatePL : () => {
            let profit = plCalc.sell.totalReceivable - plCalc.buy.totalPayable;
            if(profit >= 0){
                plCalc.pl.profit = profit;
                plCalc.pl.profitPercent = parseFloat((profit / plCalc.buy.totalPayable) * 100).toFixed(2);
                plCalc.pl.loss = 0;
                plCalc.pl.lossPercent = 0;
            } else {
                plCalc.pl.loss = profit;
                plCalc.pl.lossPercent = parseFloat((profit / plCalc.buy.totalPayable) * 100).toFixed(2);
                plCalc.pl.profit = 0;
                plCalc.pl.profitPercent = 0;
            }
        },
        calculateBreakEven : () => {
            let breakEvenSell = plCalc.buy.totalPayable + 1;
            let breakEvenPrice = parseInt(breakEvenSell / plCalc.quantity) - plCalc.buyPriceInSatoshis;
            
        }
    }
})