var grid = [];
var titleGrid = [];
var navGrid = [];
var title_grid_cols = 8;
var title_grid_rows = 3;
var grid_cols = 8;
var grid_rows = 15;

function initGrid (rows, cols, grid, preString, containerName, offset = 0) {
  // var grid = [];
  var block_width = $(containerName).width() / cols;
  var block_height = $(containerName).height() / rows;
  console.log(offset);
  for(var i = 0; i < rows; i++) {
    var currentRow = [];
    for(var j = 0; j < cols; j++) {
      var y = i * block_height;
      var x = j * block_width;

      var block = new Block(i, j, x, y,
                            block_width, block_height, preString, containerName, offset);
      currentRow.push(block);
    }
    grid.push(currentRow);
  }
  return grid;
}

function Block(row, col, x, y, width, height, preString, containerName, offset){
  this.row = row;
  this.col = col;
  this.containerName = containerName;

  //initial values
  this.x = x;
  this.y = y;
  if (preString.length > 0) {
    this.id = preString+"_"+row+"_"+col;
  } else {
    this.id = row+"_"+col;
  }
  this.offset = offset;
  this.state = "normal";
  this.width = width;
  this.height = height;
  this.bounds = {right:0, bottom:0}
  this.DOM = `<div class="block" id="`+this.id+`">
                  <div class="inner"></div>
                  <div class ="borders">
                    <div class ="borders-inner">
                      <span class="border-top"></span>
                      <span class="border-right"></span>
                      <span class="border-bottom"></span>
                      <span class="border-left"></span>
                    </div>
                  </div>
              </div>`;
  this.collapsed = false;

  this.animateOut = function(){
    directions = [];
    // 1- Top border
    // 2- Right border
    // 3- Bottom border
    // 4- Left border
    if(Math.random() > .5){
      directions.push("left-out");
    }
    else{
      directions.push("right-out");
    }
    if(Math.random() > .5){
      directions.push("up-out");
    }
    else{
      directions.push("down-out");
    }
    if(Math.random() > .5){
      directions.push("left-out");
    }
    else{
      directions.push("right-out");
    }
    if(Math.random() > .5){
      directions.push("up-out");
    }
    else{
      directions.push("down-out");
    }
    directions.forEach(function(val,index){
      //Creating the random second measured delay.
      randomDuration = parseFloat(.25+(Math.random()*.5))+"s";
      randomDelay = parseFloat(Math.random()*.5)+"s";
      directions[index] = [val,randomDelay,randomDuration];
    })
    $("#"+this.id+" .borders .border-top")
    .css('transition-delay',directions[0][1])
    .css('transition-duration',directions[0][2])
    .addClass(directions[0][0]);
    $("#"+this.id+" .borders .border-right")
    .css('transition-delay',directions[1][1])
    .css('transition-duration',directions[1][2])
    .addClass(directions[1][0]);
    $("#"+this.id+" .borders .border-bottom")
    .css('transition-delay',directions[2][1])
    .css('transition-duration',directions[2][2])
    .addClass(directions[2][0]);
    $("#"+this.id+" .borders .border-left")
    .css('transition-delay',directions[3][1])
    .css('transition-duration',directions[3][2])
    .addClass(directions[3][0]);

  }

  this.animateIn = function(){
    console.log('animating the navbar in');
    $("#"+this.id+" .borders span").removeClass("left-out right-out up-out down-out");
  }

  this.create = function(target){
    $(target).append(this.DOM);
  }

  this.update = function(w, h, offset){
    //checking if collapsed
    if (this.containerName == ".titleGrid")
      console.log(offset);

    if (this.collapsed && Object.values(this.bounds).includes(-1)) {
      return;
    }

    if(Object.values(this.bounds).includes(-1)) {
      this.collapsed = true;
      $("#"+this.id).toggleClass("collapsed");
      // TODO: maybe need to fix width and height so we can click on the entire expanded box
      // $("#"+this.id).css({
      //   "width": 0,
      //   "height": 0
      // });
    } else {
        this.collapsed = false;
        var y;
        var x;
        var width = w + this.bounds.right * w;
        var height = h + this.bounds.bottom * h;

        y = this.row * h + offset;
        x = this.col * w;

        $("#"+this.id).css({
          "top": y,
          "left": x,
          "width": width,
          "height": height
        });

        this.y = y;
        this.x = x;
        this.width = w;
        this.height = h;
        this.offset = offset;
    }
  }
}

