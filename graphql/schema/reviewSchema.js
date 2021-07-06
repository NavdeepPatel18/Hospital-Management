const reviewType = `
type Review{
  _id: ID!
  doctor: Doctor!
  user: User!
  text: String!
  rating: Int!
  createdAt: String!
  updatedAt: String!
} 
input ReviewInput{
  doctor: String!
  text: String!
  rating: Int!
}
`;

exports.reviewType = reviewType;
