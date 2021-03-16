import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ReactGL} from './ReactGL';
import {Rect} from './shapes/Rect';
import '../css/main.css';

function DrawCanvas(){
    return (
        <ReactGL width={document.body.clientWidth} height={document.body.clientHeight}>
            {[<Rect></Rect>]}
        </ReactGL>
    )
}

ReactDOM.render(<DrawCanvas/>, document.querySelector('#root'));