import mercury from "@mercury-js/core"
const rules =[

{
    modelName: "User",
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
  {
    modelName: "Detail",
    access: {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
  },
]
export const EmployeeProfile = mercury.access.createProfile("ADMIN", rules);