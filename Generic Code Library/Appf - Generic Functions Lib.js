/*
 * Description : This file is for all the generic functions for common use.
 * Company     : Appficiency Inc.
 */


//Function to get Accounting Period from the date as parameter

function getAccountingPeriod(date)
{
    var i_period = ''
    var accountingperiodSearchObj = search.create({
            type: "accountingperiod",
            filters:
            [
                ["startdate","onorbefore",date], 
                "AND", 
                ["enddate","onorafter",date], 
                "AND", 
                ["isyear","is","F"], 
                "AND", 
                ["isquarter","is","F"]
            ],
            columns:
            [
                search.createColumn({name: "internalid", label: "Internal ID"})
            ]
        });
    var searchResult = accountingperiodSearchObj.run().getRange({start: 0, end: 1000})
    if(searchResult)
    {
        log.debug('searchResult = ',searchResult.length)
        for(t = 0 ; t < searchResult.length ; t++)
        {
            i_period = searchResult[t].getValue({ name: 'internalid'})
            log.debug('i_period = ',i_period)
        }
    }
    return i_period;
}

//Function to remove duplicate data from array

function removeDuplicates(array)
{
    var uniqueArray = [];
        
    // Loop through array values
    for(i=0; i < array.length; i++){
        if(uniqueArray.indexOf(array[i]) === -1) {
            uniqueArray.push(array[i]);
        }
    }
    return uniqueArray;
}

//Function to get transaction type

function getTranType(trantype){
    var transaction = '';
    if(trantype == 'CustInvc')
    transaction = 'invoice';
    if(trantype == 'SalesOrd')
     transaction = 'salesorder';
    if(trantype == 'VendBill')
     transaction = 'vendorbill';
    if(trantype == 'VendCred')
     transaction = 'billcredit';
    if(trantype == 'CustCred')
     transaction = 'creditmemo';
    if(trantype == 'CashSale')
     transaction = 'cashsale';
    if(trantype == 'InvAdjst')
     transaction = 'inventoryadjustment';
      if(trantype == 'ItemRcpt')
     transaction = 'itemreceipt';
     if(trantype == 'Journal')
     transaction = 'journal';
     if(trantype == 'Opprtnty')
     transaction = 'opportunity';
     if(trantype == 'LiaAdjst')
     transaction = 'laibilityadjustment';
     if(trantype == 'ExpRept')
     transaction = 'expensereport';
     if(trantype == 'CustPymt')
     transaction = 'customerpayment';
     if(trantype == 'Deposit')
     transaction = 'deposit';
     if(trantype == 'CardChrg')
     transaction = 'creditcard';
     if(trantype == 'ItemShip')
     transaction = 'itemfullfillment';
     if(trantype == 'CustDep')
     transaction = 'customerdeposit';
     if(trantype == 'PurchOrd')
     transaction = 'purchaseorder';
     if(trantype == 'InvTrnfr')
     transaction = 'inventorytransfer';
     if(trantype == 'WorkOrd')
     transaction = 'workorder';
     if(trantype == 'Build')
     transaction = 'assemblybuild';
     if(trantype == 'FxReval')
     transaction = 'currencyrevaluation';
     if(trantype == 'VendAuth')
     transaction = 'vendorreturnauthorization';
     if(trantype == 'Estimate')
     transaction = 'estimate';
     if(trantype == 'Commissn')
     transaction = 'commission';
     if(trantype == 'TrnfrOrd')
     transaction = 'transfer';
     if(trantype == 'BinWksht')
     transaction = 'binputawayworkSheet';
     if(trantype == 'RtnAuth')
    transaction = 'returnauthorization';
    if(trantype == '')
    transaction = '';
    return transaction;
  }

//Function to get country By Code

