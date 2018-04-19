function initDatabase() {
	finished = "false";
	var request = indexedDB.open("casedb");

	request.onupgradeneeded = function() {
		// The database did not previously exist, so create object casess and indexes.
		var db = request.result;
		var cases = db.createObjectStore("table", {keyPath: "casenum"});
		var caseIndex = cases.createIndex("by_caseid", "casenum", {unique: true});
		var nameIndex = cases.createIndex("by_name", "name");
		var priorityIndex = cases.createIndex("by_priority", "priority");
		var dataContact = cases.createIndex("by_contact", "contact");
		var statusIndex = cases.createIndex("by_status", "status");
		var notesIndex = cases.createIndex("by_notes", "notes");
		console.log("Created DB");
		
		// Populate with initial data.
		cases.put({casenum:"08551592", name:"Kim Johnson", priority:"normal", contact:"5/01/15", status:"callback", notes:"Need to get a dtrace going"});
		cases.put({casenum:"08652317", name:"Andrew Kiehl", priority:"low", contact:"5/01/15", status:"update", notes:"Awaiting update from customer"});
		cases.put({casenum:"08677909", name:"Rodney Nelson", priority:"normal", contact:"5/05/15", status:"callback", notes:"1st Attempt"});
	};

	request.onsuccess = function() {
		db = request.result;
		console.log("Loaded DB");
	};
	finished = "true";
}

function updateTable() {
	var tx = db.transaction("table", "readwrite");
	var cases = tx.objectStore("table");

	cases.put({title: "Quarry Memories", author: "Fred", isbn: 123456});
	cases.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
	cases.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});

	tx.oncomplete = function() {
	  // All requests have succeeded and the transaction has committed.
	};

}

function querySingleObject() {
	var tx = db.transaction("table", "readonly");
	var cases = tx.objectStore("table");
	var index = cases.index("by_caseid");

	var request = index.get("Bedrock Nights");
	request.onsuccess = function() {
		var matching = request.result;
		if (matching !== undefined) {
			// A match was found.
			report(cursor.value.casenum, cursor.value.name, cursor.value.status);
		} else {
		// No match was found.
			report(null);
		}
	};
}

function queryObjectColumns(input) {
	var tx = db.transaction("table", "readonly");
	var cases = tx.objectStore("table");
	var index = cases.index("by_status");
	var request = index.openCursor(IDBKeyRange.only(input));
	request.onsuccess = function() {
		var cursor = request.result;
		if (cursor != undefined) {
			console.log(cursor.length);
			//console.log(cursor.value.length);
			console.log(cursor.value.casenum, cursor.value.name, cursor.value.status);
			cursor.continue();
		} else {
			// No more matching records.
			//report(null);
		}
	};
}