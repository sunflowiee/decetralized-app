function $id(id) {return document.getElementById(id)}

const walletAddress = $id("wallet-address")
const walletStatus = $id("status")
const walletBalance = $id("balance")
const walletNetwork = $id("network")
const connectButton = $id("connect-btn")

async function handleConnectWallet(){
    if(!window.ethereum){
        alert("wallet belum terinstall")
        return
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        })    
        const chainId = await window.ethereum.request({
            method: "eth_chainId"
        })
        const address = accounts[0]
        
        const balanceWei = await window.ethereum.request({
            method: "eth_getBalance",
            params: [address, "latest"]
        });
        const balanceAvax = parseInt(balanceWei, 16) / 1e18

        const balance = `${Number(balanceAvax.toFixed(4))} AVAX`
        const network = await getNetworkNameAuto(chainId)

        render(address, balance, 1, network)
    } catch (err) {
        console.error("User rejected or error: ", err)
    }
}

async function getNetworkNameAuto(chainId) {
  const res = await fetch("https://chainid.network/chains.json");
  const chains = await res.json();

  const chain = chains.find(
    c => "0x" + c.chainId.toString(16) === chainId
  );

  return chain ? chain.name : "Unknown Network";
}

function render(address, balance, status, network){
    walletAddress.innerText = address
    walletBalance.innerText = balance
    walletNetwork.innerText = network
    walletStatus.innerText  = status ? "Connected" : "Disconnected"
    connectButton.innerText = "Wallet Connected"
    connectButton.disabled = true

    if(status){
        walletStatus.classList.remove("disconnected")
        walletStatus.classList.add("connected")
    } else {
        walletStatus.classList.remove("connected")
        walletStatus.classList.add("disconnected")
    }

}