function getCountryByCode(code)
{
    //log.debug('post_SO_Integration', '##code==' + code);
    var arrcountry = new Array();
    arrcountry[0] = new Array("AF",3);
    arrcountry[1] = new Array("AX",247);
    arrcountry[2] = new Array("AL",6);
    arrcountry[3] = new Array("DZ",62);
    arrcountry[4] = new Array("AS",12);
    arrcountry[5] = new Array("AD",1);
    arrcountry[6] = new Array("AO",9);
    arrcountry[7] = new Array("AI",5);
    arrcountry[8] = new Array("AQ",10);
    arrcountry[9] = new Array("AG",4);
    arrcountry[10] = new Array("AR",11);
    arrcountry[11] = new Array("AM",7);
    arrcountry[12] = new Array("AW",15);
    arrcountry[13] = new Array("AU",14);
    arrcountry[14] = new Array("AT",13);
    arrcountry[15] = new Array("AZ",16);
    arrcountry[16] = new Array("BS",31);
    arrcountry[17] = new Array("BH",23);
    arrcountry[18] = new Array("BD",19);
    arrcountry[19] = new Array("BB",18);
    arrcountry[20] = new Array("BY",35);
    arrcountry[21] = new Array("BE",20);
    arrcountry[22] = new Array("BZ",36);
    arrcountry[23] = new Array("BJ",25);
    arrcountry[24] = new Array("BM",27);
    arrcountry[25] = new Array("BT",32);
    arrcountry[26] = new Array("BO",29);
    arrcountry[27] = new Array("BA",27);
    arrcountry[28] = new Array("BW",34);
    arrcountry[29] = new Array("BV",33);
    arrcountry[30] = new Array("BR",30);
    arrcountry[31] = new Array("IO",106);
    arrcountry[32] = new Array("BN",28);
    arrcountry[33] = new Array("BG",22);
    arrcountry[34] = new Array("BF",21);
    arrcountry[35] = new Array("BI",24);
    arrcountry[36] = new Array("KH",117);
    arrcountry[37] = new Array("CM",46);
    arrcountry[38] = new Array("CA",37);
    arrcountry[39] = new Array("IC",249);
    arrcountry[40] = new Array("CV",53);
    arrcountry[41] = new Array("KY",124);
    arrcountry[42] = new Array("CF",40);
    arrcountry[43] = new Array("EA",248);
    arrcountry[44] = new Array("TD",212);
    arrcountry[45] = new Array("CL",45);
    arrcountry[46] = new Array("CN",47);
    arrcountry[47] = new Array("CX",54);
    arrcountry[48] = new Array("CC",38);
    arrcountry[49] = new Array("CO",48);
    arrcountry[50] = new Array("KM",119);
    arrcountry[51] = new Array("CD",39);
    arrcountry[52] = new Array("CG",41);
    arrcountry[53] = new Array("CK",44);
    arrcountry[54] = new Array("CR",49);
    arrcountry[55] = new Array("CI",43);
    arrcountry[56] = new Array("HR",98);
    arrcountry[57] = new Array("CU",52);
    arrcountry[58] = new Array("CY",55);
    arrcountry[59] = new Array("CZ",56);
    arrcountry[60] = new Array("DK",59);
    arrcountry[61] = new Array("DJ",58);
    arrcountry[62] = new Array("DM",60);
    arrcountry[63] = new Array("DO",61);
    arrcountry[64] = new Array("TP",221);
    arrcountry[65] = new Array("EC",63);
    arrcountry[66] = new Array("EG",65);
    arrcountry[67] = new Array("SV",208);
    arrcountry[68] = new Array("GQ",88);
    arrcountry[69] = new Array("ER",67);
    arrcountry[70] = new Array("EE",64);
    arrcountry[71] = new Array("ET",69);
    arrcountry[72] = new Array("FK",72);
    arrcountry[73] = new Array("FO",74);
    arrcountry[74] = new Array("FJ",71);
    arrcountry[75] = new Array("FI",70);
    arrcountry[76] = new Array("FR",75);
    arrcountry[77] = new Array("GF",80);
    arrcountry[78] = new Array("PF",175);
    arrcountry[79] = new Array("TF",213);
    arrcountry[80] = new Array("GA",76);
    arrcountry[81] = new Array("GM",85);
    arrcountry[82] = new Array("GE",79);
    arrcountry[83] = new Array("DE",57);
    arrcountry[84] = new Array("GH",82);
    arrcountry[85] = new Array("GI",83);
    arrcountry[86] = new Array("GR",89);
    arrcountry[87] = new Array("GL",84);
    arrcountry[88] = new Array("GD",78);
    arrcountry[89] = new Array("GP",87);
    arrcountry[90] = new Array("GU",92);
    arrcountry[91] = new Array("GT",91);
    arrcountry[92] = new Array("GG",81);
    arrcountry[93] = new Array("GN",86);
    arrcountry[94] = new Array("GW",93);
    arrcountry[95] = new Array("GY",94);
    arrcountry[96] = new Array("HT",99);
    arrcountry[97] = new Array("HM",96);
    arrcountry[98] = new Array("VA",233);
    arrcountry[99] = new Array("HN",97);
    arrcountry[100] = new Array("HK",95);
    arrcountry[101] = new Array("HU",100);
    arrcountry[102] = new Array("IS",109);
    arrcountry[103] = new Array("IN",105);
    arrcountry[104] = new Array("ID",101);
    arrcountry[105] = new Array("IR",108);
    arrcountry[106] = new Array("IQ",107);
    arrcountry[107] = new Array("IE",102);
    arrcountry[108] = new Array("IM",104);
    arrcountry[109] = new Array("IL",103);
    arrcountry[110] = new Array("IT",110);
    arrcountry[111] = new Array("JM",112);
    arrcountry[112] = new Array("JP",114);
    arrcountry[113] = new Array("JE",111);
    arrcountry[114] = new Array("JO",113);
    arrcountry[115] = new Array("KZ",125);
    arrcountry[116] = new Array("KE",115);
    arrcountry[117] = new Array("KI",118);
    arrcountry[118] = new Array("KP",121);
    arrcountry[119] = new Array("KR",122);
    arrcountry[120] = new Array("KW",123);
    arrcountry[121] = new Array("KG",116);
    arrcountry[122] = new Array("LA",126);
    arrcountry[123] = new Array("LV",135);
    arrcountry[124] = new Array("LB",127);
    arrcountry[125] = new Array("LS",132);
    arrcountry[126] = new Array("LR",131);
    arrcountry[127] = new Array("LY",136);
    arrcountry[128] = new Array("LI",129);
    arrcountry[129] = new Array("LT",133);
    arrcountry[130] = new Array("LU",134);
    arrcountry[131] = new Array("MO",148);
    arrcountry[132] = new Array("MK",144);
    arrcountry[133] = new Array("MG",142);
    arrcountry[134] = new Array("MW",156);
    arrcountry[135] = new Array("MY",158);
    arrcountry[136] = new Array("MV",155);
    arrcountry[137] = new Array("ML",145);
    arrcountry[138] = new Array("MT",153);
    arrcountry[139] = new Array("MH",143);
    arrcountry[140] = new Array("MQ",150);
    arrcountry[141] = new Array("MR",151);
    arrcountry[142] = new Array("MU",154);
    arrcountry[143] = new Array("YT",243);
    arrcountry[144] = new Array("MX",157);
    arrcountry[145] = new Array("FM",73);
    arrcountry[146] = new Array("MD",139);
    arrcountry[147] = new Array("MC",138);
    arrcountry[148] = new Array("MN",147);
    arrcountry[149] = new Array("ME",140);
    arrcountry[150] = new Array("MS",152);
    arrcountry[151] = new Array("MA",137);
    arrcountry[152] = new Array("MZ",159);
    arrcountry[153] = new Array("MM",146);
    arrcountry[154] = new Array("NA",160);
    arrcountry[155] = new Array("NR",169);
    arrcountry[156] = new Array("NP",168);
    arrcountry[157] = new Array("NL",166);
    arrcountry[158] = new Array("AN",8);
    arrcountry[159] = new Array("NC",161);
    arrcountry[160] = new Array("NZ",171);
    arrcountry[161] = new Array("NI",165);
    arrcountry[162] = new Array("NE",162);
    arrcountry[163] = new Array("NG",164);
    arrcountry[164] = new Array("NU",170);
    arrcountry[165] = new Array("NF",163);
    arrcountry[166] = new Array("MP",149);
    arrcountry[167] = new Array("NO",167);
    arrcountry[168] = new Array("OM",172);
    arrcountry[169] = new Array("PK",178);
    arrcountry[170] = new Array("PW",185);
    arrcountry[171] = new Array("PS",183);
    arrcountry[172] = new Array("PA",173);
    arrcountry[173] = new Array("PG",176);
    arrcountry[174] = new Array("PY",186);
    arrcountry[175] = new Array("PE",174);
    arrcountry[176] = new Array("PH",177);
    arrcountry[177] = new Array("PN",181);
    arrcountry[178] = new Array("PL",179);
    arrcountry[179] = new Array("PT",184);
    arrcountry[180] = new Array("PR",182);
    arrcountry[181] = new Array("QA",187);
    arrcountry[182] = new Array("RE",188);
    arrcountry[183] = new Array("RO",189);
    arrcountry[184] = new Array("RU",190);
    arrcountry[185] = new Array("RW",191);
    arrcountry[186] = new Array("BL",26);
    arrcountry[187] = new Array("SH",198);
    arrcountry[188] = new Array("KN",120);
    arrcountry[189] = new Array("LC",128);
    arrcountry[190] = new Array("MF",141);
    arrcountry[191] = new Array("VC",234);
    arrcountry[192] = new Array("WS",241);
    arrcountry[193] = new Array("SM",203);
    arrcountry[194] = new Array("ST",207);
    arrcountry[195] = new Array("SA",192);
    arrcountry[196] = new Array("SN",204);
    arrcountry[197] = new Array("RS",50);
    arrcountry[198] = new Array("CS",51);
    arrcountry[199] = new Array("SC",194);
    arrcountry[200] = new Array("SL",202);
    arrcountry[201] = new Array("SG",197);
    arrcountry[202] = new Array("SK",201);
    arrcountry[203] = new Array("SI",199);
    arrcountry[204] = new Array("SB",193);
    arrcountry[205] = new Array("SO",205);
    arrcountry[206] = new Array("ZA",244);
    arrcountry[207] = new Array("GS",90);
    arrcountry[208] = new Array("ES",68);
    arrcountry[209] = new Array("LK",130);
    arrcountry[210] = new Array("PM",180);
    arrcountry[211] = new Array("SD",195);
    arrcountry[212] = new Array("SR",206);
    arrcountry[213] = new Array("SJ",200);
    arrcountry[214] = new Array("SZ",210);
    arrcountry[215] = new Array("SE",196);
    arrcountry[216] = new Array("CH",42);
    arrcountry[217] = new Array("SY",209);
    arrcountry[218] = new Array("TW",225);
    arrcountry[219] = new Array("TJ",216);
    arrcountry[220] = new Array("TZ",226);
    arrcountry[221] = new Array("TH",215);
    arrcountry[222] = new Array("TG",214);
    arrcountry[223] = new Array("TK",217);
    arrcountry[224] = new Array("TO",220);
    arrcountry[225] = new Array("TT",223);
    arrcountry[226] = new Array("TN",219);
    arrcountry[227] = new Array("TR",222);
    arrcountry[228] = new Array("TM",218);
    arrcountry[229] = new Array("TC",211);
    arrcountry[230] = new Array("TV",224);
    arrcountry[231] = new Array("UG",228);
    arrcountry[232] = new Array("UA",227);
    arrcountry[233] = new Array("AE",2);
    arrcountry[234] = new Array("GB",77);
    arrcountry[235] = new Array("US",230);
    arrcountry[236] = new Array("UY",231);
    arrcountry[237] = new Array("UM",229);
    arrcountry[238] = new Array("UZ",232);
    arrcountry[239] = new Array("VU",239);
    arrcountry[240] = new Array("VE",235);
    arrcountry[241] = new Array("VN",238);
    arrcountry[242] = new Array("VG",236);
    arrcountry[243] = new Array("VI",237);
    arrcountry[244] = new Array("WF",240);
    arrcountry[245] = new Array("EH",66);
    arrcountry[246] = new Array("YE",242);
    arrcountry[247] = new Array("ZM",245);
    arrcountry[248] = new Array("ZW",246);
    
    for(var i=0; i<arrcountry.length; i++)
    {
        if(arrcountry[i][1] == code)
        {
            //log.debug('post_SO_Integration', '##condition matched');
            return arrcountry[i][0];
        }
    }
    
    return null;
}

    //Function to get the country internal id

