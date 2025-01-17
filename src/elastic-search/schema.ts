export const typeDefs = `
type Query {
hello(name:String) : String
}
type Mutation {
    signUp(signUpData: signUpInput): signUpResponse
    login(email: String!, password: String!): LoginResponse
  }

  # Response types for login and sign up
  type LoginResponse {
    msg: String
    token: String
    user: String
    userName: String
  }

  type signUpResponse {
    id: String
    msg: String  
    
  } 
  
  input signUpInput {
    userName: String!
    email: String!
    password: String!
   
  }
`;



