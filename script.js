angular.module('accountingRegex.controllers', []).
    controller('regexController', function($scope){
        $scope.test = "ward";
        $scope.controls = [
            {
                Name: "Date",
                Description: "Date like 01/01/2021 or 5/6/28",
                Regex: "(\\d{1,2}\\/\\d{1,2}\\/(\\d{2}|\\d{4}))",
                Options: []
            },
            {
                Name: "Normal Word",
                Description: "Word like 'dude' or 'Receipt'",
                Regex: "(\\w+)"

            }
        ];
    });



angular.module('accountingRegex', ['accountingRegex.controllers']);