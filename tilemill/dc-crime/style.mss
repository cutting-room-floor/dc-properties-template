/* 
 * This project filters the crime spreadsheet based on the OFFENSE column.
 * Change ROBBERY with another offense to change the filter.
 * Remove the whole [ ... ] section to show all crime. 
 */

#crimeincidentscurren[OFFENSE = "ROBBERY"] {
  marker-fill: #ff4455;
  marker-allow-overlap: true;
  marker-line-width: 0;
  marker-opacity: 1;
  marker-width: 0;
  [zoom = 10] { marker-width: 1; }
  [zoom = 11] { marker-width: 1.5; }
  [zoom = 12] { marker-width: 2; }
  [zoom = 13] { marker-width: 2; }
  [zoom = 14] { marker-width: 3; }
  [zoom = 15] { marker-width: 4; }
  [zoom = 16] { marker-width: 4; }
  [zoom = 17] { marker-width: 5; }
}
