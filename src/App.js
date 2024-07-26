import { useState } from 'react';
import './App.css';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.jpg');
  const [isAuth, setAuth]=useState(false);

  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://6t9o09yrki.execute-api.us-east-1.amazonaws.com/dev/mars-employees-daily-images/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image

    }).then(async()=>{
      const response = await authenticate (visitorImageName);
      if(response.Message === 'Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, thank you for attanding. Have a great day!`)
      } else {
        setAuth(false);
        setUploadResultMessage(`This Person is not registered.`)
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There is an error during the process. Please try again.')
      console.error(error);
    })

  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://6t9o09yrki.execute-api.us-east-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl, {
      method: 'Get',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
    .then((data) => {
      return data;
    }).catch(error => console.error(error));
  }

  return (
    <div className="App">
      <h2>MARS Facial Recognition Attandance System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => {setAuth(false); setUploadResultMessage('Click on authenticate to verify'); setImage(e.target.files[0])}} />
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      {image && <img src={ image && URL.createObjectURL(image) } alt="Visitor" height={250} width={250} />}
    </div>
  );
}

export default App;
