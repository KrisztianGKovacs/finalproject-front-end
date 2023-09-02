import React from "react";
import './facerecognize.css';

const FaceRecognize = ( { imageUrl, box } ) => {
    //console.log(this.box.value);
    const boundingBoxStyle = {
        top: box.topRow,
        right: box.rightCol,
        bottom: box.bottomRow,
        left: box.leftCol
    };
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
            <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto' />
            <div className='bounding-box' style={boundingBoxStyle} ></div>
            </div>
            
        </div>
    );
}

export default FaceRecognize;