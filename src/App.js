
import { useCallback, useEffect, useState } from 'react';
import * as ml5 from 'ml5';
import './App.css';

function App() {

  const [imageUrl, setImageUrl] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [classificationResult, setClassificationResult] = useState('');

  const fetchImage = useCallback(async() => {
    setModelLoaded(false);
    return fetch(`https://picsum.photos/600/500`).then((response) => {
        setImageUrl(response.url);
        classifyImage();
      });
  }, [])

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const onNextImage = async(e) => {
    e.preventDefault();
    setImageUrl('');
    await fetchImage();
    
  }

  const classifyImage = async() => {
    const classifier = await ml5.imageClassifier('MobileNet');
    const image = document.getElementById('image');
    setModelLoaded(true);
    classifier.classify(image, (err, results) => {
      if(err) {
        setClassificationResult('An error occurred while processing the request. Please try again.');
      } else {
        if(results && results.length) {
          const result = results[0];
          setClassificationResult(`The app is ${result.confidence * 100}% that this is ${result.label}.`);
        } else {
          setClassificationResult('Result not available.');
        }
        
      }
      
    });
  }

  return (
    <div className="App">
     <h1>ML5 Image Classification</h1>
     {
       imageUrl ? (
         
         <div className="container">
             <section>
                <img id="image" src={imageUrl} alt="random" crossOrigin="anonymous"/>
                <button type="button" onClick={(e) => onNextImage(e)}>Next</button>
             </section>
             <section className="result">
                {
                  modelLoaded ? (
                    <span>
                    <b>
                    {classificationResult}
                    </b>
                      
                    </span>
                  ) : (
                    <span>
                      Classification in progress...
                    </span>
                  )
                }
             </section>
             
        </div>
       
        
       ) : (
         <div>
           Loading...
         </div>
       )
     }
    </div>
  );
}

export default App;
