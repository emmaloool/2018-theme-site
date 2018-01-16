var TOPBLOCK = ".mainGrid #3_2 .inner"
var BOTTOMBLOCK = ".mainGrid #7_0 .inner"
var LEFTBLOCK = ".mainGrid #3_0 .inner"
var RIGHTBLOCK = ".mainGrid #3_6 .inner"
var MIDDLEBLOCK = ".mainGrid #5_3 .inner"

var leftBlockTitle = "2268"
var leftBlockDesc = "Welcome to the year 2268. After centuries of disastrous climate change, where rapid urbanization and pollution have distorted the way we approach growth in an urban landscape, where do we stand? 2268 explores this inquisition from two perspectives. The first perspective captures extreme pollution and the second perspective captures sustainability to the extreme where urbanization has gotten out of control and the soil has become rotten, forcing us to carry the food we need to eat"
var leftBlockDesigners = "Hamza Quereshi, Susie Lee, Anny Fan"

var HIGHLIGHTEDBLOCK = null;

var TOTALLINES = 19;
var currentLineIndex = 0;

$(window).ready(function () {
    // TODO: make call this on every page, instead of hardcoding it for each endpoint
    animateBlock("#1_6",1,1);
    $("#1_6 .inner").text("NAV").addClass("navBlock");

    $(document).keydown(function (e) {
        var LEFT = 37;
        var RIGHT = 39;
        // TODO: left/right analagous to scrolling
        // should not be able to change lines when a block is highlighted
        if (HIGHLIGHTEDBLOCK) {
            return;
        }

        if (e.which === LEFT) {
            if (currentLineIndex > 0) {
                currentLineIndex--;
            } else {
                return
            }
            // previous line
        } else if (e.which === RIGHT) {
            // next line
            if (currentLineIndex < TOTALLINES - 1) {
                currentLineIndex++;
            } else {
                return
            }
        } else {
            return;
        }

        var line = FAKELINESDATA[currentLineIndex];
        setLine(line)
    })
    

    // TODO: change data on scroll
    $("body").bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta /120 > 30) {
            console.log('scrolling up !');
        }
        else{
            console.log('scrolling down !');
        }
    });

    animateBlock("#0_0", 0,1);
    $(".mainGrid #0_0 .inner")
        .text("⟵ Humans")
        .addClass("topLink")
        .click(function () {
            // go to humans page
        });

    animateBlock("#0_6", 0,1);
    $(".mainGrid #0_6 .inner")
        .text("About ⟶")
        .addClass("topLink")
        .click(function () {
            // go to about page
        });

    // Lines title
    animateBlock("#1_1",0,1);
    $(".mainGrid #1_1 .inner").text("Lines").addClass("title");

    // initial animates
    animateBlock("#3_2", 0, 3, true) // top
    animateBlock("#3_0", 2,0, true); // left
    animateBlock("#5_3", 0,2, true); // middle
    animateBlock("#3_6", 2,0, true); // right
    animateBlock("#7_0", 0,2, true); // bottom

    $(TOPBLOCK)
        .addClass("linesBlock aboutImg1 top")
        .html("<div class='content'><h1 class='title'></h1></div>")

    // LEFT BLOCK
    $(LEFTBLOCK)
        .html("<div class='content'><h1 class='title'></h1><p class='designers'></p><p class='description'></p></div>")
        .addClass("linesBlock aboutImg1 left")

    // TODO: filler gridlines
    // $("#3_0.block").append("<div class='dummy-block'></div><div class='dummy-block'></div><div class='dummy-block'></div>")/

    // MIDDLE BLOCK
    $(MIDDLEBLOCK)
        .html("<div class='content'><h1 class='title'></h1></div>")
        .addClass("linesBlock aboutImg1 middle")

    // RIGHT BLOCK
    $(RIGHTBLOCK)
        .html("<div class='content'><h1 class='title'></h1></div>")
        .addClass("linesBlock aboutImg1 right")

    // BOTTOM BLOCK
    $(BOTTOMBLOCK)
        .html("<div class='content'><h1 class='title'></h1></div>")
        .addClass("linesBlock aboutImg1 bottom")


    setLine(FAKELINESDATA[0])

    $(document).keydown(function (e) { if (e.key == "c") { changeContent({}); } });


    $("body").click(function (e) {
        var elem = e.target;

        // this is ugly but it works (i think)
        var blockid = ($(elem).hasClass("linesBlock") && $(elem).parent().attr("id")) || 
                        ($(elem).parent().parent().attr("id")) || 
                        ($(elem).parent().parent().parent().attr("id"))

        console.log(elem, blockid)
        if (blockid) {
            // var blockid = $(elem).parent().attr("id");
            if (!HIGHLIGHTEDBLOCK){
                $(".block").toggleClass('muted')
                $("#" + blockid + ".block").toggleClass('highlighted');
                HIGHLIGHTEDBLOCK = $("#" + blockid + ".block");

                $(HIGHLIGHTEDBLOCK).find(".aboutImg1").toggleClass("aboutImg1 aboutImg2");

                return;
            }

        }

        $(".block").removeClass("muted")
        $(".highlighted").removeClass("highlighted");

        // go back to dim background
        $(HIGHLIGHTEDBLOCK).find(".aboutImg2").toggleClass("aboutImg1 aboutImg2");
        HIGHLIGHTEDBLOCK = null;
    })
});

