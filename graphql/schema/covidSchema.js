const covidType = `
type CovidCenter{
  _id: ID!
  totalbed: Int!
  oxygen: Int!
  ventilator: Int! 
  vacantbed:Int!
  icubed:Int!
}
type CovidAppoinment{
  _id: ID!
  doctor: Doctor!
  staff: Staff
  user: User!
  center: CovidCenter!
  name: String!
  age: Int
  gender: String
  phone: String!
  address: String
  token: Float!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String
  dateOut: String
  acceptedby: String!
  appoinmentstatus: String!
  status: String!
  userstatus: String!
  statusDate: String
}
input CovidCenterInput{
  totalbed: Int!
  oxygen: Int!
  ventilator: Int! 
  vacantbed:Int!
  icubed:Int! 
}

input CovidAppoinmentInput{
  doctor: String!
  user: String!
  center: String!
  name: String!
  age: Int!
  gender: String!
  phone: String!
  address: String!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String!
  dateOut: String!
}
`;

exports.covidType = covidType;
