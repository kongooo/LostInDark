import React from "react";
import "../css/loading.css";

const Loading = () => {
  return (
    <React.Fragment>
      <div className="cl-papa">
        <div className="cl-anima">
          <svg style={{ width: 150, height: 150 }}>
            <path
              fill="rgb(191,214,239)"
              stroke="rgb(153,180,203)"
              strokeWidth="2"
              d="M 5 55 
                        A 50 50 0 0 1 105 55     
                        C 105 67, 95 70, 90, 70  
                        H 20     
                        C 15 70, 5 67, 5 55  
                        Z"
            ></path>
            <line
              x1="45"
              x2="35"
              y1="40"
              y2="35"
              stroke="rgb(93,116,137)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="65"
              x2="75"
              y1="40"
              y2="35"
              stroke="rgb(93,116,137)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="45"
              x2="45"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="65"
              x2="65"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="load-shadow"></div>
      </div>

      <div className="cl-ko">
        <div className="cl-anima">
          <svg style={{ width: 150, height: 150 }}>
            <path
              id="child"
              fill="rgb(245,238,207)"
              stroke="rgb(232,204,159)"
              strokeWidth="2"
              d="M 5 55 
                                A 50 50 0 0 1 105 55     
                                C 105 67, 95 70, 90, 70  
                                H 20     
                                C 15 70, 5 67, 5 55  
                                Z"
            ></path>
            <circle cx="30" cy="55" r="8" fill="rgb(255, 222, 77)"></circle>
            <circle cx="80" cy="55" r="8" fill="rgb(255, 222, 77)"></circle>
            <line
              x1="45"
              x2="45"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="65"
              x2="65"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="load-shadow"></div>
      </div>

      <div className="cl-mama">
        <div className="cl-anima">
          <svg style={{ width: 150, height: 150 }}>
            <path
              fill="rgb(166,208,210)"
              stroke="rgb(86,159,167)"
              strokeWidth="2"
              d="M 5 55 
                            A 50 50 0 0 1 105 55     
                            C 105 67, 95 70, 90, 70  
                            H 20     
                            C 15 70, 5 67, 5 55  
                            Z"
            ></path>
            <circle cx="30" cy="55" r="8" fill="rgb(247, 166, 176)"></circle>
            <circle cx="80" cy="55" r="8" fill="rgb(247, 166, 176)"></circle>
            <line
              x1="45"
              x2="45"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="65"
              x2="65"
              y1="40"
              y2="57"
              stroke="rgb(77,77,77)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="load-shadow"></div>
      </div>
    </React.Fragment>
  );
};

export default Loading;
