/* ---------------------------
  muuri
----------------------------- */
initGrid();

function initGrid() {
  let grid = new Muuri('.grid', {
    dragEnabled: true,
    layoutOnInit: false,
    
  }).on('move', function () {
    saveLayout(grid);
  });

  let layout = window.localStorage.getItem('HydroponicsGridLayoutMuuriID');
  if (layout) {
    loadLayout(grid, layout);
  } else {
    grid.layout(true);
  }
}

function serializeLayout(grid) {
  let itemIds = grid.getItems().map(function (item) {
    return item.getElement().getAttribute('data-id');
  });
  return JSON.stringify(itemIds);
}

//----------- レイアウト情報をlocalStorageへの保存 -----------
function saveLayout(grid) {
  let layout = serializeLayout(grid);
  window.localStorage.setItem('HydroponicsGridLayoutMuuriID', layout);
}

function loadLayout(grid, serializedLayout) {
  let layout = JSON.parse(serializedLayout);
  let currentItems = grid.getItems();
  let currentItemIds = currentItems.map(function (item) {
    return item.getElement().getAttribute('data-id')
  });
  let newItems = [];
  let itemId;
  let itemIndex;

  for (let i = 0; i < layout.length; i++) {
    itemId = layout[i];
    itemIndex = currentItemIds.indexOf(itemId);
    if (itemIndex > -1) {
      newItems.push(currentItems[itemIndex])
    }
  }

  grid.sort(newItems, {layout: 'instant'});
}

//-----------（確認用）localStorageの削除-----------
function remove_ls() {
  localStorage.removeItem("HydroponicsGridLayoutMuuriID");
}
