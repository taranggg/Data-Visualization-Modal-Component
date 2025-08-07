// Sample datasets for the dashboard
const rawDataFrameJson = {
  "columns": [
    "O_ORDERKEY",
    "O_CUSTKEY", 
    "O_ORDERSTATUS",
    "O_TOTALPRICE",
    "O_ORDERDATE",
    "O_ORDERPRIORITY",
    "O_CLERK",
    "O_SHIPPRIORITY",
    "O_COMMENT"
  ],
  "index": [0,1,2,3,4,5,6,7,8],
  "data": [
    [1,7381,"O",181585.13,"1996-01-02","5-LOW","Clerk#000000951",0,"nstructions sleep furiously among "],
    [2,15601,"O",46093.67,"1996-12-01","1-URGENT","Clerk#000000880",0," foxes. pending accounts at the pending, silent asymptot"],
    [3,24664,"F",271422.96,"1993-10-14","5-LOW","Clerk#000000955",0,"sly final accounts boost. carefully regular ideas cajole carefully. depos"],
    [4,27356,"O",47915.12,"1995-10-11","5-LOW","Clerk#000000124",0,"sits. slyly regular warthogs cajole. regular, regular theodolites acro"],
    [5,8897,"F",136701.72,"1994-07-30","5-LOW","Clerk#000000925",0,"quickly. bold deposits sleep slyly. packages use slyly"],
    [6,11125,"F",65070.77,"1992-02-21","4-NOT SPECIFIED","Clerk#000000058",0,"ggle. special, final requests are against the furiously specia"],
    [7,7828,"O",263865.44,"1996-01-10","2-HIGH","Clerk#000000470",0,"ly special requests "],
    [32,26012,"O",153480.44,"1995-07-16","2-HIGH","Clerk#000000616",0,"ise blithely bold, regular requests. quickly unusual dep"],
    [33,13393,"F",138122.69,"1993-10-27","3-MEDIUM","Clerk#000000409",0,"uriously. furiously final request"]
  ]
};

// Employee sales performance data
export const employeeData = [
  { "Employee ID": 1370, "First Name": "Gerard", "Last Name": "Hernandez", "Total Sales": 1258577.81 },
  { "Employee ID": 1165, "First Name": "Leslie", "Last Name": "Jennings", "Total Sales": 1081530.54 },
  { "Employee ID": 1401, "First Name": "Pamela", "Last Name": "Castillo", "Total Sales": 868220.55 },
  { "Employee ID": 1501, "First Name": "Larry", "Last Name": "Bott", "Total Sales": 732096.79 },
  { "Employee ID": 1504, "First Name": "Barry", "Last Name": "Jones", "Total Sales": 704853.91 },
  { "Employee ID": 1323, "First Name": "George", "Last Name": "Vanauf", "Total Sales": 669377.05 },
  { "Employee ID": 1612, "First Name": "Peter", "Last Name": "Marsh", "Total Sales": 584593.76 },
  { "Employee ID": 1337, "First Name": "Loui", "Last Name": "Bondur", "Total Sales": 569485.75 },
  { "Employee ID": 1611, "First Name": "Andy", "Last Name": "Fixter", "Total Sales": 562582.59 },
  { "Employee ID": 1216, "First Name": "Steve", "Last Name": "Patterson", "Total Sales": 505875.42 },
  { "Employee ID": 1286, "First Name": "Foon Yue", "Last Name": "Tseng", "Total Sales": 488212.67 },
  { "Employee ID": 1621, "First Name": "Mami", "Last Name": "Nishi", "Total Sales": 457110.07 },
];

// Country order quantity data
export const countryData = [
  { Country: "Germany", "Total Order Quantity": 6115 },
  { Country: "Italy", "Total Order Quantity": 2768 },
  { Country: "France", "Total Order Quantity": 2227 },
  { Country: "Spain", "Total Order Quantity": 966 },
  { Country: "Austria", "Total Order Quantity": 971 },
  { Country: "Poland", "Total Order Quantity": 686 },
  { Country: "Hungary", "Total Order Quantity": 404 },
  { Country: "Czech Republic", "Total Order Quantity": 232 },
];

export default rawDataFrameJson;