function animateBlock(block, rowsDown, colsRight, gridlines = false) {
    console.log(gridlines);
    var id = $(block).attr("id").split("_");

    var i = parseInt(id[id.length - 2]);
    var j = parseInt(id[id.length - 1]);

    var curBlock = grid[i][j];
    var regular_w = ($(curBlock.containerName).width()/grid_cols);
    var regular_h = ($(curBlock.containerName).height()/grid_rows);

    if (curBlock.bounds.bottom != 0 || curBlock.bounds.right != 0) {
      resetBlock(block);
      return;
    }

    curBlock.bounds.bottom = rowsDown;
    curBlock.bounds.right = colsRight;

    for (var row = i; row < Math.min(grid_rows, i + 1 + rowsDown); row++) {
      for (var col = j; col < Math.min(grid_cols, j + 1 + colsRight); col++) {
        if (row == i && col == j && (grid[row][col].bounds.right != 0 || grid[row][col].bounds.bottom != 0)) {
          continue
        }
        var b = grid[row][col];

        if (col == j) {
          // vertical
          collapse("DOWN", b);
        } else if (row == i) {
          // horizontal
          collapse("RIGHT", b)
        } else {
          // diagonally
          collapse("DIAGONAL", b);
        }
      }
    }

    // if (gridlines) {
    //   for (var row=i; row < Math.min(grid_rows, i + 1 + rowsDown); row++) {
    //     for (var col=j; col < Math.min(grid_cols, j + 1 + colsRight); col++) {
    //       if (row == i && col == j && (grid[row][col].bounds.right != 0 || grid[row][col].bounds.bottom != 0)) {
    //         continue
    //       }
    //       var block = "#" + i + "_" + j;
    //       $(block).append($("<div class=row></div>"))
    //       console.log(b)
    //     }
    //   }
    // }

    curBlock.update(regular_w, regular_h, curBlock.offset);
}

function resetBlock(block) {
    var id = $(block).attr("id").split("_");

    var i = parseInt(id[id.length - 2]);
    var j = parseInt(id[id.length - 1]);

    var curBlock = grid[i][j];
    var regular_w = ($(curBlock.containerName).width()/grid_cols);
    var regular_h = ($(curBlock.containerName).height()/grid_rows);

    var blocksDown = curBlock.bounds.bottom;
    var blocksRight = curBlock.bounds.right;

    for (var row=i; row < Math.min(grid_rows, i + 1 + blocksDown); row++) {
      for (var col=j; col < Math.min(grid_cols, j + 1 + blocksRight); col++) {
        var b = grid[row][col];

        b.bounds.right = 0
        b.bounds.bottom = 0;

        b.update(regular_w, regular_h, curBlock.offset)

        if ($("#"+row+"_"+col).hasClass('collapsed')) {
          $("#"+row+"_"+col).toggleClass('collapsed');
        }
      }
    }
}

function resetAllBlocks() {
  for (var row=0; row < grid_rows; row++) {
    for (var col=0; col < grid_cols; col++) {
      var b = grid[row][col];
      if (b.bounds.right > 0 || b.bounds.bottom > 0) {
        resetBlock(b);
      }
    }
  }
}

function destroyAllBlocks(){
  for (var row=0; row < grid_rows; row++) {
    for (var col=0; col < grid_cols; col++) {
      var b = grid[row][col];
      $("#"+b.id).remove();
      // Call this once implemented
      // b.animateOut()
    }
  }
}

