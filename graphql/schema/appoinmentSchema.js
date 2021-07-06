const appoinmentType = `
type Appoinment{
  _id: ID!
  doctor: Doctor
  user: User!
  problem: String
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  time: String!
  tocken: Int!
  conformby: String
  status: String
  statusDate: String
}

input AppoinmentInput{
  doctor: String!
  problem: String
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  time: String!
  tocken: Int!
}
`;

exports.appoinmentType = appoinmentType;
