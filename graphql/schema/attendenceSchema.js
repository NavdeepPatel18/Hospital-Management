const attendenceType = `
input AttendenceInput{
  staff: String!
  timeIn: String
  timeOut: String
}
type Attendence{
  _id: ID!
  doctor: Doctor!
  staff: Staff!
  timeIn: String
  timeOut: String
}

type Day{
  _id: ID!
  name: String!
  avability: [Avability!]!
}

type Avability{
  _id: ID!
  doctor: Doctor!
  slot: String!
  day: Day!
}
`;

exports.attendenceType = attendenceType;
