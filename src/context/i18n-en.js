export default {
  navbar: {
    register: "Register",
    login: "Login",
    lang: "Language",
    logout: "Logout",
  },
  reactTable: {
    previous: "Previous",
    page: (key) => `Page ${key + 1}`,
    row: (number) => `${number} rows`,
    next: "Next",
  },
  login: {
    title: "Login",
    username: "Username",
    usernamePlaceholder: "Enter username",
    password: "Password",
    passwordPlaceholder: "Enter password",
    rememberMe: "Remember me",
    button: "Login",
    required: "This field is required.",
    error: "User doesn't exist or username/password is wrong.",
  },
  register: {
    subtitle: "Register to join SDGs CAMPUS",
    section1: {
      title: "Apply for Account",
      description:
        "The description on the registration page should be revised.",
    },
    section2: {
      title: "Awesome Performances",
      description:
        "Here you can write a feature description for your dashboard, let the users know what is the value that you give them.",
    },
    section3: {
      title: "Global Support",
      description:
        "Here you can write a feature description for your dashboard, let the users know what is the value that you give them.",
    },
    placeholders: {
      firstName: "Your First Name",
      lastName: "Your Last Name",
      department: "Department",
      username: "Username",
      email: "Email",
      password: "Password",
      passwordConfirm: "Password Confirmation",
    },
    image: {
      title: "Staff Card Image",
      select: "Select Image",
      change: "Change",
      remove: "Remove",
    },
    button: "Apply for Free Account",
    required: "This field is required.",
    passwordConfirm:
      "This field is required and should be same as the previous.",
    success: "Register successfully. Account will be validated by Admin ASAP.",
    error: "Oops! Something wrong!",
  },
  sidebar: {
    user: {
      userSetting: "User Setting",
      userUploadRecord: "User Upload Record",
    },
    dashboard: "Dashboard",
    records: "Records",
    upload: "Upload",
  },
  userSetting: {
    title: "Change Password",
    old: "Old Password",
    new: "New Password",
    confirm: "Confirm New Password",
    confirmMessage: "This field should be same as the previous.",
    star: "Required",
    button: "Submit",
    requiredMessage: "This field is required to be filled.",
    successMessage: "Change successfully",
    errorMessage: "Failed!",
  },
  dashboard: {
    arcGisViewer: {
      title: "ArcGIS Viewer",
      all: "Show all",
      placeholder: "Choose",
      selectPlaceholder: "Multiple Options",
      shapeFile: "Shape File",
      pointData: "Point Data",
      sensor: "Sensor",
      plugin: {
        chart: {
          placeholder: {
            startDate: "Start Date",
            endDate: "End Date",
          },
        },
        fileManager: {
          nameField: "Name"
        },
        save: {
          title: "Publish Layers",
          placeholder: "Map Name",
          button: "Save",
          successMessage: (serviceName) => `Successfully publish ${serviceName}`
        }
      },
    },
    recordSection: {
      title: "Records",
      seeAll: "See All",
      updated: (value) => `Updated ${value} days ago`,
    },
  },
  approveDashboard: {
    arcGisViewer: {
      title: "Approve",
      all: "Show all",
      placeholder: "Choose",
      selectPlaceholder: "Multiple Options",
      shapeFile: "Shape File",
      pointData: "Point Data",
      sensor: "Sensor",
      common: "Common",
      plugin: {
        chart: {
          placeholder: {
            startDate: "Start Date",
            endDate: "End Date",
          },
        },
      },
    },
    confirms: {
      validate: (name) => `Are you sure to qualify ${name}?`,
      remove: (name) => `Are you sure to remove ${name}?`,
    },
    notifications: {
      validateSuccess: (name) => `Qualify ${name} successfully.`,
      validateFail: (name) => `Failed to qualify ${name}.`,
      removeSuccess: (name) => `Remove ${name} successfully.`,
      removeFail: (name) => `Failed to remove ${name}.`,
    },
  },
  approveTable: {
    name: "Name",
    type: "Type",
    description: "Description",
    owner: "Owner",
    keyPropertyName: "Kep Property Name"
  },
  upload: {
    title: "Upload File",
    subtitle: "Please follow the rules",
    buttons: {
      back: "BACK",
      next: "NEXT",
      finish: "FINISH",
    },
    step1: {
      tabTitle: "Notice",
      subtitle: "Please read following rules carefully.",
      firstColumn: {
        title: "Template of Electricity",
        description:
          "You can generate the template excel sheet through the widget below. Please follow the format of the excel sheet to fill in data.",
        button: "Generate",
      },
      secondColumn: {
        title: "Template of Green Energy",
        description:
          "You can generate the template excel sheet through the widget below. Please follow the format of the excel sheet to fill in data.",
        button: "Generate",
      },
    },
    step2: {
      tabTitle: "Upload",
      subtitle: "Please fill in the form and upload the file.",
      type: {
        title: "Type",
        placeholder: "- Type -",
        electricity: "Electricity",
        greenEnergy: "Green Energy",
        message: "Required.",
      },
      fileType: {
        title: "File Type",
        placeholder: "- File Type -",
        shapeFile: "Shape File",
        shapeDataFile: "Shape Data File",
        commonFile: "Common file",
        pointFile: "Point File",
        message: "Required.",
      },
      file: {
        title: "File",
        message: "Required.",
      },
      bindingShpName: {
        title: "Binding Shape File Name",
        placeholder: "- Shape File Name -",
        message: "Required.",
      },
      keyProperty: {
        title: "Key Property",
        placeholder: "- Key Property -",
        message: "Required.",
        tooltip: "定義在資料庫的Primary Key，供辨識用之獨一的值"
      },
      xCoord: {
        title: "X Coordinate",
        placeholder: "- X Coordinate -",
        message: "Required.",
      },
      yCoord: {
        title: "Y Coordinate",
        placeholder: "- Y Coordinate -",
        message: "Required.",
      },
      coordinate: {
        title: "Coordinate System",
        placeholder: "- Coordinate System -",
        message: "Required.",
      },
      isPublic: {
        title: "Public/Private",
        placeholder: "- Public/Private -",
        message: "Required.",
      },
      isDownloadable: {
        title: "Downloadable",
        placeholder: "- Downloadable/Not downloadable -",
        message: "Required.",
        downloadable: "Downloadable",
        notDownloadable: "Not downloadable"
      },
      columnSection: {
        header: {
          number: "Number",
          name: "Name",
          format: "Format",
          notice: "Notice",
        },
        formats: {
          string: "String",
          int: "Integer",
          double: "Double",
        },
        buttons: {
          add: "Add",
          edit: "Edit",
          delete: "Delete",
        },
        notice: "Cannot detect the format, please confirm manually.",
        message: "Required.",
        modal: {
          title: "Add field",
          name: "Name",
          namePlaceholder: "Enter name",
          format: "Format",
          formatPlaceholder: "- Format -",
          submit: "Submit",
          close: "Close",
        },
      },
      description: {
        title: "Description",
        placeholder: "Description (for validation)",
        message: "Required.",
      },
      sensor: {
        name: "Project Name",
        data: {
          name: "Sensor Name",
          url: "URL",
          pathVariables: "Path Variables",
          query: "Query",
          contentType: "Content-Type",
          body: "Body",
          X: "X",
          Y: "Y",
          response: "Response (where the data array at)",
          date: "Date is defined in",
          hint: "Please note key \"date\" as \"SENSORDATEFORSDGSCAMPUS\" in query/body e.g. date: \"SENSORDATEFORSDGSCAMPUS\""
        }
      },
      upload: {
        button: "Upload",
        alert: "Did you check all the information?"
      }
    },
    alert: {
      title: "Message",
      process: {
        title: "Processing",
      },
      upload: {
        title: "Uploading",
      },
      success: {
        title: (fileName) => `Upload ${fileName} successfully.`
      }
    },
    notification: {
      normal: "Cloud service is processing the file, please wait...",
      large:
        "The file is a little bit large. Cloud service is processing the file, please wait...",
    },
    failed: "Failed!",
  },
  applicants: {
    title: "Applicants",
    table: {
      username: "Username",
      email: "Email",
      displayName: "Name",
      department: "Department",
      staffCardImage: "Staff Card",
    },
    confirms: {
      validate: (name) => `Are you sure to qualify ${name}?`,
      remove: (name) => `Are you sure to remove ${name}?`,
    },
    notifications: {
      validateSuccess: (name) => `Qualify ${name} successfully.`,
      validateFail: (name) => `Failed to qualify ${name}.`,
      removeSuccess: (name) => `Remove ${name} successfully.`,
      removeFail: (name) => `Failed to remove ${name}.`,
    },
  },
};
