angular.module('accountingRegex.controllers', []).
    controller('regexController', function($scope){
        $scope.textInput;
        $scope.settings = {
            TrimLines: true
        }
        $scope.parsedLines = [];

        $scope.controls = [
            {
                Id: 1,
                Name: "Date",
                Description: "Date like 01/01/2021 or 5/6/28",
                Regex: "(\\d{1,2}\\/\\d{1,2}\\/(?:\\d{4}|\\d{2}))",
                Options: []
            },
            {
                Id: 2,
                Name: "Normal Word",
                Description: `Word like 'dude' or 'Receipt' or 'out-of-stock',
                but also includes words with weird casing like 'McCormick'`,
                Regex: "([A-Za-z\\-]+)",
                Options: []
            },
            {
                Id: 3,
                Name: "Alphanumeric 'Word' with possible underscores",
                Description: "Word like 'dude_47' or 'asdf1234'",
                Regex: "(\\w+)",
                Options: []
            },
            {
                Id: 4,
                Name: "Number w/o Currency",
                Description: `This is for numbers like '$47.52', '50.',
                '-100.22' or '6,288.99'`,
                Regex: "([\\$]?[\\-]?[\\d,]+[\\.]?[\\d]{0,2})",
                Options: []
            },
            {
                Id: 5,
                Name: "Anything",
                Description: `This will capture anything (no pattern). It's
                really dependent on accurately tracking the values after it.`,
                Regex: "(.*?)",
                Options: []
            }
        ];

        $scope.currentRegexList = [];

        $scope.generateRegex = function() {
            var delimiter = "\\s+";
            var finalString = "";
            for(var control of $scope.currentRegexList){
                finalString += control.Regex;
                finalString += delimiter;
            }

            // removes the final \s+ from the end
            return finalString.substr(0, finalString.length - delimiter.length);
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
                    }
                    finalResult.push(splitLine);
                }
                $scope.parsedLines = finalResult;
            } else {
                $scope.parsedLines = [];
            }
        }

        $scope.clearRegexList = function() {
            $scope.currentRegexList = [];
            $scope.parsedLines = [];
        }

        $scope.handleControlClick = function(event, control){
            $scope.currentRegexList.push(control);
            $scope.applyRegex();
        }
    });



angular.module('accountingRegex', ['accountingRegex.controllers']);
