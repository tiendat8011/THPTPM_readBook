const pathUsers = {
  post: {
    tags: ["Users"],
    summary: "Create new user",
    parameters: [
      {
        name: "user",
        in: "body",
        description: "User with new values of properties",
        required: true,
        schema: {
          $ref: "#/definitions/User",
        },
      },
    ],
    responses: {
      200: {
        description: "New user created",
        schema: {
          $ref: "#/definitions/User",
        },
      },
      405: { description: "Invalid input" },
    },
  },
  get: {
    tags: ["Users"],
    summary: "Get all user",
    responses: {
      200: {
        description: "OK",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
};

const pathUserInfo = {
  get: {
    tags: ["Users"],
    summary: "Get me",
    responses: {
      200: {
        description: "User is found",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
}

const pathSetAdmin = {
  patch: {
    tags: ["Users"],
    summary: "Change User Type",
    responses: {
      200: {
        description: "OK",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
      404: { description: "No no no" },
    },
    security: [
      {
        token: [],
      },
    ],
  },
}

const pathUsersId = {
  parameters: [
    {
      name: "userId",
      in: "path",
      required: true,
      description: "ID of user that we want to find",
      type: "string",
    },
  ],
  get: {
    tags: ["Users"],
    summary: "Get user with given ID",
    responses: {
      200: {
        description: "User is found",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    },
  },
  delete: {
    summary: "Delete user with given ID",
    tags: ["Users"],
    responses: {
      200: {
        description: "User is deleted",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
  put: {
    summary: "Update user with give ID",
    tags: ["Users"],
    parameters: [
      {
        name: "user",
        in: "body",
        description: "User with new values of properties",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    ],
    responses: {
      200: {
        description: "User is updated",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
};

const pathUserLogin = {
  post: {
    tags: ["Users"],
    summary: "User login",
    parameters: [
      {
        name: "user",
        in: "body",
        description: "The email and password for login",
        required: true,
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              default: "string@gmail.com",
            },
            password: { type: "string", default: "String1234" },
          },
        },
      },
    ],
    responses: {
      200: {
        description: "Login successfully",
        schema: {
          type: "object",
          properties: {
            // message: {
            //   type: "string"
            // },
            token: { type: "string" },
          },
        },
      },
      404: { description: "Email or password incorrect" },
    },
  },
};

const pathUserUploadAvatar = {
  post: {
    tags: ["Users"],
    summary: "User upload an image for avatar",
    consumes: ["multipart/form-data"],
    parameters: [
      {
        name: "avatar",
        in: "formData",
        description: "File image to upload",
        required: true,
        type: "file",
      },
    ],
    responses: {
      200: {
        description: "Upload successfully",
        schema: {
          type: "object",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
  delete: {
    tags: ["Users"],
    summary: "Delete avatar",
    consumes: ["multipart/form-data"],
    responses: {
      200: {
        description: "OK",
        schema: {
          type: "object",
        },
      },
    },
    security: [
      {
        token: [],
      },
    ],
  },
};

const definitionPassword = {
  type: "object",
  required: ["oldPassword", "newPassword"],
  properties: {
    oldPassword: {
      type: "string",
      default: "String1234"
    },
    newPassword: {
      type: "string",
      default: "String1234"
    },
  },
};

const definitionConfirmCode = {
  type: "object",
  required: ["confirmCode"],
  properties: {
    confirmCode: {
      type: "string",
      default: ""
    },
    email: {
      type: "string",
      default: "abc@gmail.com"
    }
  },
}

const pathConfirmCode = {
  patch: {
    tags: ["Users"],
    summary: "Confirm User",
    parameters: [
      {
        name: "body",
        in: "body",
        description: "Confirm user",
        required: true,
        schema: definitionConfirmCode,
      },
    ],
    responses: {
      200: {
        description: "Confirm successfully",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
      404: { description: "password incorrect" },
    },
    security: [
      {
        token: [],
      },
    ],
  },
}

const pathResendConfirmCode = {
  post: {
    tags: ["Users"],
    summary: "Resend confirm code",
    parameters: [
      {
        name: "user",
        in: "body",
        description: "The email user need confirm",
        required: true,
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              default: "string@gmail.com",
            },
          },
        },
      },
    ],
    responses: {
      200: {
        description: "Resend successfully",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string"
            },
          },
        },
      },
      404: { description: "Send fail" },
    },
  }
}
const pathUserPassword = {
  patch: {
    tags: ["Users"],
    summary: "Change User password",
    parameters: [
      {
        name: "body",
        in: "body",
        description: "Change password",
        required: true,
        schema: definitionPassword,
      },
    ],
    responses: {
      200: {
        description: "Login successfully",
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
      404: { description: "password incorrect" },
    },
    security: [
      {
        token: [],
      },
    ],
  },
};

const definitionUser = {
  type: "object",
  required: ["email", "password", "password2", "fullName", "dayOfBirth", "phoneNumber"],
  properties: {
    email: {
      type: "string",
      default: "string@gmail.com",
    },
    password: {
      type: "string",
      default: "String1234",
    },
    password2: {
      type: "string",
      default: "String1234",
    },
    fullName: {
      type: "string",
    },
    dayOfBirth: {
      type: "string",
      default: "02/09/2000"
    },
    phoneNumber: {
      type: "string",
      default: "0393949568"
    }
  },
};

module.exports = {
  pathUsers,
  pathUsersId,
  pathUserLogin,
  pathUserUploadAvatar,
  definitionUser,
  pathUserPassword,
  definitionPassword,
//   definitionConfirmCode,
  pathUserInfo,
  pathSetAdmin,
//   pathConfirmCode,
//   pathResendConfirmCode
};
