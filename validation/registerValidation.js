 const Validator = require("Validator");
 const isEmpty = require('./isEmpty');
 


 

 const ValidateRegisterInput = (data) =>{
    let errors ={};

    if(isEmpty(data.email)){
        errors.email = "This field is required";
    }else if(!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }

    if (isEmpty(data.password)) {
        errors.password = " password required";
    } 
    
    

    //check confirm password
    if (isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "This field is empty";
    } else if (!Validator.equals(data.password, data.confirmPassword)) 
    {errors.confirmPassword = "password and confirm password must match";
        
    }
    return {
        errors,
        isValid:isEmpty(errors),
    }
 };

  module.exports = ValidateRegisterInput;