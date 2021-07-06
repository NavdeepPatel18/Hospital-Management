const attendenceType = `
type Attendence{
  _id: ID!
  doctor: Doctor
  staff: Staff
  status: String!
}

type Slot{
  _id: ID!
  slot: [String!]!
  day: String!
  createdAt: String!
  updatedAt: String!
}
`;

exports.attendenceType = attendenceType;
