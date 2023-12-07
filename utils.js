async function ethPrice(){
  const url = "https://api.etherscan.io/api?module=stats&action=ethprice"
  const { result,error } = await fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .catch((e) => ({
        result: null,
        error:e
      }));
  if(error){
    return NaN
  }else{
    return await result.ethusd
  }
}
async function ethsPrice(){
  const ePrice = await ethPrice()
  const result = {price:NaN,ePrice,ePool:NaN}
  const ethsInfo = await sendStaticCall(
    "0x032e551fc50073efb66e76eff261a7c85532c38b","getReserves")
  const {_reserve0,_reserve1} = ethsInfo || {}
  if(_reserve0&&_reserve1){
    result.price = Number(_reserve0)/Number(_reserve1)*Number(ePrice)
    result.ePool = Number(_reserve0) / 1000000000000000000.0
  }
  return result
}
async function sendStaticCall(to,func,args){
    const url = new URL(
      `https://api.facet.org/contracts/${to}/static-call/${func}`
    )
    const params = {}
    if (args) {
      params.args = JSON.stringify(args)
    }
    url.search = new URLSearchParams(params).toString();
    const { result } = await fetch(url.href, { cache: "no-store" })
      .then((res) => res.json())
      .catch(() => ({
        result: null,
      }));
    return result
  }