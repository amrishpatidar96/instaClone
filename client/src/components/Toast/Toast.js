import React,{ useEffect, useState } from "react"
import { Button, Toast, ToastBody } from 'reactstrap';
 const ToastNew = (props)=>{

    const [show,setShow] = useState(false);

    useEffect(()=>{
       // console.log("use");
        setShow(props.show);
        let timeout = setTimeout(()=>{setShow(false)},15000)

        return ()=>{
            clearTimeout(timeout);
        }
    },[])

    return (
    <Toast isOpen={show} style={{backgroundColor: props.color || 'green' ,width:'280px',height:'150px'}}>
        <ToastBody >
            <h6 style={{color:'white',display:'inline',marginRight:'20px'}}>{props.message}</h6>  
            <Button onClick={()=>{setShow(false)}}>X</Button>
        </ToastBody>
      </Toast>)


}
export default ToastNew;