function getCountryInternalId(code)
{
    var internalId = '';
    var idPlusName = {
        "Afghanistan": "3",
        "Aland Islands": "247",
        "Albania": "6",
        "Algeria": "62",
        "American Samoa": "12",
        "Andorra": "1",
        "Angola": "9",
        "Anguilla": "5",
        "Antarctica": "10",
        "Antigua and Barbuda": "4",
        "Argentina": "11",
        "Armenia": "7",
        "Aruba": "15",
        "Australia": "14",
        "Austria": "13",
        "Azerbaijan": "16",
        "Bahamas": "31",
        "Bahrain": "23",
        "Bangladesh": "19",
        "Barbados": "18",
        "Belarus": "35",
        "Belgium": "20",
        "Belize": "36",
        "Benin": "25",
        "Bermuda": "27",
        "Bhutan": "32",
        "Bolivia": "29",
        "Bonaire, Saint Eustatius and Saba": "250",
        "Bosnia and Herzegovina": "17",
        "Botswana": "34",
        "Bouvet Island": "33",
        "Brazil": "30",
        "British Indian Ocean Territory": "106",
        "Brunei Darussalam": "28",
        "Bulgaria": "22",
        "Burkina Faso": "21",
        "Burundi": "24",
        "Cambodia": "117",
        "Cameroon": "46",
        "Canada": "37",
        "Canary Islands": "249",
        "Cape Verde": "53",
        "Cayman Islands": "124",
        "Central African Republic": "40",
        "Ceuta and Melilla": "248",
        "Chad": "212",
        "Chile": "45",
        "China": "47",
        "Christmas Island": "54",
        "Cocos (Keeling) Islands": "38",
        "Colombia": "48",
        "Comoros": "119",
        "Congo, Democratic Republic of": "39",
        "Congo, Republic of": "41",
        "Cook Islands": "44",
        "Costa Rica": "49",
        "Cote d'Ivoire": "43",
        "Croatia/Hrvatska": "98",
        "Cuba": "52",
        "Curaçao": "251",
        "Cyprus": "55",
        "Czech Republic": "56",
        "Denmark": "59",
        "Djibouti": "58",
        "Dominica": "60",
        "Dominican Republic": "61",
        "East Timor": "221",
        "Ecuador": "63",
        "Egypt": "65",
        "El Salvador": "208",
        "Equatorial Guinea": "88",
        "Eritrea": "67",
        "Estonia": "64",
        "Ethiopia": "69",
        "Falkland Islands": "72",
        "Faroe Islands": "74",
        "Fiji": "71",
        "Finland": "70",
        "France": "75",
        "French Guiana": "80",
        "French Polynesia": "175",
        "French Southern Territories": "213",
        "Gabon": "76",
        "Gambia": "85",
        "Georgia": "79",
        "Germany": "57",
        "Ghana": "82",
        "Gibraltar": "83",
        "Greece": "89",
        "Greenland": "84",
        "Grenada": "78",
        "Guadeloupe": "87",
        "Guam": "92",
        "Guatemala": "91",
        "Guernsey": "81",
        "Guinea": "86",
        "Guinea-Bissau": "93",
        "Guyana": "94",
        "Haiti": "99",
        "Heard and McDonald Islands": "96",
        "Holy See (City Vatican State)": "233",
        "Honduras": "97",
        "Hong Kong": "95",
        "Hungary": "100",
        "Iceland": "109",
        "India": "105",
        "Indonesia": "101",
        "Iran (Islamic Republic of)": "108",
        "Iraq": "107",
        "Ireland": "102",
        "Isle of Man": "104",
        "Israel": "103",
        "Italy": "110",
        "Jamaica": "112",
        "Japan": "114",
        "Jersey": "111",
        "Jordan": "113",
        "Kazakhstan": "125",
        "Kenya": "115",
        "Kiribati": "118",
        "Korea, Democratic People's Republic": "121",
        "Korea, Republic of": "122",
        "Kosovo": "254",
        "Kuwait": "123",
        "Kyrgyzstan": "116",
        "Lao People's Democratic Republic": "126",
        "Latvia": "135",
        "Lebanon": "127",
        "Lesotho": "132",
        "Liberia": "131",
        "Libya": "136",
        "Liechtenstein": "129",
        "Lithuania": "133",
        "Luxembourg": "134",
        "Macau": "148",
        "Macedonia": "144",
        "Madagascar": "142",
        "Malawi": "156",
        "Malaysia": "158",
        "Maldives": "155",
        "Mali": "145",
        "Malta": "153",
        "Marshall Islands": "143",
        "Martinique": "150",
        "Mauritania": "151",
        "Mauritius": "154",
        "Mayotte": "243",
        "Mexico": "157",
        "Micronesia, Federal State of": "73",
        "Moldova, Republic of": "139",
        "Monaco": "138",
        "Mongolia": "147",
        "Montenegro": "140",
        "Montserrat": "152",
        "Morocco": "137",
        "Mozambique": "159",
        "Myanmar (Burma)": "146",
        "Namibia": "160",
        "Nauru": "169",
        "Nepal": "168",
        "Netherlands": "166",
        "Netherlands Antilles (Deprecated)": "8",
        "New Caledonia": "161",
        "New Zealand": "171",
        "Nicaragua": "165",
        "Niger": "162",
        "Nigeria": "164",
        "Niue": "170",
        "Norfolk Island": "163",
        "Northern Mariana Islands": "149",
        "Norway": "167",
        "Oman": "172",
        "Pakistan": "178",
        "Palau": "185",
        "Panama": "173",
        "Papua New Guinea": "176",
        "Paraguay": "186",
        "Peru": "174",
        "Philippines": "177",
        "Pitcairn Island": "181",
        "Poland": "179",
        "Portugal": "184",
        "Puerto Rico": "182",
        "Qatar": "187",
        "Reunion Island": "188",
        "Romania": "189",
        "Russian Federation": "190",
        "Rwanda": "191",
        "Saint Barthélemy": "26",
        "Saint Helena": "198",
        "Saint Kitts and Nevis": "120",
        "Saint Lucia": "128",
        "Saint Martin": "141",
        "Saint Vincent and the Grenadines": "234",
        "Samoa": "241",
        "San Marino": "203",
        "Sao Tome and Principe": "207",
        "Saudi Arabia": "192",
        "Senegal": "204",
        "Serbia": "50",
        "Serbia and Montenegro (Deprecated)": "51",
        "Seychelles": "194",
        "Sierra Leone": "202",
        "Singapore": "197",
        "Sint Maarten": "252",
        "Slovak Republic": "201",
        "Slovenia": "199",
        "Solomon Islands": "193",
        "Somalia": "205",
        "South Africa": "244",
        "South Georgia": "90",
        "South Sudan": "253",
        "Spain": "68",
        "Sri Lanka": "130",
        "St. Pierre and Miquelon": "180",
        "State of Palestine": "183",
        "Sudan": "195",
        "Suriname": "206",
        "Svalbard and Jan Mayen Islands": "200",
        "Swaziland": "210",
        "Sweden": "196",
        "Switzerland": "42",
        "Syrian Arab Republic": "209",
        "Taiwan": "225",
        "Tajikistan": "216",
        "Tanzania": "226",
        "Thailand": "215",
        "Togo": "214",
        "Tokelau": "217",
        "Tonga": "220",
        "Trinidad and Tobago": "223",
        "Tunisia": "219",
        "Turkey": "222",
        "Turkmenistan": "218",
        "Turks and Caicos Islands": "211",
        "Tuvalu": "224",
        "Uganda": "228",
        "Ukraine": "227",
        "United Arab Emirates": "2",
        "United Kingdom": "77",
        "United States": "230",
        "Uruguay": "231",
        "US Minor Outlying Islands": "229",
        "Uzbekistan": "232",
        "Vanuatu": "239",
        "Venezuela": "235",
        "Vietnam": "238",
        "Virgin Islands (British)": "236",
        "Virgin Islands (USA)": "237",
        "Wallis and Futuna": "240",
        "Western Sahara": "66",
        "Yemen": "242",
        "Zambia": "245",
        "Zimbabwe": "246"
    };
    internalId = idPlusName[code]
    return internalId;
}


