import "./App.css";
import { useState } from "react";
import Tesseract from "tesseract.js";

function App() {
  const [file, setFile] = useState();
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [result, setResult] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processImage = () => {
    setResult("");
    setProgress(0);
    Tesseract.recognize(file, language, {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(m.progress);
        }
      },
    }).then(({ data: { text } }) => {
      setResult(text);
    });
  };
  return (
    <div className="App">
      <input type="file" onChange={onFileChange} />
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="eng">English</option>
        <option value="ara">Arabic</option>
        <option value="deu">German</option>
        <option value="ind">Indonesia</option>
      </select>
      <div style={{ marginTop: 25 }}>
        <input type="button" value="Submit" onClick={processImage} />
      </div>
      <div>
        <progress value={progress} max={1} />
      </div>
      <div style={{fontsize: 25, color:"teal"}}>Result:</div>
      {result !== "" && (
        <div style={{ marginTop: 20, fontSize: 20, color: "black" }}>
          {result}
        </div>
      )}
    </div>
  );
}

export default App;
