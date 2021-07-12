const feedbackType = `
type Feedback{
  _id: ID!
  doctor: Doctor
  staff:Staff
  user: User
  givenBy:String!
  feedbackText: String!
  rating: Float!
  createdAt: String!
  updatedAt: String!
} 
`;

exports.feedbackType = feedbackType;
