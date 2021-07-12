const reviewType = `
type Review{
  _id: ID!
  doctor: Doctor!
  user: User!
  appoinment:Appoinment
  covidappoinment: CovidAppoinment
  appoinmentType:String!
  text: String!
  rating: Int!
  createdAt: String!
  updatedAt: String!
} 
input ReviewInput{
  doctor: String!
  appoinment:String!
  text: String!
  rating: Int!
}
`;

exports.reviewType = reviewType;
