import { BrowserRouter as Router,  Routes, Route } from "react-router-dom";
import "./App.css";

import Dashboard from "./components/dashboard/Dashboard";
import Signup from "./components/Signup";
import Home from "./components/dashboard/Home";
import Deposit from "./components/dashboard/Deposit";
import Withdraw from "./components/dashboard/Withdraw";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword"

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {  bsc,polygonMumbai } from 'wagmi/chains'
import config from './config'
const chains = [bsc,polygonMumbai]
const projectId = config.projectId

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

function App() {
  
  return (
    <>
    <WagmiConfig config={wagmiConfig}>

    <Router>
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />

      <Route path="signup" element={<Signup />} />
      <Route path="Dashboard" element={<Dashboard />}>
        <Route path="home" element={<Home />} />
        <Route path="withdraw" element={<Withdraw />} />
        <Route path="deposit" element={<Deposit />} />
      
      </Route>
    </Routes>
  </Router>
  </WagmiConfig>

<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </>
   
  );
}

export default App;
