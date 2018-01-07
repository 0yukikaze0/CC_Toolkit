let plCalc = new Vue({
    el: '#plCalcWidget',
    delimiters: ['${','}'],
    data: {
        denom: 100000000,
        breakEvenPrice : 0,
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
        },
        recommendations: []
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
            plCalc.sellQuantity = plCalc.quantity;
            plCalc.calculateBreakEven();
            plCalc.buildRecommendations();
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
                plCalc.pl.loss = Math.abs(profit);
                plCalc.pl.lossPercent = Math.abs(parseFloat((profit / plCalc.buy.totalPayable) * 100).toFixed(2));
                plCalc.pl.profit = 0;
                plCalc.pl.profitPercent = 0;
            }
        },
        calculateBreakEven : () => {
            let breakEvenIncrement = Math.ceil(((plCalc.buy.totalPayable + plCalc.buy.fee) / plCalc.quantity) - plCalc.buyPriceInSatoshis);
            if(!isNaN(breakEvenIncrement)){
                plCalc.sellPriceInSatoshis = parseInt(plCalc.buyPriceInSatoshis) + breakEvenIncrement;
                plCalc.breakEvenPrice = parseInt(plCalc.buyPriceInSatoshis) + breakEvenIncrement;
            }
        },
        buildRecommendations : () => {
            plCalc.recommendations = [];
            if(plCalc.quantity > 0){
                let target = 10;
                while(target <= 100){

                    /**
                     * -> Get target slice of x%
                     * -> Target yield = totalPaid + slice
                     * -> Calculate fee
                     */
                    let slice = plCalc.buy.totalPayable * (target / 100);
                    let targetYield = plCalc.buy.totalPayable + slice;
                    let yieldFee = parseInt(targetYield * (plCalc.sellFee/100));
                    
                    let targetPrice = parseInt((targetYield + yieldFee) / plCalc.quantity);
                    let fee = parseInt((targetPrice * plCalc.quantity) * (plCalc.sellFee/100));

                    plCalc.recommendations.push({price: targetPrice, yield: (targetPrice * plCalc.quantity) - fee, percent: target});
                    target += 10;
                }
                
            }
            
        }
    }
})