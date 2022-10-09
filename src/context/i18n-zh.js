export default {
  navbar: {
    register: "註冊",
    login: "登入",
    lang: "語言",
    logout: "登出",
  },
  reactTable: {
    previous: "上一頁",
    page: (key) => `第${key + 1}頁`,
    row: (number) => `${number}列`,
    next: "下一頁",
  },
  login: {
    title: "登入",
    username: "帳號",
    usernamePlaceholder: "請輸入帳號",
    password: "密碼",
    passwordPlaceholder: "請輸入密碼",
    rememberMe: "記住我",
    button: "登入",
    required: "此欄位為必填",
    error: "帳號不存在或帳號密碼錯誤",
  },
  register: {
    subtitle: "加入 SDGs CAMPUS",
    section1: {
      title: "申請帳戶",
      description: "限於台大行政人員、教師和學生。",
    },
    section2: {
      title: "極佳的效率",
      description:
        "Here you can write a feature description for your dashboard, let the users know what is the value that you give them.",
    },
    section3: {
      title: "技術支持",
      description:
        "Here you can write a feature description for your dashboard, let the users know what is the value that you give them.",
    },
    placeholders: {
      firstName: "名字",
      lastName: "姓氏",
      department: "部門",
      username: "帳號",
      email: "Email",
      password: "密碼",
      passwordConfirm: "確認密碼",
    },
    image: {
      title: "證件照片",
      select: "選擇照片",
      change: "更換",
      remove: "移除",
    },
    button: "申請帳號",
    required: "此欄位為必填",
    passwordConfirm: "此欄位為必填以及與上一欄相同",
    success: "註冊成功，管理員會盡快審核您的帳號",
    error: "出錯了！",
  },
  sidebar: {
    user: {
      userSetting: "使用者設定",
      userUploadRecord: "使用者上傳紀錄",
    },
    dashboard: "主頁",
    records: "紀錄",
    upload: "上傳",
  },
  userSetting: {
    title: "密碼變更",
    old: "舊密碼",
    new: "新密碼",
    confirm: "確認新密碼",
    confirmMessage: "此欄為必填以及必須與上一欄相符",
    star: "必填",
    button: "更改",
    requiredMessage: "此欄為必填",
    successMessage: "更改成功",
    errorMessage: "更改失敗",
  },
  dashboard: {
    arcGisViewer: {
      title: "ArcGIS 瀏覽器",
      all: "展示全部",
      placeholder: "請選擇",
      selectPlaceholder: "多選",
      shapeFile: "Shape File",
      pointData: "Point Data",
      sensor: "Sensor",
      plugin: {
        chart: {
          placeholder: {
            startDate: "開始日期",
            endDate: "結束日期",
          },
        },
        fileManager: {
          nameField: "名稱"
        },
        save: {
          title: "發佈Layers",
          placeholder: "Map名稱",
          button: "儲存",
          successMessage: (serviceName) => `成功發佈${serviceName}`
        }
      },
    },
    recordSection: {
      title: "紀錄",
      seeAll: "查看全部",
      updated: (value) => `更新於${value}天前`,
    },
  },
  approveDashboard: {
    arcGisViewer: {
      title: "待同意資料",
      all: "Show all",
      placeholder: "請選擇",
      selectPlaceholder: "多選",
      shapeFile: "Shape File",
      pointData: "Point Data",
      sensor: "Sensor",
      common: "Common file",
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
      validate: (name) => `確定給予 ${name} 通過？`,
      remove: (name) => `確定移除 ${name}？`,
    },
    notifications: {
      validateSuccess: (name) => `成功審核 ${name}`,
      validateFail: (name) => `審核 ${name} 失敗`,
      removeSuccess: (name) => `成功移除 ${name}`,
      removeFail: (name) => `移除 ${name} 失敗`,
    },
  },
  approveTable: {
    name: "檔案名",
    type: "檔案類型",
    description: "描述",
    owner: "擁有者",
    keyPropertyName: "關鍵屬性"
  },
  upload: {
    title: "上傳資料",
    subtitle: "請務必遵照規定格式",
    buttons: {
      back: "上一步",
      next: "下一步",
      finish: "完成",
    },
    step1: {
      tabTitle: "注意事項",
      subtitle: "請詳讀以下資料格式相關注意事項。",
      firstColumn: {
        title: "電力樣板",
        description:
          "你可以透過下面的工具來產生樣版的Excel檔，請按照規定的格式去填寫資料。",
        button: "生成",
      },
      secondColumn: {
        title: "能源樣板",
        description:
          "你可以透過下面的工具來產生樣版的Excel檔，請按照規定的格式去填寫資料。",
        button: "生成",
      },
    },
    step2: {
      tabTitle: "上傳",
      subtitle: "請詳填空格並上傳資料。",
      type: {
        title: "種類",
        placeholder: "- 種類 -",
        electricity: "電力",
        greenEnergy: "綠能",
        message: "必選",
      },
      fileType: {
        title: "檔案種類",
        placeholder: "- 資料格式 -",
        shapeFile: "Shape File",
        shapeDataFile: "Shape Data File",
        commonFile: "Common file",
        pointFile: "Point File",
        message: "必選",
      },
      file: {
        title: "檔案",
        message: "必上傳",
      },
      bindingShpName: {
        title: "欲融合之Shape File名稱",
        placeholder: "- Shape File名稱 -",
        message: "必選",
      },
      keyProperty: {
        title: "關鍵屬性",
        placeholder: "- 關鍵屬性 -",
        message: "必填選",
        tooltip: "定義在資料庫的Primary Key，供辨識用之獨一的值"
      },
      xCoord: {
        title: "X座標",
        placeholder: "- X座標 -",
        message: "必選",
      },
      yCoord: {
        title: "Y座標",
        placeholder: "- Y座標 -",
        message: "必選",
      },
      coordinate: {
        title: "座標系統",
        placeholder: "- 座標系統 -",
        message: "必選",
      },
      isPublic: {
        title: "公開?",
        placeholder: "- 公開? -",
        message: "必選",
      },
      isDownloadable: {
        title: "可下載?",
        placeholder: "- 可下載/不可下載 -",
        message: "必選",
        downloadable: "可下載",
        notDownloadable: "不可下載"
      },
      columnSection: {
        header: {
          number: "編號",
          name: "名稱",
          format: "值格式",
          notice: "注意",
        },
        formats: {
          string: "文字",
          int: "整數",
          double: "浮點數",
        },
        buttons: {
          add: "新增",
          edit: "編輯",
          delete: "刪除",
        },
        notice: "偵測不到值，請手動確認",
        message: "必填",
        modal: {
          title: "新增欄位",
          name: "名稱",
          namePlaceholder: "輸入名稱",
          format: "值格式",
          formatPlaceholder: "- 值格式 -",
          submit: "確認",
          close: "關閉",
        },
      },
      description: {
        title: "描述",
        placeholder: "簡短描述 (供審核使用)",
        message: "必填",
      },
      sensor: {
        name: "專案名稱",
        data: {
          name: "Sensor名稱",
          url: "URL",
          pathVariables: "Path Variables",
          query: "Query",
          contentType: "Content-Type",
          body: "Body",
          X: "X",
          Y: "Y",
          response: "Response (data array所在位置))",
          date: "日期被定義在",
          hint: "請在query/body裡加\"date\" key為\"SENSORDATEFORSDGSCAMPUS\" e.g. date: \"SENSORDATEFORSDGSCAMPUS\""
        }
      },
      upload: {
        button: "上傳",
        alert: "確認資料皆無誤?"
      }
    },
    alert: {
      title: "訊息",
      process: {
        title: "處理中...",
      },
      upload: {
        title: "上傳中...",
      },
      success: {
        title: (fileName) => `上傳 ${fileName} 成功.`
      },
      failed: "失敗",
    },
    notification: {
      normal: "檔案正在雲端處理中，好了會說喔！",
      large: "檔案稍大，正在雲端努力處理中，會花些時間，好了會說喔！",
    },
    failed: "失敗",
  },
  applicants: {
    title: "申請人",
    table: {
      username: "帳號",
      email: "Email",
      displayName: "姓名",
      department: "部門",
      staffCardImage: "職員證",
    },
    confirms: {
      validate: (name) => `確定給予 ${name} 通過？`,
      remove: (name) => `確定移除 ${name}？`,
    },
    notifications: {
      validateSuccess: (name) => `成功審核 ${name}`,
      validateFail: (name) => `審核 ${name} 失敗`,
      removeSuccess: (name) => `成功移除 ${name}`,
      removeFail: (name) => `移除 ${name} 失敗`,
    },
  },
};