//format date function
function formatdate(dd,mm,yy){
	log.debug('dd ===' + dd + 'mm=='+mm + 'yy=='+yy);
var userObj = obj_Runtime.getCurrentUser();
var date_format = userObj.getPreference ({
    name: 'DATEFORMAT'
});
log.debug('User preference for date_format: ' + date_format);
  
if (date_format == 'M/D/YYYY') {
       
		 var final_date = mm + '/' + dd + '/' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'D/M/YYYY') {
       
		 var final_date = dd + '/' + mm + '/' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'D-Mon-YYYY') {
      mm = SearchNumber(mm) 
		 var final_date = dd + '-' + mm + '-' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'D.M.YYYY') {
        
        var final_date = dd + '.' + mm + '.' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'D-MONTH-YYYY') {
         mm = SearchLongNumber(mm) 
		 var final_date = dd + '/' + mm + '/' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'D-MONTH, YYYY') {
        mm = SearchLongNumber(mm) 
		 var final_date = dd + '-' + mm + ', ' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'YYYY-M-D') {
       
		 var final_date = yy + '-' + mm + '-' + dd
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
		else if (date_format == 'YYYY/M/D') {
       
		 var final_date = yy + '/' + mm + '/' + dd
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'DD/MM/YYYY') {
         if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
        
            mm = '0' + mm;
            
        }
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = dd + '/' + mm + '/' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'DD-Mon-YYYY') {
         mm = searchNumber(mm);
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = dd + '-' + mm + '-' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'DD.MM.YYYY') {
         if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
        
            mm = '0' + mm;
            
        }
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = dd + '.' + mm + '.' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'DD-MONTH-YYYY') {
       mm= searchLingNumber(mm);
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = dd + '-' + mm + '-' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'DD-MONTH, YYYY') {
        mm= SearchLongNumber(mm);
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = dd + '/' + mm + ', ' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'MM/DD/YYYY') {
         if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
        
            mm = '0' + mm;
            
        }
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = mm + '/' + dd + '/' + yy
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'YYYY/MM/DD') {
         if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
        
            mm = '0' + mm;
            
        }
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = yy + '/' + mm + '/' + dd
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else if (date_format == 'YYYY-MM-DD') {
         if (mm == '1' || mm == '2' || mm == '3' || mm == '4' || mm == '5' || mm == '6' || mm == '7' || mm == '8' || mm == '9') {
        
            mm = '0' + mm;
            
        }
        if (dd == '1' || dd == '2' || dd == '3' || dd == '4' || dd == '5' || dd == '6' || dd == '7' || dd == '8' || dd == '9') {
        
            dd = '0' + dd;
            
        }
		 var final_date = yy + '-' + mm + '-' + dd
        log.debug('DEBUG', 'd_string', 'Inside date_format =' + final_date);
        return final_date;
    }
	else {
    
    return null;
}
}

