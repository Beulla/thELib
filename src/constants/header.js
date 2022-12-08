import { render } from "@testing-library/react";
import { Fragment } from "react";
import "./header.css"
import logo from "../logo.png"
export default function Header(){
    return(
        <Fragment>
            <div id="header">
            <img src={logo}/>
            </div>
        </Fragment>
    )
}