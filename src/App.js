import React ,{Component}from 'react';
import './App.css';
// import creatBrowsHistory from "history/createBrowserHistory"
import {BrowserRouter} from "react-router-dom";
import Routers from "./pages/Routers";


// const history =creatBrowsHistory();

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={}
  }

  render() {
    if (this.state)
      return(
          <BrowserRouter>
            <Routers></Routers>
          </BrowserRouter>
      )
  }
}

export default App;