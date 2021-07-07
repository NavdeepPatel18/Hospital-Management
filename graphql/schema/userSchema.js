const userType = `
type User{
  _id: ID!
  name: String!
  city: String
  address: String
  email: String!
  password: String
  age: Int
  gender: String
  phone: String!
  createdAt: String!
  updatedAt: String!
}
type UserAuthData{
  userId: ID!
  token: String!
  userType: String!
}
input UserInput{
  name: String!
  city: String!
  address: String!
  email: String!
  password: String
  age: Int!
  gender: String!
  phone: String!
}
`;

exports.userType = userType;
