var app = app || {};

var getDefaultHeightDiffs = _.memoize(function () {
    var textAreaDummy = $(document.createElement("textarea"));
    textAreaDummy.css("visibility", "hidden");
    $("footer").append(textAreaDummy);
    var defaultScrollHeight = textAreaDummy[0].scrollHeight;

    textAreaDummy.val("\n");
    textAreaDummy.css("height", "auto");

    return {scrollHeight: defaultScrollHeight, heightDiff: textAreaDummy[0].scrollHeight - defaultScrollHeight};
});

function getTextAreaHeightFromScrollHeight(scrollHeight) {
    var defaultHeight = 25;
    var defaultHeightDiffs = getDefaultHeightDiffs();
    if (scrollHeight < defaultHeightDiffs.scrollHeight) {
        return defaultHeight;
    }

    return ((scrollHeight - defaultHeightDiffs.scrollHeight) / defaultHeightDiffs.heightDiff) * defaultHeight;
}

app.dimensionUtils = {
    getDefaultHeightDiffs: getDefaultHeightDiffs,
    getTextAreaHeightFromScrollHeight: getTextAreaHeightFromScrollHeight
};