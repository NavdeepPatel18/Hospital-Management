const appoinmentType = `
type Appoinment{
  _id: ID!
  doctor: Doctor!
  staff:Staff
  user: User!
  name:String!
  age:Int!
  gender:String!
  phone:String!
  address:String!
  token:Float!
  problem: String!
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  slot: String!
  acceptedby: String
  appoinmentstatus:String
  status: String
  userstatus:String
  statusDate: String
  createdAt: String!
  updatedAt: String!
}

input AppoinmentInput{
  doctor: String!
  name:String!
  age:Int!
  gender:String!
  phone:String!
  address:String!
  problem: String
  bp: Float
  caseType: String!
  suger: Float
  allergy: String
  history: String
  date: String!
  slot: String!
}

`;

exports.appoinmentType = appoinmentType;