function setLine(line) {
    setLeftLinesBlock(line.leftBlock);
    setTopLinesBlock(line.topBlock);
    setMiddleLinesBlock(line.middleBlock);
    setRightLinesBlock(line.rightBlock);
    setBottomLinesBlock(line.bottomBlock);
}

// TODO: play around with these numbers
var FADEIN_DURATION = 300;
var FADEOUT_DURATION = 300;

function setLeftLinesBlock(blockData) {
    $(LEFTBLOCK + " .title").fadeOut(FADEOUT_DURATION,function() { $(this).text(blockData.title).fadeIn(FADEIN_DURATION)});
    $(LEFTBLOCK + " .designers").text(blockData.designers);
    $(LEFTBLOCK + " .description").text(blockData.description);
}

function setTopLinesBlock(blockData) {
    $(TOPBLOCK + " .title").fadeOut(FADEOUT_DURATION,function() { $(this).text(blockData.title).fadeIn(FADEIN_DURATION)});
}

function setMiddleLinesBlock(blockData) {
    $(MIDDLEBLOCK + " .title").fadeOut(FADEOUT_DURATION,function() { $(this).text(blockData.title).fadeIn(FADEIN_DURATION)});
}

function setRightLinesBlock(blockData) {
    $(RIGHTBLOCK + " .title").fadeOut(FADEOUT_DURATION,function() { $(this).text(blockData.title).fadeIn(FADEIN_DURATION)});
}

function setBottomLinesBlock(blockData) {
    $(BOTTOMBLOCK + " .title").fadeOut(FADEOUT_DURATION,function() { $(this).text(blockData.title).fadeIn(FADEIN_DURATION)});
}

function setBlockImage(blockSelector, img) {

}

var FAKELINESDATA = []

function Line(leftBlock, topBlock, rightBlock, bottomBlock, middleBlock) {
    this.leftBlock = leftBlock;
    this.topBlock = topBlock;
    this.rightBlock = rightBlock;
    this.bottomBlock = bottomBlock;
    this.middleBlock = middleBlock;
}

// 19 lines - this is fake data
for (var i = 0; i < TOTALLINES; i++) {
    var lineNum = '(line ' + i + ')'
    var left = {
        title: '2268 ' + lineNum,
        designers: "Hamza Quereshi, Susie Lee, Anny Fan",
        description: leftBlockDesc
    }

    var topBlock = { // can't use variable name "top" since it is a built-in JS variable
        title: "amzu-amzu " + lineNum
    }

    var right = {
        title: "chroma " + lineNum
    }

    var bottom = {
        title: "descent " + lineNum
    }

    var middle = {
        title: "chinoiseries " + lineNum
    }

    FAKELINESDATA.push(new Line(left,topBlock,right,bottom,middle));
}

