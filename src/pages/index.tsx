/* eslint-disable jsx-a11y/alt-text */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import styles from "./css/index.module.css"

import {
    marketplaceAddress
} from '../config'

import NFTMarketplace from '../contracts/NFTMarketplace.sol/NFTMarketplace.json'
import React from 'react'

export function Home() {
    const [nfts, setNfts] = useState<any>([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        /* create a generic provider and query for unsold market items */
        const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/juCuSQEu7XvOcSGKFOjgGP_tfoOpt057")
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
        const data = await contract.fetchMarketItems()

        /*
        *  map over items returned from smart contract and format 
        *  them as well as fetch their token metadata
        */
        const items = await Promise.all(data.map(async (i: { tokenId: { toNumber: () => any }; price: { toString: () => ethers.BigNumberish }; seller: any; owner: any }) => {
            const tokenUri = await contract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            const metadata = JSON.parse(meta.data)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: metadata.image,
                name: metadata.name,
                description: metadata.description,
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    async function buyNft(nft: any) {
        /* needs the user to sign the transaction, so will use Web3Provider and sign it */
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

        /* user will be prompted to pay the asking proces to complete the transaction */
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
        const transaction = await contract.createMarketSale(nft.tokenId, {
            value: price
        })
        await transaction.wait()
        loadNFTs()
    }
    if (loadingState === 'loaded' && !nfts.length)
        return (
            <>
                <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
            </>
        )
    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {nfts.map((nft: any, i: any) => (
                    <div key={i} className={styles.card}>
                        <img src={nft.image} alt={nft.name} className={`${styles.h64} ${styles.roundedXl}`} />
                        <div className={`${styles.p4}`}>
                            <p className={`${styles.h64} ${styles.text2xl} ${styles.fontSemiBold}`}>{nft.name}</p>
                            <div className={`${styles.h70} ${styles.overflowHidden}`}>
                                <p className={`${styles.textGray400}`}>{nft.description}</p>
                            </div>
                        </div>
                        <div className={styles.price}>
                            <p className={styles.price}>{nft.price} ETH</p>
                            <button className={`${styles.mt4} ${styles.wFull} ${styles.bgPink500} ${styles.textWhite} ${styles.fontBold} ${styles.py2} ${styles.px12} ${styles.rounded}`} onClick={() => buyNft(nft)}>Buy</button>
                        </div>
                    </div>
                ))}
            </div>


        </div>

    )
}