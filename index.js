const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL
} = require("@solana/web3.js")

//Create Wallet
const wallet = new Keypair()

//Get Public key & Secret key from the wallet created
const publicKey = new PublicKey(wallet._keypair.publicKey)
const secretKey = wallet._keypair.secretKey

//Function to get wallet Balance
const getWalletBalance = async() =>{
    try {
        //Establish Connection to devnet
        const connection = new Connection(clusterApiUrl('devnet'),'confirmed')
        //getBalance function uses public to fetch balance
        const walletBalance = await connection.getBalance(publicKey)
        console.log( `Wallet balance is ${walletBalance}`)
    } catch (err) {
        console.log(err)
    }
}

//Function to airdrop some sols to your wallet
const airDropSol = async() =>{
    try {
        //Establish Connection
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
        //request airDrop from connection, input in LAMPORTS(1 billion LAMPORTS = 1 sol)
        const fromAirDropSignature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL)
        //get latest blockhash, required to add transaction in the blockchain
        const latestBlockHash = await connection.getLatestBlockhash();
        //confirm the transaction with parameters
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: fromAirDropSignature,
        });
    } catch (err) {
        console.log(err)
    }
}

//Main function to test the codes
const main = async() => {
    console.log(publicKey)
    //Get initial balance
    await getWalletBalance()
    //airdrop some sols
    await airDropSol()
    //Get latest balance after airdroping
    await getWalletBalance()
}

main()