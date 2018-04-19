function initDatabase() {
	try {
	    if (!window.openDatabase) {
	        alert('Databases are not supported in this browser.');
	    } else {
	        var shortName = 'CASEDB';
	        var version = '1.0';
	        var displayName = 'Case DB';
	        var maxSize = 100000; //  bytes
	        db = openDatabase(shortName, version, displayName, maxSize);
			createTables();
			//selectAll();
	    }
	} catch(e) {
 
	    if (e == 2) {
	        // Version number mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+e+".");
	    }
	    return;
	}
}

function createTables(){
	db.transaction(function (tx) {
        	tx.executeSql('CREATE TABLE IF NOT EXISTS cases(id INTEGER PRIMARY KEY AUTOINCREMENT, casenum INTEGER UNIQUE, customer TEXT, status TEXT, priority TEXT, contact DATE, notes TEXT);');
        }
    );
	prePopulate();
}
	
function prePopulate(){
	db.transaction(function (tx) {
		var data = ['08652317','Andrew Kiehl','update','low','5/05/15', 'EVSVR Logs'];
		tx.executeSql("INSERT INTO cases(casenum, customer, status, priority, contact, notes) VALUES (?, ?, ?, ?, ?, ?)", [data[0], data[1], data[2], data[3], data[4], data[5]]);
	});
}

function selectAll(){
	db.transaction(function (tx) {
	        tx.executeSql("SELECT casenum FROM cases;", [], function(tx, results) {}, function(tx, error) {});
	    }
	);
}

function backlog() {
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM cases', [], function (tx, results) {
			 var len = results.rows.length;
			 for (var i = 0; i < len; ++i) {
				var obj = results.rows.item(i);
				console.log(obj);
		}
		});
	});
}

function oldCountQuery(input) {
	var num=0;
	db.transaction(function (tx) {
		tx.executeSql("SELECT COUNT(*) AS count FROM cases WHERE status = '"+input+"'", [], function (tx, results) {
			counts.push(results.rows.item(0).count);
			num = obj.count;
			
			//console.log(num);
			
		});
	});
	return num;
}



function countQuery(input, cb) {
	db.transaction(function (tx) {
		tx.executeSql("SELECT COUNT(*) AS cnt FROM cases WHERE status = '"+input+"'", [], 
			function(tx, results) {
				counts.push(results.rows.item(0).cnt);
				nextp = parseInt(results.rows.item(0).cnt);
				cb(nextp);
});});}


function errorHandler(transaction, error) {
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
    var isFatal = true;
    if (isFatal) return true;
    return false;
}
 
function dataHandler(transaction, results) {
    //for (var i=0; i<results.rows.length; i++) {
    //    var row = results.rows.item(i);
    //}
    console.log(results);
	//return results.count;
}
 




function dropDB(){
	db.transaction(function (tx) {
	    	tx.executeSql("DROP TABLE IF EXISTS cases;", []);
	    }
	);
	//location.reload();
}


//update value
//var name = 'jdoe';
//var shirt = 'fuschia';
 
//db.tx(
//  function (tx) {
//        tx.executeSql("UPDATE people set shirt=? where name=?;",
//           [ shirt, name ]); // array of values for the ? placeholders
//    }
//);




