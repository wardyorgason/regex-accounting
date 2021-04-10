function tableSplitterController($scope){
    $scope.columnCount = 1;
    $scope.includesHeader = false;
    $scope.rotateTable = false;
    $scope.textInput = "";
    $scope.tableHeaders = [];
    $scope.tableBody = [];
    $scope.outputTabs = "";
    $scope.lines = [];

    $scope.handlePlusClick = function() {
        $scope.columnCount++;
        $scope.updateTable();
    }

    $scope.handleMinusClick = function() {
        if($scope.columnCount > 1)
            $scope.columnCount--;
        
        $scope.updateTable();
    }

    $scope.handleTextInputChange = function(){
        $scope.updateTable();
    }

    $scope.handleCheckboxClick = function(){
        $scope.updateTable();
    }

    $scope.updateTable = function() {
        // break into individual lines
        $scope.lines = $scope.textInput.split('\n');
        var lines = $scope.lines;
        var columnCount = $scope.columnCount;

        // split into columns
        $scope.tableBody = [];
        $scope.tableHeaders = [];
        

        console.log(lines.length);
        console.log("hello");

        for(var i = 0; i < lines.length; i += columnCount){
            var rowTemplate = []; 
            
            // fill each cell with "" so we can populate it later
            for(var j = 0; j < columnCount; j++){
                rowTemplate.push(lines[i+j]);
            } 
            $scope.tableBody.push(rowTemplate);
        }

        if($scope.rotateTable){
            let newTable = [];
            for(let m = 0; m < $scope.columnCount; m++){
                let newRow = [];
                for(let k = 0; k < $scope.tableBody.length; k++){
                    newRow.push($scope.tableBody[k][m]);
                }
                newTable.push(newRow);
            }
            $scope.tableBody = newTable;
        }
    
        // output tabs
        $scope.outputTabs = "";
        let delimiter = '\t';
        let newLine = '\n';

        for(let h = 0; h < $scope.tableBody.length; h++){
            let currentLine = "";
            for(let p = 0; p < $scope.tableBody[0].length; p++){
                currentLine += $scope.tableBody[h][p] + delimiter;
            }
            $scope.outputTabs += currentLine.substr(0, currentLine.length - delimiter.length) + newLine;
        }
        
        

        /*var numRows = Math.ceil(lines.length / $scope.columnCount);
        for(var colNumber = 0; colNumber < $scope.columnCount; colNumber++){
            for(var rowNumber = 0; rowNumber < numRows; rowNumber++){

            }
        }

        for(var i = 0; i < lines.length; i+= $scope.columnCount){
            var currentRow = [];
            for(var j = 0; j < $scope.columnCount; j++){
                if(typeof(lines[j + i] !== 'undefined')){
                    currentRow.push(lines[j+i]);
                }
            }

            if(i == 0 && $scope.includesHeader == true){
                $scope.tableHeaders = currentRow;
            } else {
                $scope.tableBody.push(currentRow);
            }
        }*/
    }
}