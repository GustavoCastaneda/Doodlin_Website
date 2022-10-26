import { useState, useEffect } from 'react'
import { initOnboard } from '../utils/onboard'
import { useConnectWallet, useSetChain, useWallets } from '@web3-onboard/react'
import { config } from '../dapp.config'
import {
  getTotalMinted,
  getMaxSupply,
  isPausedState,
  isPublicSaleState,
  isPreSaleState,
  presaleMint,
  publicMint
} from '../utils/interact'
import imagen1 from '/Volumes/Mac/Users/mac1/Desktop/Colibri/Clientes/Doodlin/minting_site/Doodlin_Website/public/images/imagen1.png'
import Image from 'next/image'

 



export default function Mint() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain()
  const connectedWallets = useWallets()

  const [maxSupply, setMaxSupply] = useState(0)
  const [totalMinted, setTotalMinted] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)
  const [paused, setPaused] = useState(false)
  const [isPublicSale, setIsPublicSale] = useState(false)
  const [isPreSale, setIsPreSale] = useState(false)
  const [status, setStatus] = useState(null)
  const [mintAmount, setMintAmount] = useState(1)
  const [isMinting, setIsMinting] = useState(false)
  const [onboard, setOnboard] = useState(null)

  useEffect(() => {
    setOnboard(initOnboard)
  }, [])

  useEffect(() => {
    if (!connectedWallets.length) return

    const connectedWalletsLabelArray = connectedWallets.map(
      ({ label }) => label
    )
    window.localStorage.setItem(
      'connectedWallets',
      JSON.stringify(connectedWalletsLabelArray)
    )
  }, [connectedWallets])

  useEffect(() => {
    if (!onboard) return

    const previouslyConnectedWallets = JSON.parse(
      window.localStorage.getItem('connectedWallets')
    )

    if (previouslyConnectedWallets?.length) {
      async function setWalletFromLocalStorage() {
        await connect({
          autoSelect: {
            label: previouslyConnectedWallets[0],
            disableModals: true
          }
        })
      }

      setWalletFromLocalStorage()
    }
  }, [onboard, connect])

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply())
      setTotalMinted(await getTotalMinted())

      setPaused(await isPausedState())
      setIsPublicSale(await isPublicSaleState())
      const isPreSale = await isPreSaleState()
      setIsPreSale(isPreSale)

      setMaxMintAmount(
        isPreSale ? config.presaleMaxMintAmount : config.maxMintAmount
      )
    }

    init()
  }, [])

  const incrementMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1)
    }
  }

  const decrementMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1)
    }
  }

  const presaleMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await presaleMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }
  const publicMintHandler = async () => {
    setIsMinting(true)

    const { success, status } = await publicMint(mintAmount)

    setStatus({
      success,
      message: status
    })

    setIsMinting(false)
  }

  return (
    <div className="custom-image bg-cover min-h-screen h-full w-full overflow-hidden flex flex-col items-center justify-center bg-brand-background ">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
       <div> 
          <header className="min-w-full text-gray-800 py-5 px-4 md:px-0 items-center">
            <div className="flex items-center container mx-auto max-w-5xl justify-center h-full">
              {/* Logo */}
                <a className="font-coiny text-xl md:text-3xl font-bold text-center ">
                  <span className="text-[40px] text-extrabold bg-gradient-to-br from-brand-blue to-brand-purple pr-2 bg-clip-text text-transparent">
                    LOGO
                  </span>
                </a>
            </div>
          </header>
        </div>

        <div className="flex flex-col items-center justify-center h-full w-full px-2 md:px-10">
          <div className="relative z-1 md:max-w-3xl w-full fondo2 filter backdrop-blur-sm py-4 rounded-2xl px-2 md:px-10 flex flex-col items-center">
          
            {/* <h1 className=" font-coiny uppercase font-bold text-3xl md:text-4xl bg-gradient-to-br  from-brand-green to-brand-blue bg-clip-text text-transparent mt-3">
              {paused ? 'Paused' : isPreSale ? 'Pre-Sale' : 'Public Sale'}
            </h1> */}

            <div className="pb-10 flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
              <div className="relative w-full">
                <div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                  <p>
                    <span className="text-brand-pink">100</span> /{' '}
                    10000
                  </p>
                </div>

                <Image
                  src={imagen1}
                  className="object-cover w-full sm:h-[280px] md:w-[250px] rounded-2xl"
                />
              </div>

              <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
                  <div className="font-coiny z-10 absolute top-2 text-base px-4 py-2 bg-transparent border-4 border-gray-700 rounded-xl flex items-center justify-center text-white font-semibold">
                        <p className="text-brand-pink">
                          <span className="text-brand-pink">100</span> /{' '}
                          10000
                        </p>
                  </div>                
                  {/* <div className="font-coiny z-10 absolute top-2  opacity-80 filter backdrop-blur-lg text-base px-4 py-2 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
                      <p>
                        <span className="text-brand-pink">100</span> /{' '}
                        10000
                      </p>
                  </div> */}
                <div className="border-4 divide-x-4 divide-gray-700 rounded-xl border-gray-700 font-coiny flex items-center justify-between w-full">
                  <button
                      className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-transparent font-bold"
                      onClick={decrementMintAmount}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 md:h-8 md:w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 12H6"
                        />
                      </svg>
                    </button>
                  

                  <p className="flex items-center justify-center flex-1 grow text-center font-bold text-white text-3xl md:text-4xl">
                    {mintAmount}
                  </p>
                  <button
                    className="w-14 h-10 md:w-16 md:h-12 flex items-center justify-center text-brand-background hover:shadow-lg bg-transparent font-bold"
                    onClick={incrementMintAmount}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 md:h-8 md:w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-sm text-white tracking-widest mt-3 ">
                  Max Mint Amount: {maxMintAmount}
                </p>

                <div className="border-t border-b py-4 mt-9 w-full">
                  <div className="w-full text-xl font-coiny flex items-center justify-between text-white">
                    <p>Total</p>

                    <div className="flex items-center space-x-3">
                      <p>
                        {Number.parseFloat(config.price * mintAmount).toFixed(
                          2
                        )}{' '}
                        ETH
                      </p>{' '}
                      <span className="text-gray-400">+ GAS</span>
                    </div>
                  </div>
                </div>

                {/* Mint Button && Connect Wallet Button */}
                {wallet ? (
                  <button
                    className={` ${
                      paused || isMinting
                        ? 'bg-gray-900 cursor-not-allowed'
                        : 'bg-gradient-to-br from-brand-purple to-brand-pink shadow-lg hover:shadow-pink-400/50'
                    } font-coiny mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
                    disabled={paused || isMinting}
                    onClick={isPreSale ? presaleMintHandler : publicMintHandler}
                  >
                    {isMinting ? 'Minting...' : 'Mint'}
                  </button>
                ) : (
                  <button
                    className="font-coiny mt-12 w-full bg-transparent border-4 border-gray-700 shadow-lg px-6 py-3 rounded-2xl text-2xl text-white hover:shadow-pink-400/50 mx-4 tracking-wide uppercase"
                    onClick={() => connect()}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            {status && (
              <div
                className={`border ${
                  status.success ? 'border-green-500' : 'border-brand-pink-400 '
                } rounded-md text-start h-full px-4 py-4 w-full mx-auto mt-8 md:mt-4"`}
              >
                <p className="flex flex-col space-y-2 text-white text-sm md:text-base break-words ...">
                  {status.message}
                </p>
              </div>
            )}

          
          </div>
        </div>
      </div>
    </div>
  )
}
