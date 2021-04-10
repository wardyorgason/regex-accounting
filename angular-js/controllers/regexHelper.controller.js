function regexHelperController($scope){
    $scope.textInput;
    $scope.settings = {
        TrimLines: true
    }
    $scope.parsedLines = [];
    $scope.unmatchedLines = [];
    
    $scope.tabLinesOutput = "";
    $scope.missedRowsOutput = "";

    $scope.showDebug = false;
    $scope.debugButtonMessage = "Show Debug Output";

    $scope.controls = [
        {
            Id: 1,
            Name: "Date",
            Description: "Date like 01/01/2021 or 5/6/28. Allows a period at the end because of quickbooks",
            Regex: "(\\d{1,2}\\/\\d{1,2}\\/(?:\\d{4}|\\d{2})\.?)",
            Options: {}
        },
        {
            Id: 2,
            Name: "Normal Word",
            Description: `Word like 'dude' or 'Receipt' or 'out-of-stock',
            but also includes words with weird casing like 'McCormick'`,
            Regex: "([A-Za-z\\-]+)",
            Options: {}
        },
        {
            Id: 3,
            Name: "Optional Word",
            Description: `Just like 'Normal Word', but is optional for cases',
            where the information isn't standardized'`,
            Regex: "([A-Za-z\\-]+)?",
            Options: {
                Optional: true
            }
        },
        {
            Id: 4,
            Name: "Number w/ Optional Currency",
            Description: `This is for numbers like '$47.52', '50.',
            '-100.22' or '6,288.99'. For quickbooks #10023 is supported',
            'and it will exclude the #. It also allows a period at the end',
            'that will not get captured.`,
            Regex: "([\\$]?[\\-]?[\\d,]+[\\.]?[\\d]{0,2})",
            Options: {}
        },
        {
            Id: 5,
            Name: "Invoice Number",
            Description: `This is for integers (no decimal) like 10082',
            'or varying formats of invoice numbers like '#19293.' or '#19233:',
            'In the case of the previous, the '#' and '.' will not be captured`,
            Regex: "\\#?([0-9\\-]+)(?:\\.?|\\:?)",
            Options: {}
        },
        {
            Id: 6,
            Name: "Anything",
            Description: `This will capture anything (no pattern). It's
            really dependent on accurately tracking the values after it.`,
            Regex: "(.*?)",
            Options: {}
        },
        {
            Id: 6,
            Name: "End of Line",
            Description: `Matches the end of the line with an optional space before and after`,
            Regex: "$",
            Options: {
                EndOfLine: true
            }
        }
    ];

    $scope.currentRegexList = [];

    $scope.generateRegex = function() {
        var delimiter = "\\s+";
        var optionalDelimiter = "(?:\\s+)?";
        var finalString = "";
        var finalDelimiter = ""; // this is so we know the last delimiter added

        let listLength = $scope.currentRegexList.length;
        let listShortName = $scope.currentRegexList;
        for(let i = 0; i < listLength; i++){
            finalString += listShortName[i].Regex;

            let nextItemExists = i + 1 < listLength;
            if(
                // if the current item is optional
                (listShortName[i].Options && listShortName[i].Options.Optional) ||
                // if we are entering an end of line character
                (nextItemExists && listShortName[i+1].Options && listShortName[i+1].Options.EndOfLine))
                finalDelimiter = optionalDelimiter;
            else 
                finalDelimiter = delimiter;
            finalString += finalDelimiter;
        }
        //for(var control of $scope.currentRegexList){
            
        //}

        // removes the final \s+ from the end
        return finalString.substr(0, finalString.length - finalDelimiter.length);
    }

    $scope.generateReplaceRegex = function() {
        var delimiter = "\\t";
        var finalString = "";

        // in case we need to use parenthesis within a regex select
        // statement, we may need to increment the number by more than one.
        // That's what the ReplaceIndexModifier represents
        var count = 1;
        for(var control of $scope.currentRegexList){
            finalString += "\\" + (count)
            count += 1;
            finalString += delimiter;
        }

        return finalString.substr(0, finalString.length - delimiter.length);
    }

    $scope.splitIntoLines = function() {
        if($scope.textInput){
            var lines = [];
            for(var line of $scope.textInput.split('\n')){
                if($scope.settings.TrimLines)
                    line = line.trim();
                lines.push(line);
            }
            return lines;
        } else return [];
    }

    // this isn't working, feel free to rewrite
    $scope.applyRegex = function(){
        // split the input into lines
        var lines = $scope.splitIntoLines();
        var regexText = $scope.generateRegex();
        var finalResult = [];
        $scope.unmatchedLines = [];

        if(lines && regexText){
            var regex = new RegExp(regexText, 'g');
            for(var line of lines){
                var splitLine = [];
                // the ... evaluates the iterator
                let matches = [...line.matchAll(regex)];
                console.log(matches);
                console.log(line);
                if(matches && matches[0]){
                    // we split the result of the first match into our
                    // results then push in starting at index 1 (index 0
                    // has the concatenated result which we don't want)
                    for(var i = 1; i < matches[0].length; i++)
                        splitLine.push(matches[0][i]);
                } else {
                    $scope.unmatchedLines.push(line);
                }
                if(splitLine.length > 0)
                    finalResult.push(splitLine);
            }
            $scope.parsedLines = finalResult;
        } else {
            $scope.parsedLines = [];
            $scope.unmatchedLines = [];
        }

        // generate printable version of unmatched lines
        $scope.generateMissedRowsOutput();
        
        // generate a copyable tabbed output
        $scope.generateTabbedOutput();
    }

    $scope.generateTabbedOutput = function() {
        // generate tabbed output for parsedLines
        var delimiter = '\t';
        var newLine = '\n';

        // reset the output
        $scope.tabLinesOutput = "";

        // generate the lines
        if($scope.parsedLines.length > 0){
            for(var line of $scope.parsedLines) {
                var lineOutput = "";
                for(var match of line){
                    if(match)
                        lineOutput += match + delimiter;
                    else
                        lineOutput += delimiter;
                }
                lineOutput = lineOutput.substr(0, lineOutput.length - delimiter.length) + newLine;
                $scope.tabLinesOutput += lineOutput;
            }
        } 
    }

    $scope.generateMissedRowsOutput = function() {
        var newLine ='\n';
        
        $scope.missedRowsOutput = "";

        if($scope.unmatchedLines.length > 0){
            for(var line of $scope.unmatchedLines){
                $scope.missedRowsOutput += line + newLine;
            }
        } 
    }

    $scope.clearRegexList = function() {
        $scope.currentRegexList = [];
        $scope.parsedLines = [];
    }

    $scope.toggleDebugOutput = function(){
        if(!$scope.showDebug){
            $scope.showDebug = true;
            $scope.debugButtonMessage = "Hide Debug Output";
        } else {
            $scope.showDebug = false;
            $scope.debugButtonMessage = "Show Debug Output";
        }
        console.log("hello");
        
    }

    $scope.handleControlClick = function(event, control){
        $scope.currentRegexList.push(control);
        $scope.applyRegex();
    }

    $scope.handleRemoveLastItemClick = function(){
        $scope.currentRegexList.pop();
        $scope.applyRegex();
    }
};