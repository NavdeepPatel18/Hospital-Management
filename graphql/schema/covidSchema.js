const covidType = `
type CovidCenter{
  _id: ID!
  totalbed: Int!
  oxygen: Int!
  ventilator: Int! 
  vacantbed:Int!
  icubed:Int!
}
type CovidBooking{
  _id: ID!
  user: User!
  center: CovidCenter!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String!
  dateOut: String!
}
input CovidCenterInput{
  totalbed: Int!
  oxygen: Int!
  ventilator: Int! 
  vacantbed:Int!
  icubed:Int! 
}

input CovidBookingInput{
  center: String!
  bedno: Int!
  oxygen: Boolean!
  ventilator: Boolean!
  dateIn: String!
  dateOut: String
}
`;

exports.covidType = covidType;
