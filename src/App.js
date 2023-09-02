import React, {Component} from 'react';
import './App.css';
import Part from './component/particles/particles';
import Navigation from './component/navigation/navigation';
import Login from './component/login/login';
import Register from './component/register/register';
import Logo from './component/logo/logo';
import ImageLinkForm from './component/imagelinkform/imagelinkform';
import Rank from './component/rank/rank';
import FaceRecognize from './component/facerecognize/facerecognize';

const PAT = 'e3e2e57c46984160bfd4a496e0abe5ec';

const USER_ID = 'chrissmith';       
const APP_ID = 'test';

const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
  

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageUrl: '',
            box: {},
            route: 'login',
            isSignedIn: false,
            user: {
                id: '',
                name: '',
                email: '',
                entries: '',
                joined: ''
            }
        }

    }

   loadUser = (data) => {
        this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined  
        }})
    }

    calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
          
     return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height),
        
     }   
    }
    

    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = (event) => {
        this.setState({imageUrl: this.state.input});
        const IMAGE_URL = this.state.input;
        
        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });
         
        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };
        
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(response => { 
        this.displayFaceBox(this.calculateFaceLocation(response));
        if (response) {
            fetch('http://localhost:3000/image', {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                id: this.state.user.id
                                    })
            }) //belső fetché
            .then(response => response.json())
            .then(count => {
                this.setState(Object.assign(this.state.user, {entries: count}))
                    
            })
            
        }
        
    })
    
    .catch(error => console.log('error', error))

    }

    displayFaceBox = (box) => {
        this.setState({box: box});
        }

    onRouteChange = (route) => {
        if ( route === 'signout') {
            this.setState({isSignedIn: false})
        } else if ( route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }    


    render() {
    return (
      <div className="App">
      <Part />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
      {this.state.route === 'home'  
      ? <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm 
        onInputChange={this.onInputChange} 
        onButtonSubmit={this.onButtonSubmit} 
        />
        <FaceRecognize box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    :   (
        this.state.route === 'login' 
        ? <Login loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
        

    }
    
    </div>
    )
  }
}

export default App;
