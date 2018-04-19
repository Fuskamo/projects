function returnHeros() {
	var hero_list = ["visionary", "absolute_zero", "absolute_zero_elemental_wrath", "haka", "setback", "argent_adept", 
		"bunker", "legacy", "fanatic", "chrono_ranger", "guise", "scholar", "tachyon", "captain_cosmic", "expatriette", "knyfe", "ra", 
		"parse", "mister_fixer", "wraith", "sky_scraper", "tempest", "the_naturalist", "nightmist", "the_sentinels", "omnitron_x", "unity"];
	hero_list.sort();
	return hero_list;
}
function returnVillians() {
	var vil_list = ["akashbhuta", "ambuscade", "apostate", "baron_blade", "baron_blade_mad_bomber", "the_chairman", "citizen_dawn", "cosmic_omnitron",
		"deadline", "the_dreamer", "gloomweaver", "gloomweaver_skinwalker", "infinitor", "iron_legacy", "kaargra_warfang", "kismet", "la_capitan", "the_matriarch",
		"miss_information", "omnitron", "voss", "wager_master", "plague_rat", "progeny", "spite", "spite_agent_of_gloom", "ennead"]
	vil_list.sort();
	return vil_list;
}
function returnEnv() {
	var env_list = ["the_block", "freedom_tower", "pike_industrial_complex", "rook_city", "insula_primalis", "megalopolis", "ruins_of_atlantis", "dokthorath_capital",
		"mobile_defense_platform", "omnitron_iv", "realm_of_discord", "enclave_of_the_endlings", "final_wasteland", "silver_gulch_1883"]
	env_list.sort();
	return env_list;
}

//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//

function loadHeros() {
	clearDiv();	
	hero_new = returnHeros();
	for (i=0; i<hero_new.length; i++) {
		hero_name = convertName(hero_new[i]);
		document.getElementById("hero_data").innerHTML += "<img src=images/hero/"+hero_new[i]+".png class=mini id="+"'"+hero_name+"'"+"draggable='true' ondragstart='drag(event);'></img>";
	}
	clearClass();
	document.getElementById("Herosbar").className = "navicon_clicked";
	document.getElementById("directions").innerHTML = "Drag and drop a hero card onto the slot below to load the stats for the hero.";
	console.log("Loaded "+i+" heros");
}
function loadVillians() {
	clearDiv();
	vil_new = returnVillians();
	for (i=0; i<vil_new.length; i++) {
		vil_name = convertName(vil_new[i]);
		document.getElementById("hero_data").innerHTML += "<img src=images/villian/"+vil_new[i]+".png class=mini id="+"'"+vil_name+"'"+"draggable=true ondragstart=drag(event)></img>";
	}
	clearClass();
	document.getElementById("Villiansbar").className = "navicon_clicked";
	document.getElementById("directions").innerHTML = "Drop a villian card onto the slot below! Try not to be spooked out!";
	console.log("Loaded "+i+" villians");
}
function loadEnvironments() {
	clearDiv();
	env_new = returnEnv();
	for (i=0; i<env_new.length; i++) {
		env_name = convertName(env_new[i]);
		convertName(env_name);
		document.getElementById("hero_data").innerHTML += "<img src=images/env/"+env_new[i]+".png class=mini id="+"'"+env_name+"'"+"draggable='true' ondragstart=drag(event)></img>";
	}
	clearClass();
	document.getElementById("Environmentsbar").className = "navicon_clicked";
	document.getElementById("directions").innerHTML = "Drag and drop an environment card onto the slot below to load the stats for that environment!";
	console.log("Loaded "+i+" environments");
}
function loadPlayers() {
	clearDiv();
	document.getElementById("hero_data").innerHTML = "This information coming soon!! Standy"
	clearClass();
	document.getElementById("Playersbar").className = "navicon_clicked";
	document.getElementById("directions").innerHTML = "Drag and drop a player card onto the slot below to load the stats for the player. It's super cool stuff!";
	console.log("No players to load. Bitch at Kyle for that");
}
function loadGames() {
	clearDiv();
	document.getElementById("hero_data").innerHTML = "This information coming soon!! Standy"
	clearClass();
	document.getElementById("Gamesbar").className = "navicon_clicked";
	document.getElementById("directions").innerHTML = "Select a game on the left to load the stats for that game. I'm kinda meh about it.";
	console.log("No games to load. Bitch at Kyle for that");
}

