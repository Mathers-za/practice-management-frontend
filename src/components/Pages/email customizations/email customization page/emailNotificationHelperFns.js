export function handleTileColorChange(id, color) {
  const mutableArray = [];
  mutableArray[id] = color;

  return mutableArray;
}

export function getSaveButtonDisabledState(changesObj, resetState) {
  if (Object.keys(changesObj).length > 0) {
    return false;
  } else if (resetState) {
    return false;
  } else return true;
}
