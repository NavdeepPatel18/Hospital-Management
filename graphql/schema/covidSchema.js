const covidType = `
type CovidCenter{
  _id: ID!
  hospital: Hospital!
  totalbed: Int!
  oxygen: Boolean!
  ventilator: Boolean! 
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
  hospital: String!
  totalbed: Int!
  oxygen: Boolean!
  ventilator: Boolean! 
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
