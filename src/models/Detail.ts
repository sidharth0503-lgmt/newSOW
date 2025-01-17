import mercury from "@mercury-js/core";

export const Detail = mercury.createModel("Detail", {
  createdBy:{
    type:"relationship",
    ref:"User"
  },
  resourceId: {
    type: "string",
    require: true,
    unique: true,
  },
  employeeId: {
    type: "string",

    
  },
  resourceName: {
    type: "string",

    require: true,
  },
  dateOfJoin: {
    type: "string",

    require: true,
  },
  sowStartDate: {
    type: "string",

    require: true,
  },
  sowEndDate: {
    type: "string",

    require: true,
  },
  invoiceAmt: {
    type: "number",
    require:true,
    default: 0,
  },
  currency: {
    type: "enum",
    enumType: "string",
    enum: ['USD', 'INR'],
    default: 'USD',
    require:true
  },
  vendorName: {
    type: "enum",
    enumType: "string",

    enum: ['Siyaton', 'Niktor', 'SamSoft', 'Vithi', 'Vithi_LLC', 'CamAmp'],
    require: true,
  },
  referredBy: {
    type: "string",

  },
  referredCode: {
    type: "string",

  },
  employeeType: {
    type: "enum",
    enumType: "string",

    enum: ['Full_Time', 'Part_Time'],
    default: 'Full_Time',
    require:true
  },
  employeeName: {
    type: "enum",
    enumType: "string",

    enum: ['Siyaton', 'Niktor', 'Vithi', 'Vithi_LLC'],
    require: true,
  },
  reportingManager: {
    type: "enum",
    enumType: "string",


    enum: ['VenkatB', 'VikramB', 'VikramR', 'MurthyV', 'Surya', 'Roshan', 'Trivikram', 'VimalR', 'AbhinavG' ,'Siddu','Sudheer','Satish'],
    default: 'Surya',
    require:true
  },
  clients: {
    type: "enum",
    enumType: "string",

    enum: ["ResMed", 'Granite', 'CalAmp', 'Vithi', 'SolvenTek', 'WAL'],
    default: 'ResMed',
    require:true
  },
  reminder: {
    type: "boolean",
    require:true
  },
  statusCode: {
    type: "enum",
    enumType: "string",
    enum: ['Active', 'Inactive', 'Hold'],
    default: 'Active',
    require:true
  },
  comments: {
    type: "string",

  },
});
