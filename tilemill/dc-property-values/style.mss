#biggriddata {
  polygon-opacity:0.5;
  line-opacity: .5;
  line-width:1;
  polygon-fill: transparent;
  line-color: transparent;
  [PDIFF <= 0.05][PDIFF > 0] { polygon-fill: #D9F0D3; line-color:  #D9F0D3; }
  [PDIFF > 0.05] { polygon-fill: #A6DBA0; line-color:  #A6DBA0; }
  [PDIFF > 0.10] { polygon-fill: #5AAE61; line-color:  #5AAE61; }
  [PDIFF > 0.20] { polygon-fill: #1B7837; line-color:  #1B7837; }  

  [PDIFF < 0][PDIFF >= -0.05] { polygon-fill: #E7D4E8; line-color:  #E7D4E8; }
  [PDIFF < -0.05] { polygon-fill: #C2A5CF; line-color:  #C2A5CF; }
  [PDIFF < -0.10] { polygon-fill: #9970AB; line-color:  #9970AB; }
  [PDIFF < -0.20] { polygon-fill: #762A83; line-color:  #762A83; }
}