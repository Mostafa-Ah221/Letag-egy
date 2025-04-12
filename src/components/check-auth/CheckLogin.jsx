import { useContext } from "react";
import { ContextData } from "../../context/ContextApis";
import Login from "../Login/Login";
import MobileAuthentication from "../Login/MobileAuthentication";
import LoadingIndicator from "../Loading/LoadingIndicator";

export default function CheckLogin() {
    const { registr_system} = useContext(ContextData);


    if (!registr_system) {
        return <LoadingIndicator/>;  
    }
    if (registr_system === "default") {
        return <Login/>
    }
    if (registr_system === "phone"){
       return <MobileAuthentication/>
    }
   return null;
}
