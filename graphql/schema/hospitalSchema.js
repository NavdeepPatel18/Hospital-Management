const hospitalType = `
type Hospital{
  _id: ID!
  doctor:Doctor!
  name: String!
  email: String!
  number: String!
  location: String
  address: String!
  covidCenter: String!
}
type HospitalPhoto{
  _id: ID!
  name: String!
  photo: String!
  hospital: Hospital!
}

type Facilities{
  _id: ID!
  name: String!
  hospital: Hospital!
}
input HospitalInput {
  name: String!
  email: String!
  number: String!
  location: String
  address: String!
}

input HospitalPhotoInput {
  name: String!
  photo: String!
  hospital: String!
}

input FacilitiesInput {
  name: String!
  hospital: String!
}
`;

exports.hospitalType = hospitalType;
