const dtoken = "Tsk_7124566e8c6147939d1708c99bd3b78a";
const base_url = `https://sandbox.iexapis.com/stable/stock/`
const base_url2 = `/chart/today?token=${dtoken}&includeToday=true`
let account_detail;

(function () {
    let accString = localStorage.getItem('account');
    if (accString != null)
    {
        account_detail = JSON.parse(accString);
        console.log('tst');
    }
    else
    {
        account_detail = {
            email: '123@example.com',
            username: 'name',
            stonks: {
                tickers: [],
                stakes: [],
                shares: []
            },
            money: 10000,
            net_worth: 0,
            trades: [],
            net_growth: []
        }
    }
    console.log(account_detail.name);
})();

function calculateNetWorth()
{
    let sumStakes = 0;
    for (let i = 0; i < account_detail.stonks.stakes.length; i ++)
    {
        sumStakes += account_detail.stonks.stakes[i];
    }
    account_detail.net_worth = account_detail.money + sumStakes;
}

function buyStonk(ticker, cost)
{
    let price;
    account_detail.money -= cost;
    //${base_url}${ticker}${base_url2}
    fetch(`https://sandbox.iexapis.com/stable/stock/aapl/chart/2018?token=Tsk_7124566e8c6147939d1708c99bd3b78a&includeToday=false`)
        .then((response) => {
            return response.json();
        })
        .then((stonks) => {
            price = stonks[stonks.length-1].close;
            account_detail.stonks.tickers.push(ticker);
            account_detail.stonks.stakes.push(cost);
            account_detail.stonks.shares.push(cost/price);
            calculateNetWorth();
        });
}

function sellStonk(ticker, amountSold)
{
    copy = account_detail.net_worth;
    account_detail.money += amountSold;
    fetch(`${base_url}${ticker}${base_url2}`)
        .then((response) => {
            return response.json();
        })
        .then((stonks) => {
            price = stonks[stonks.length-1].close;
            index = account_detail.stonks.tickers.indexOf(ticker);
            account_detail.stonks.stakes[index] -= amountSold
            account_detail.stonks.shares[index] -= amountSold / price;
            calculateNetWorth();
            profit = account_detail.net_worth - copy;
            account_detail.trades += profit;
        })
}


function refresh()
{
    for (let i = 0; i < account_detail.stonks.tickers.length; i ++)
    {
        fetch(`${base_url}${account_detail.stonks.tickers[i]}${base_url2}`)
            .then((response) => {
                return response.json();
            })
            .then((stonks) => {
                price = stonks[stonks.length - 1].close;
                let growth = price * account_detail.stonks.shares[i] - account_detail.stonks.stakes[i];
                account_detail.stonks.stakes[i] += growth;
                account_detail.net_growth.push(growth);
                calculateNetWorth();
            })
    }
}

function storeLocal()
{
    localStorage.setItem('account', JSON.stringify(account_detail));
}
function getFromLocalStorage()
{
    account_detail = JSON.parse(localStorage.getItem('account'));
}