function searchNumber(monthvalue)
{
    var x = '';
    switch (monthvalue)
    {
        case "1":
            x = 'JAN';
            break;
        case "2":
            x = 'FEB';
            break;
        case "3":
            x = 'MAR';
            break;
        case "4":
            x = 'APR';
            break;
        case "5":
            x = 'MAY';
            break;
        case "6":
            x = 'JUN';
            break;
        case "7":
            x = 'JUL';
            break;
        case "8":
            x = 'AUG';
            break;
        case "9":
            x = 'SEP';
            break;
        case "10":
            x = 'OCT';
            break;
        case "11":
            x = 'NOV';
            break;
        case "12":
            x = 'DEC';
            break;
	case "01":
            x = 'JAN';
            break;
        case "02":
            x = 'FEB';
            break;
        case "03":
            x = 'MAR';
            break;
        case "04":
            x = 'APR';
            break;
        case "05":
            x = 'MAY';
            break;
        case "06":
            x = 'JUN';
            break;
        case "07":
            x = 'JUL';
            break;
        case "08":
            x = 'AUG';
            break;
        case "09":
            x = 'SEP';
            break;
        
    }
    return x;
}
function SearchLongNumber(monthvalue){

    var x = '';
    switch (monthvalue) {
        case "1" :
            x = 'January';
            break;
        case "2":
            x ='February';
            break;
        case "3":
            x ='March';
            break;
        case "4":
            x = 'April';
            break;
        case "5":
            x = 'May';
            break;
        case "6":
            x = 'June';
            break;
        case "7":
            x = 'July';
            break;
        case "8":
            x = 'August';
            break;
        case "9":
            x = 'September';
            break;
        case "10":
            x = 'October';
            break;
        case "11":
            x = 'November';
            break;
        case "12":
            x = 'December';
            break;
			case "01" :
            x = 'January';
            break;
        case "02":
            x ='February';
            break;
        case "03":
            x ='March';
            break;
        case "04":
            x = 'April';
            break;
        case "05":
            x = 'May';
            break;
        case "06":
            x = 'June';
            break;
        case "07":
            x = 'July';
            break;
        case "08":
            x = 'August';
            break;
        case "09":
            x = 'September';
            break;
      
    }
    return x;
}

//end of format date function