//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//

function heroStats(hero) {
	document.getElementById("stats").innerHTML ="";
	var baseStats = getHeroData(hero);
	var d = difficultyCheck(baseStats.complexity);
	document.getElementById("edition").innerHTML ="<img class='centered' src='images/edition/"+baseStats.edition+".png' />";
	document.getElementById("stats").innerHTML +="<p>Hero: "+baseStats.name+"</p>";
	document.getElementById("stats").innerHTML +="<p>Max HP: "+baseStats.maxhp+"</p>";
	document.getElementById("stats").innerHTML +="<p>Complexity: "+d+"</p>";
	document.getElementById("stats").innerHTML +="<p class='paragraph' >About: "+baseStats.description+"</p>";
	document.getElementById("card_title").innerHTML= baseStats.name;
}
function villianStats(villian) {
	document.getElementById("stats").innerHTML ="";
	var baseStats = getVillianData(villian);
	var d = difficultyCheck(baseStats.difficulty);
	document.getElementById("edition").innerHTML ="<img class='centered' src='images/edition/"+baseStats.edition+".png' />";
	document.getElementById("stats").innerHTML +="<p>Villian: "+baseStats.name+"</p>";
	document.getElementById("stats").innerHTML +="<p>Title: "+baseStats.title+"</p>";
	document.getElementById("stats").innerHTML +="<p>Max HP: "+baseStats.maxhp+"</p>";
	document.getElementById("stats").innerHTML +="<p>Difficulty: "+d+"</p>";
	document.getElementById("stats").innerHTML +="<p>Deck Type: "+baseStats.deck+"</p>";
	document.getElementById("stats").innerHTML +="<p>Nemesis: "+baseStats.nemesis+"</p>";
	document.getElementById("card_title").innerHTML= baseStats.name;
	loadNemesis(baseStats.nemesis);
}
function envStats(env) {
	document.getElementById("stats").innerHTML ="";
	var baseStats = getEnvData(env);
	var d = difficultyCheck(baseStats.difficulty);
	document.getElementById("edition").innerHTML ="<img class='centered' src='images/edition/"+baseStats.edition+".png' />";
	document.getElementById("stats").innerHTML +="<p>Environment: "+baseStats.name+"</p>";
	document.getElementById("stats").innerHTML +="<p>Difficulty: "+d+"</p>";
	document.getElementById("stats").innerHTML +="<p>About: "+baseStats.type+"</p>";
	document.getElementById("card_title").innerHTML= baseStats.name;
}
function playerStats(player) {
	document.getElementById("stats").innerHTML="PLAYER DATA: loading all the data for "+player+", DUH!";
	document.getElementById("card_title").innerHTML= player;
}
function gameStats() {
	place = returnEnv();
	enemy= returnVillians();
	var random_villian = enemy[Math.floor(Math.random() * enemy.length)];
	var random_place = place[Math.floor(Math.random() * place.length)];
	console.log(random_villian);
	console.log(random_place);
	document.getElementById("stats").innerHTML="Concerning the matter of the heros who happened across "+random_villian+" in the "+random_place;
		document.getElementById("stats").innerHTML="GAME DATA: loading all the data for "+game+", DUH!";
	document.getElementById("card_title").innerHTML= game;
}

function difficultyCheck(num) {
	if (num == 1){return "Easy"}
	if (num == 2){return "Moderate"}
	if (num == 3){return "Hard"}
	if (num == 4){return "Very Hard"}
	if (num == 4){return "Extremely Difficult"}
	else {return "Unknown"}
}

//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//
//---------------------------------------------------------------------------//

function fakeVillian() {
	var vstats = {name:"citizen_dawn", maxhp:"80", gamesplayed:"6", killcount:"12"};
	return vstats;
}

function fakePlayer() {
	var pstats = {name:"dave", gamesplayed:"17", gameswon:"5"};
	return pstats;
}
function fakeGame() {
	var gstats = {date:"1-29-15", villian:"kismet", villianhp:"32", env:"the_block"};

	return gstats;
}
