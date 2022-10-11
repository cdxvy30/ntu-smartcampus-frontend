/*!

=========================================================
* Light Bootstrap Dashboard PRO React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-pro-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/Dashboard.js";
import ApproveDashboard from "views/ApproveDashboard";
import Wizard from "views/Forms/Wizard/Wizard.js";
import PublishStatusTable from "views/Tables/PublishStatusTable.js";
import DataTables from "views/Tables/DataTables.js";
import ApplicantsTable from "views/Tables/ApplicantsTable";
import ApproveTables from "views/Tables/ApproveTables.js";
import ApproveCommonTables from "views/Tables/ApproveCommonTables.js";
import ApprovePublishTables from "views/Tables/ApprovePublishTable.js"
import UserPage from "views/Pages/UserPage.js";
import LoginPage from "views/Pages/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";

import IPCSData from "views/IPCSData";
// import WMTSMap from "";

var routes = [
  {
    collapse: true,
    path: "/user",
    name: "User",
    zhName: "使用者",
    state: "openUser",
    icon: "nc-icon nc-satisfied",
    views: [
      {
        path: "/user-page",
        layout: "/admin",
        name: "User Setting",
        zhName: "使用者設定",
        mini: "UP",
        component: UserPage,
        adminOnly: false
      },
    ],
    adminOnly: false
  },
  {
    path: "/dashboard",
    layout: "/admin",
    name: "Dashboard",
    zhName: "主頁",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    adminOnly: false
  },
  {
    path: "/upload",
    layout: "/admin",
    name: "Upload",
    zhName: "上傳",
    icon: "nc-icon nc-cloud-upload-94",
    component: Wizard,
    adminOnly: false
  },
  {
    path: "/publish-status",
    layout: "/admin",
    name: "Publish Status",
    zhName: "發佈狀態",
    icon: "nc-icon nc-refresh-02",
    component: PublishStatusTable,
    adminOnly: false
  },
  {
    path: "/applicants",
    layout: "/admin",
    name: "Applicants",
    zhName: "申請人",
    icon: "nc-icon nc-notes",
    component: ApplicantsTable,
    adminOnly: true
  },
  {
    path: "/wait-for-approve",
    layout: "/admin",
    name: "Approve Data",
    zhName: "待同意資料",
    icon: "nc-icon nc-check-2",
    component: ApproveDashboard,
    adminOnly: true
  },
  {
    path: "/approve-publish",
    layout: "/admin",
    name: "Approve Publish",
    zhName: "待同意發佈",
    icon: "nc-icon nc-check-2",
    component: ApprovePublishTables,
    adminOnly: true
  },
  {
    path: "/ipcs-data",
    layout: "/admin",
    name: "IPCS Data Query",
    zhName: "空氣盒子資料搜索",
    icon: "nc-icon nc-notes",
    component: IPCSData,
    adminOnly: false
  },
  // {
  //   path: "ntu-wmts",
  //   layout: "admin",
  //   name: "NTU WMTS Map",
  //   zhName: "臺大電子地圖服務",
  //   icon: "nc-icon nc-notes",
  //   component: ,
  //   adminOnly: false
  // },
  {
    redirect: true,
    path: "/table",
    layout: "/admin",
    name: "",
    zhName: "",
    icon: "",
    component: ApproveTables,
    adminOnly: true
  },
  {
    redirect: true,
    path: "/data-table",
    layout: "/admin",
    name: "",
    zhName: "",
    icon: "",
    component: DataTables,
    adminOnly: true
  },
  {
    redirect: true,
    path: "/common",
    layout: "/admin",
    name: "",
    zhName: "",
    icon: "",
    component: ApproveCommonTables,
    adminOnly: true
  },
  {
    redirect: true,
    collapse: true,
    path: "/pages",
    name: "Pages",
    state: "openPages",
    icon: "nc-icon nc-puzzle-10",
    views: [
      {
        path: "/user-page",
        layout: "/admin",
        name: "使用者設定",
        mini: "UP",
        component: UserPage,
      },
      {
        path: "/login-page",
        layout: "/auth",
        name: "Login Page",
        mini: "LP",
        component: LoginPage,
      },
      {
        path: "/register-page",
        layout: "/auth",
        name: "Register",
        mini: "RP",
        component: RegisterPage,
      },
    ],
  },
];
export default routes;
