import React from "react";
import {Route} from "react-router-dom";
import Index from "./index";
import ShowData from "./showData";
import HomePage from "./HomePage"



export default class Routers extends React.Component{
    constructor(props){
        super(props);
        this.state={}
    }
    render() {
        return(
            <div>
                <Route exact path={'/'} component={Index}/>
                <Route exact path={'/ShowData'} component={ShowData}/>
                <Route exact path={'/page'} component={HomePage}/>
            </div>
        )
    }
}