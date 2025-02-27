import React, { useState, useEffect,useReducer,useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";

const emailReducer=(state,action)=>{
  if(action.type==='USER_INPUT'){
    return{value:action.val,isValid:action.val.includes('@')}
  }
  if(action.type==='INPUT_BLUR'){
    return{value:state.value,isValid:state.value.includes('@')}
  }
  return{value:'',isValid:false}
}

const passwordReducer=(state,action)=>{
  if(action.type==='enteredPassword'){
    return{value:action.val,isValid:action.val.trim().length > 6}
  }
  if(action.type==='INPUT_BLUR'){
    return{value:state.val,isValid:state.value.trim().length > 6}
  }
  return{value:'',isValid:false}
}

const Login = (props) => {
  const authCtx=useContext(AuthContext)
  // const [enteredEmail, setEnteredEmail] = useState("");
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState("");
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [emailState,dispatchEmail]=useReducer(emailReducer,{value:'',isValid:null})
  const [passwordState,dispatchPassword]=useReducer(passwordReducer,{value:'',isValid:null})
  const [formIsValid, setFormIsValid] = useState(false);

  // useEffect(()=>{
  //   console.log('Effect Running')
  // },[])

  const{isValid:emailIsValid}=emailState
  const{isValid:passwordIsValid}=passwordState

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setFormIsValid(
      emailIsValid && passwordIsValid
    );

    return ()=>{
       clearTimeout(timer)
    }
    },500)

  },[emailIsValid,passwordIsValid])
 



  const emailChangeHandler = (event) => {
    // setEnteredEmail(event.target.value);
    dispatchEmail({type:'USER_INPUT',val:event.target.value})

    setFormIsValid(
      event.target.value.includes('@')&& passwordState.isValid
      // enteredEmail.includes("@") && enteredPassword.trim().length > 6
    );
  };

  const passwordChangeHandler = (event) => {
    // setEnteredPassword(event.target.value);
    dispatchPassword({type:'enteredPassword',val:event.target.value})

    setFormIsValid(
      emailState.isValid&& passwordState.isValid
    );
  };

  const validateEmailHandler = () => {
    // setEmailIsValid(emailState.isValid);
    dispatchEmail({type:'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type:'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