function collapse(direction, block) {
    switch (direction) {
      case "DOWN":
        block.bounds.bottom = -1;
        break;
      case "RIGHT":
        block.bounds.right = -1;
        break;
      case "DIAGONAL":
        block.bounds.bottom = -1;
        block.bounds.right = -1;
      default:
        break;
    }

    var regular_w = ($(block.containerName).width()/grid_cols);
    var regular_h = ($(block.containerName).height()/grid_rows);

    block.update(regular_w, regular_h, block.offset);
}

function movePage(curPage,pageCount,direction,cb){

  blockDimension = { h: grid[0][0].height, w:grid[0][0].width };
  blockPerPage = 5;

  if ((curPage == 0 && direction == 'up') ||
      (curPage == pageCount - 1 && direction == 'down')){
    cb(curPage);
    return;
  }

  if (direction == 'up') {
    newPage = curPage - 1;
  }

  else if (direction == 'down') {
    newPage = curPage + 1;
  }

  targetDist = -(blockPerPage * blockDimension.h * newPage);
  $('.mainGrid').css('transform','translateY('+parseFloat(targetDist)+'px)');
  cb(newPage);

}

$(window).ready(function(){
  var wheeling;
  var wheeldelta = { x: 0, y: 0 };
  var totalDist = 0;
  var threshold = 3000;
  var currentPage = 0;
  var isScrollingUp = false;

  $("body").bind('mousewheel', function(e) {
    if(e.originalEvent.wheelDelta > 0) {
      if (!isScrollingUp) {
        totalDist = 0;
        isScrollingUp = true;
      }
    } else if (isScrollingUp) {
      totalDist = 0;
      isScrollingUp = false;
    }
    else{
      isScrollingUp = false;
    }

    if (Math.abs(e.originalEvent.wheelDelta) > 10) {
      if (isScrollingUp) {
        if(totalDist > threshold){
          totalDist = 0;
          movePage(currentPage,3,'up',function(newPage){
            currentPage = newPage;
            e.preventDefault();
            console.log('one page up',currentPage);
          });
        }
        totalDist += e.originalEvent.wheelDelta;
      } else {
        if(totalDist < -threshold){
          totalDist = 0;
          movePage(currentPage,3,'down',function(newPage){
            currentPage = newPage;
            e.preventDefault();
            console.log('one page down',currentPage);
          });
        }
        totalDist += e.originalEvent.wheelDelta;
      }
    }
  });

  $(".mainGrid").height(($(window).innerHeight() / 8) * grid_rows + 'px');
  $(".titleGrid").height(($(window).innerHeight() / 8) * title_grid_rows + 'px');

  titleGrid = initGrid(title_grid_rows, title_grid_cols, titleGrid, "title", ".titleGrid", 0);
  titleGrid.map(function(inner){
    inner.map(function(cur){
      cur.create(".titleGrid");
      cur.update(cur.width, cur.height, cur.offset);
    });
  });

  //initiating the grid
  grid = initGrid(grid_rows, grid_cols, grid, "", ".mainGrid", $(".titleGrid").height());
  grid.map(function(inner){
    inner.map(function(cur){
      cur.create(".mainGrid");
      cur.update(cur.width, cur.height, cur.offset);
    });
  });

  $(window).keydown(function(e) {
    if (e.key == "r") {
      resetAllBlocks();
    }
  })
});

$(window).resize(function(){
  grid.map(function(inner){
    inner.map(function(cur){
      cur.update(($(cur.containerName).width()/grid[0].length),($(cur.containerName).height()/grid.length), $(".titleGrid").height());
    })
  })

  titleGrid.map(function(inner){
    inner.map(function(cur){
      cur.update(($(cur.containerName).width()/titleGrid[0].length),($(cur.containerName).height()/titleGrid.length), 0);
    })
  })
});
