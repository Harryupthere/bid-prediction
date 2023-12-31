import React from "react";
import Chart from "./Chart";
import { useState,useEffect } from "react";
import config from "../../config";

import axios from 'axios';
import toast, { Toaster } from "react-hot-toast";
function Home() {
  var x = localStorage.getItem("token");
  if (x == null || x == undefined) {
    window.location.href = `${config.baseUrl}`
  }
  var userId = localStorage.getItem("userId");
  var userEmail = localStorage.getItem("email");

  const [toggle, setToggle] = useState(0);
  const [selectedOption, setSelectedOption] = useState('SEC'); // Initialize the selected option
  const [form, setForm] = useState({ time: '', amount: '' });
  const [formError, setFormError] = useState({ time: '', amount: '' });
  const [betTransaction,setBetTransactions] = useState([]);
  const [usserBalance,setUserBalance] = useState(0)
  const [rate,setRate] = useState(0)
  const toggleTab = (index) => {
    return setToggle(index);
  };

  useEffect(() => {
    getBetTransactions()
    getRateApi()
    getBalance()

    setInterval(() => {
    getBetTransactions()
    //getRateApi()
  }, 3000);

  }, []);


  const getRateApi=async()=>{
    const config1 = {
   method: 'get', // HTTP method (PUT in this case)
   url: `${config.apiKey}getrate`,   // The API endpoint
 
 };
 
 let res = await axios(config1)
 if (res.response) {
 
 } else {
   setRate(res.data.rate)
 
 }
   }
  const getBalance=async()=>{
    const config1 = {
    method: 'get', // HTTP method (PUT in this case)
    url: `${config.apiKey}getuserdetails?email=${userEmail}`,   // The API endpoint
    // headers: {
    //   'Authorization': `Bearer ${x}`, // Set the bearer token in the "Authorization" header
    //   'Content-Type': 'application/json', // Set the content type if needed
    // },
  };

let res=  await axios(config1)
//console.log(res)
if(res.response){
console.log(res.response.data.message);

}else{
setUserBalance(res.data.wallet)

}
}

  const getBetTransactions=async()=>{
      const config1 = {
      method: 'get', // HTTP method (PUT in this case)
      url: `${config.apiKey}bettransactions?userId=${userId}`,   // The API endpoint
      // headers: {
      //   'Authorization': `Bearer ${x}`, // Set the bearer token in the "Authorization" header
      //   'Content-Type': 'application/json', // Set the content type if needed
      // },
    };

  let res=  await axios(config1)
if(res.response){
  console.log(res.response.data.message);

}else{
  setBetTransactions(res.data)

}
  }


  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value); // Update the selected option when the user makes a selection
  };
  const handleChange = (e) => {

    setFormError({ newPassword: '', confirmPassword: '' })
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const setPredictionFunc = async (e, result) => {
    e.preventDefault();
    try {
      let verify = verification();
     
      if (verify) {

        let timeInSec = form.time;

        if (selectedOption === "MIN") {
          timeInSec = form.time * 60;
        }
        if (selectedOption === "HOUR") {
          timeInSec = form.time * 60 * 60;
        }
        timeInSec = timeInSec.toString();
        let data = { "time": timeInSec, "amount": form.amount, "prediction": result }
        console.log("data", data)
        const config1 = {
          method: 'post', // HTTP method (PUT in this case)
          url: `${config.apiKey}bet`,   // The API endpoint
          headers: {
            'Authorization': `Bearer ${x}`, // Set the bearer token in the "Authorization" header
            'Content-Type': 'application/json', // Set the content type if needed
          },
          data: data, // The data you want to send in the request body
        };

        let res = await axios(config1)
        // .then(response => {
        //   // Handle the success response here.
        //   toast.success( response.data.message);
        // })
        // .catch(error => {
        //   // Handle errors here.
        //   toast.error(error);
        // });
        console.log(res)
        if (res.response) {
          toast.error(res.response.data.message);
        } else {
          toast.success(res.data.message);
       
        }
      }else{
        toast.error("wrong input")
      }
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error)
    }
  }


  const verification = () => {
    let timeError = ''
    let amountError = ''
    if (form.time.length <= 0) {
      timeError = 'Time is required'
    }
    if (form.amount.length <= 0) {
      amountError = 'Amount is required'
    }if(usserBalance<=form.amount){
      amountError = 'Insufficient Fund'
    }

    setFormError({ time: timeError, amount: amountError })
    if (timeError.length > 0 || amountError.length > 0) {
      return false
    }
    return true
  }

  return (
    <>
      <Toaster />
      <div className="bg-center w-screen m-auto  block xl:px-0  p-4">
        <div className="  max-w-8xl mx-auto    flex justify-center items-center flex-col PageBG rounded-xl shadow-2xl w-full">
      

        <div className=" w-full  px-4 2xl:px-40  md:px-12 my-10">
            <Chart />
          </div>
          <div className=" rounded-br-xl  lg:rounded-tr-xl   rounded-tr-none  lg:rounded-bl-none rounded-bl-xl    flex  justify-center items-center flex-col  px-4  md:px-12  bg-transparent ">
            <div className="  rounded-xl     flex  justify-center items-center flex-col w-full ">
             
              <div className="grid w-full mx-auto  grid-cols-1  sm:grid-cols-2  lg:grid-cols-4 flex flex-col   gap-5">
                  <div className="relative w-full min-w-[200px] h-16 my-2 flex justify-center items-center flex-row ">
                    <input
                      type="number"
                      className="peer w-full h-full text-white border-t-transparent bg-transparent text-blue-gray-100 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-100 placeholder-shown:border-t-gray-100 border focus:border-2  focus:border-t-transparent text-md px-3 py-3 rounded-md border-gray-100 focus:border-blue-500"
                      placeholder=" "
                      onFocus={() => toggleTab(1)}
                      onBlur={() => toggleTab(0)}
                      onChange={e => { handleChange(e) }}
                      name='time'
                      value={form.time}
                    />
                    <div                       className={` right-0 bg-transparent text-white ${toggle === 1
                        ? "border-l-2 border-sky-500"
                        : "border border-gray-50"
                      } capitalize  h-full p-2 outline-none absolute`}>

                    <select
                    className="w-full h-full bg-black/60 border-none"
                      
                      value={selectedOption} onChange={handleSelectChange}
                      >
                      <option  value={"SEC"}> Sec</option>
                      <option  value={"MIN"}>Minute</option>
                      <option  value={"HOUR"}>Hour</option>
                    </select>
                      </div>
                    <label style={{color:formError.time?'red':''}} className="flex text-white w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-100 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-100 transition-all -top-1.5 peer-placeholder-shown:text-[18px] text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                Duration
                    </label>
                  </div>
                  <div className="relative w-full min-w-[200px] h-16 my-2 flex justify-center items-center flex-row ">
                    <input
                      type="number"
                      className="peer w-full h-full text-white border-t-transparent bg-transparent text-blue-gray-100 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-100 placeholder-shown:border-t-gray-100 border focus:border-2  focus:border-t-transparent text-md px-3 py-3 rounded-md border-gray-100 focus:border-blue-500"
                      placeholder=" "
                      onFocus={() => toggleTab(2)}
                      onBlur={() => toggleTab(0)}
                      onChange={e => { handleChange(e) }}
                      name='amount'
                      value={form.amount}
                    />
                    <span
                      className={` right-0 bg-transparent text-white ${toggle === 2
                          ? "border-l-2 border-sky-500"
                          : "border border-gray-50"
                        } capitalize  h-full p-2 outline-none absolute px-6 flex justify-center items-center`}
                    >
                      USDT
                    </span>
                    <label  style={{color:formError.amount?'red':''}} className="flex text-white w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-100 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-100 transition-all -top-1.5 peer-placeholder-shown:text-[18px] text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                      Amount
                    </label>
                  </div>
                  <div className="relative w-full min-w-[200px] h-16 my-2 flex justify-center items-center flex-row ">
                    <input
                      type="number"
                      className="peer w-full h-full text-white border-t-transparent bg-transparent text-blue-gray-100 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-100 placeholder-shown:border-t-gray-100 border focus:border-2  focus:border-t-transparent text-md px-3 py-3 rounded-md border-gray-100 focus:border-blue-500"
                      placeholder=" "
                      onFocus={() => toggleTab(3)}
                      onBlur={() => toggleTab(0)}
                      value={usserBalance}
                    />
                    <span
                      className={` right-0 bg-transparent text-white ${toggle === 3
                          ? "border-l-2 border-sky-500"
                          : "border border-gray-50"
                        } capitalize  h-full p-2 outline-none absolute px-6 flex justify-center items-center`}
                    >
                      USDT
                    </span>
                    <label className="flex text-white w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-100 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-100 transition-all -top-1.5 peer-placeholder-shown:text-[18px] text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                      Wallet
                    </label>
                  </div>
                  <div className="relative w-full min-w-[200px] h-16 my-2 flex justify-center items-center flex-row ">
                    <input
                      type="number"
                      className="peer w-full h-full text-white border-t-transparent bg-transparent text-blue-gray-100 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-gray-100 placeholder-shown:border-t-gray-100 border focus:border-2  focus:border-t-transparent text-md px-3 py-3 rounded-md border-gray-100 focus:border-blue-500"
                      placeholder=" "
                      onFocus={() => toggleTab(4)}
                      onBlur={() => toggleTab(0)}
                      value={rate}
                    />
                    <span
                      className={` right-0 bg-transparent text-white ${toggle === 4
                          ? "border-l-2 border-sky-500"
                          : "border border-gray-50"
                        } capitalize  h-full p-2 outline-none absolute px-4 flex justify-center items-center`}
                    >
                      Percent
                    </span>
                    <label className="flex text-white w-full h-full select-none pointer-events-none absolute left-0 font-normal peer-placeholder-shown:text-gray-100 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-gray-100 transition-all -top-1.5 peer-placeholder-shown:text-[18px] text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[4.1] text-blue-gray-400 peer-focus:text-blue-500 before:border-blue-gray-200 peer-focus:before:border-blue-500 after:border-blue-gray-200 peer-focus:after:border-blue-500">
                      Profit
                    </label>
                  </div>
              
              </div>
              <div className="grid w-full mx-auto  grid-cols-2       gap-2 my-4">
                <button onClick={e => { setPredictionFunc(e, "rise") }} className="border-2 border-green-500 text-white p-3 rounded-lg hover:bg-green-500 hover:text-white font-bold hover:border-none outline-none">
                  Rise
                </button>
                <button onClick={e => { setPredictionFunc(e, "fall") }} className="border-2 border-red-500 text-white p-3 rounded-lg hover:bg-red-500 hover:text-white font-bold hover:border-none outline-none">
                  Fall
                </button>
              </div>
            </div>
          </div>


        </div>
             {/* <div className=" w-screen  lg:block xl:px-0  p-4 py-10 overflow-hidden "> */}

        <div className="flex justify-start items-start text-center  max-w-8xl     my-3 PageBG rounded-xl shadow-2xl overflow-hidden ">
          <div className=" my-3 overflow-x-auto w-full">
            <h1 className="text-2xl font-bold text-white p-4 w-60 rounded-tr-xl rounded-tl-xl flex justify-center items-center bg-black/50">
              {" "}
              New Request
            </h1>
            <table className="2xl:w-[1500px]   w-[1000px]">
               <thead className="text-md font-bold">
                <tr>
                  <th className="bg-black/50 text-white py-3">Date</th>

                  <th className="bg-black/50 text-white py-3">Rise/Fall</th>
                  <th className="bg-black/50 text-white py-3">Amount</th>
                  <th className="bg-black/50 text-white py-3">Profit</th>
                  <th className="bg-black/50 text-white py-3">Result</th>
                </tr>
              </thead>

              <tbody className="text-white">
                {betTransaction.length > 0 ?
                  betTransaction.map((item) => (
                    <tr>
                      <td className=" py-1 hover:bg-black/20">{item.date}</td>
                      <td className=" py-1 hover:bg-black/20">{item.prediction}</td>
                      <td className=" py-1 hover:bg-black/20">{item.amount}</td>
                      <td className=" py-1 hover:bg-black/20">{item.profit}</td>
                      <td className=" py-1 hover:bg-black/20">{item.result}</td>

                        </tr>
                  ))
                       :
                       <tr>
                  <td className=" py-1 hover:bg-black/20">No Data</td>

                                </tr>

                }
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
