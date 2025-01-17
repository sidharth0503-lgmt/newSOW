import mercury from "@mercury-js/core";


export const User = mercury.createModel("User", {
  userName: {
    type: "string",   
  },   
  email: {
    type: "string",
    unique: true,  
  },
  password: {
    type: "string",  
    bcrypt: true, 
  },   
  });


