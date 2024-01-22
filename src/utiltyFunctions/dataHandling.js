export function patchDataOnly(originalData, alteredData) {
  /*this function takes 2 object arguments- orignalData has the orginal 
  key value pairs that we will comapred against alteredData(object with same peorpeties 
    as orginalData but differing values). A new object containing only the chnages is returned */
  const changedKeyValuePairs = {};
  for (const property in originalData) {
    if (originalData[property] !== alteredData[property]) {
      changedKeyValuePairs[property] = alteredData[property];
    }
  }

  return changedKeyValuePairs;
}
