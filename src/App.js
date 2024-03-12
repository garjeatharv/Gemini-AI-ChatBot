import { useState } from "react";

const App = () => {
  const [value, setvalue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setchatHistory] = useState([]);

  const surpriseOptions = [
    "who won the lates nobel prize?",
    "where dose burger come from?",
    "who is pm of india?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setvalue(randomValue)
  }

  const getResponse = async () => {
    if(!value){
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers:{
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data =await response.text()
      console.log(data)
      setchatHistory(oldChatHistory => [...oldChatHistory, {
        role:"user",
        parts:value
      },
        {
          role:"model",
          parts:data
        }])
        setvalue("")
    } catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later")
    }
  }

  const clear = () =>{
    setvalue("")
    setError("")
    setchatHistory([])
  }
  return (
    <div className="app">
      <p>
        what do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me
        </button>
      </p>
      <div className="input-container">
        <input value={value} placeholder="When is Christman...?" onChange={(e)=>setvalue(e.target.value)} />

        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem,_index)=> <div key={""}>
          <p className="answer">{chatItem.role} : {chatItem.parts}</p>
        </div>)}
      </div>
    </div>
  );
};

export default App;
