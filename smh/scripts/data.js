function getHeroData(request) {
	//---------ENHANCED---------//
		var absolute_zero = {name:"absolute zero", edition:"enhanced", complexity:"3", maxhp:"29", role:"dps", damage:"cold", description:"The most complicated hero in the base game to play, Absolute Zero (AZ)uses his equipment to deal damage to himself. AZ uses that damage to heal himself and deal damage to his enemies. A complicated, but rewarding character to play."};	
		var bunker = {name:"The Indestructible bunker", edition:"enhanced", complexity:"2", maxhp:"28", role:"dps", damage:"projectile", description:"Bunker uses different Mode cards to accelerate his game plan, albeit at a cost. From laying more cards, to drawing more cards, how and when you lay these cards is the key to this equipment-heavy beater."};
		var fanatic = {name:"fanatic", edition:"enhanced", complexity:"2", maxhp:"30", role:"multiple", damage:"irreducable", description:"An eclectic character, Fanatic is for those who never want to play the same game twice. She's willing to use her own health to destroy minions and disrupt villains plans. Use Fanatic if you want a hero who brings variety to the table (she has more unique cards than any other) and can adept to any situation."};
		var haka = {name:"the savage haka", edition:"enhanced", complexity:"1", maxhp:"34", role:"dps", damage:"melee", description:"Haka likes to draw cards. Haka will often times have more cards in his hand than any other hero, using them to power up cards that heal, increase damage, and reduce damage. While his highest-starting Health means he is often times the tank, don't let that fool you, Haka likes to hit things...hard."};
		var legacy = {name:"america's finest legacy", edition:"enhanced", complexity:"1", maxhp:"32", role:"support", damage:"unknown", description:"Legacy is a pure support/tank hybrid, and any group will be happy to have him along. From heals to damage boosts to damage reduction and redirection, Legacy makes the rest of the team better."};
		var ra = {name:"the mighty ra", edition:"enhanced", complexity:"1", maxhp:"30", role:"dps", damage:"fire", description:"Let's clear one thing up, Ra likes to hit things...hard...with fire. Ra is the master of single-target damage. Ra's damage starts out good and just gets better and better. Fire GOOD!"};
		var tachyon = {name:"tachyon: the quickest woman on earth", edition:"enhanced", complexity:"2", maxhp:"27", role:"dps", damage:"melee", description:"Tachyon loves the discard pile. A speedster at heart, Tachyon wants to play her abundance of one-shots as quickly as possible, getting them into the discard pile. Once she has a large group there, she unleashes them, dealing heavy damage. Fantastic at taking out groups of minions, Tachyon draws and plays cards faster than anyone else."};
		var tempest = {name:"tempest", edition:"enhanced", complexity:"1", maxhp:"26", role:"dps", damage:"lightning", description:"This god of weather really doesn't care who he hits, he's probably just going to hit them all. Using frost, lightning and wind, Tempest is going to hit everything. A strong heal, some good card draw, and you have an alien who's willing to take on all comers."};
		var visionary = {name:"the visionary", edition:"enhanced", complexity:"2", maxhp:"26", role:"support", damage:"psychic", description:"You don't play Visionary if you want to deal damage. You play Visionary because you want to control the battlefield like no other. Using a host of powers and abilities, Visionary can redirect villains attacks, control the villains deck and make your heroes draws better. "};
		var wraith = {name:"the wraith", edition:"enhanced", complexity:"1", maxhp:"26", role:"multiple", damage:"damages", description:"I am Batma...er, The Wraith. Wraith is an all-around hero. She can hit hard, disrupt the villain and mess with the environment. Wraith and her large supply of equipment will always have the answer."};
		//---------ROOK CITY---------//
		var expatriette = {name:"expatriette: the one-woman army", edition:"rook", complexity:"2", maxhp:"29", role:"dps", damage:"projectile", description:"Expatriatte enjoys using guns and ammo to gain different effects. Given enough time this damage-dealer will probably have a gun for any situation."};
		var mr_fixer = {name:"mr. fixer", edition:"rook", complexity:"2", maxhp:"28", role:"support", damage:"melee", description:"With a base power that only deals 1 damage, Mr Fixer's strength is in his versatility, not his damage. Mr Fixer will change his two main types of cards, styles and tools, to whatever he needs most. Mr Fixer will almost never be the highest damage dealer in a game, but his versatility brings a lot to the table."};
		//---------INFERNAL RELICS---------//
		var argent_adept = {name:"the argent adept", edition:"relics", complexity:"3", maxhp:"24", role:"support", damage:"nature", description:"If you thought no one could be more of a support player than Legacy, it's because you haven't met the Argent Adept. Listed as one of the toughest characters to play, the Adept likes to mix and match various on-going cards and equipment to gain a wide variety of abilities. Proper planning is key, as his abilities can do anything from healing to allowing characters to play additional powers and cards."};
		var nightmist = {name:"nightmist", edition:"relics", complexity:"3", maxhp:"27", role:"multiple", damage:"infernal", description:"This white-haired lady uses her unique 'Magic number' in the bottom corner to activate her various powers. From damage to drawing cards to healing, the numbers on the cards boost her abilities in various ways. This misty lady is considered one of the 3 hardest characters in the game, as her powers oftentimes come at the cost of her own life."};
		//---------SHATTERED TIMELINES---------//
		var chrono_ranger = {name:"chrono-ranger: man out of time", edition:"timelines", complexity:"2", maxhp:"28", role:"dps", damage:"projectile", description:"This dude shoots, prolly"};
		var omnitron_x = {name:"omnitron-x", edition:"timelines", complexity:"2", maxhp:"25", role:"dps", damage:"electric", description:"This guy is like omnitron, but not"};	
		//---------VENGEANCE---------//
		var knyfe = {name:"k.n.y.f.e: agent of filter", edition:"vengeance", complexity:"1", maxhp:"30", role:"dps", damage:"melee", description:"I think this guy like to knyfe people... IDK for reals though"};
		var the_naturalist = {name:"the naturalist", edition:"vengeance", complexity:"2", maxhp:"29", role:"dps", damage:"nature", description:"I think this guy fights in the buff.. el natural!"};
		var parse = {name:"parse", edition:"vengeance", complexity:"2", maxhp:"26", role:"dps", damage:"projectile", description:"Add some info about parse!"};
		var the_sentinels = {name:"the sentinels", edition:"vengeance", complexity:"3", maxhp:"52", role:"support", damage:"psychic", description:"Play as 4 heros instead of 1!"};
		var setback = {name:"setback: a change from better to worse", edition:"vengeance", complexity:"3", maxhp:"31", role:"dps", damage:"melee", description:"Are you lucky? Or unlucky?? Use the lucky dice to add or remove luck."};
		//---------WRATH OF THE COSMOS---------//
		var captain_cosmic = {name:"captain cosmic", edition:"cosmos", complexity:"1", maxhp:"27", role:"support", damage:"electric", description:"It's all about dem constructs!!"};
		var sky_scraper = {name:"sky-scraper", edition:"cosmos", complexity:"2", maxhp:"33", role:"dps", damage:"sonic", description:"Switch forms to gain new powers and manipulate links"};
		//---------MINI EXPANSIONS---------//
		var unity = {name:"unity", edition:"enhanced", complexity:"2", maxhp:"26", role:"minion", damage:"plasma", description:" A rather unique character, Unity has her own type of card, called Mechanical Golems, except she cannot lay them during her play phase. These non-equipment, non-ongoing cards stay in play and are targeted just like heroes. Once you get a number of them into play, you may start wondering if you even need the other heroes..."};
		var scholar = {name:"the scholar", edition:"enhanced", complexity:"2", maxhp:"29", role:"support", damage:"psychic", description:"I have no clue what this guys does..?"};
		var guise = {name:"guise", edition:"enhanced", complexity:"3", maxhp:"27", role:"dps", damage:"melee", description:"I've never seen this guy played, but I think he punches faces"};	
		//---------PROMOS---------//
		var bunker_gi = {name:"g.i. bunker", edition:"enhanced", complexity:"2", maxhp:"27", role:"dps", damage:"projectile", description:"Promo for Bunker"};
		var bunker_engine_of_war = {name:"bunker: engine of war", edition:"enhanced", complexity:"2", maxhp:"27", role:"dps", damage:"projectile", description:"Promo for Bunker"};
		var absolute_zero_elemental_wrath = {name:"absolute zero: elemental wrath", edition:"enhanced", complexity:"3", maxhp:"27", role:"multiple", damage:"cold", description:"Promo for Absolute Zero"};

	//------------------------------------//
	//------RETURN FUNCTION------//
	//-----------------------------------//

	if (request == "absolute zero") {return absolute_zero;}
	if (request == "bunker") {return bunker;}
	if (request == "fanatic") {return fanatic;}
	if (request == "haka") {return haka;}
	if (request == "legacy") {return legacy;}
	if (request == "ra") {return ra;}
	if (request == "tachyon") {return tachyon;}
	if (request == "tempest") {return tempest;}
	if (request == "visionary") {return visionary;}
	if (request == "wraith") {return wraith;}
	if (request == "expatriette") {return expatriette;}
	if (request == "mister fixer") {return mr_fixer;}
	if (request == "argent adept") {return argent_adept;}
	if (request == "nightmist") {return nightmist;}
	if (request == "chrono ranger") {return chrono_ranger;}
	if (request == "omnitron x") {return omnitron_x;}
	if (request == "knyfe") {return knyfe;}
	if (request == "parse") {return parse;}
	if (request == "setback") {return setback;}
	if (request == "captain cosmic") {return captain_cosmic;}
	if (request == "sky scraper") {return sky_scraper;}
	if (request == "unity") {return unity;}
	if (request == "scholar") {return scholar;}
	if (request == "guise") {return guise;}
	if (request == "the naturalist") {return the_naturalist;}
	if (request == "the sentinels") {return the_sentinels;}
	if (request == "absolute zero elemental wrath") {return absolute_zero_elemental_wrath;}
}

function getVillianData(request) {
	//---------ENHANCED---------//
	var baron_blade = {name:"baron blade", edition:"enhanced", difficulty:"1", maxhp:"40", deck:"one-shot, ongoing, device, minion", nemesis:"legacy", title:"Terralunar Impulsion Beam Inventor"};
	var citizen_dawn = {name:"citizen dawn", edition:"enhanced", difficulty:"3", maxhp:"80", damage:"one-shot, ongoing, citizen", nemesis:"expatriette", title:"Leader of the Citizens of the Sun"};
	var grand_warlord_voss = {name:"grand warlord voss", edition:"enhanced", difficulty:"3", maxhp:"90", deck:"ongoing, device, minion, thorathian, dreadnaught, flagship", nemesis:"tempest", title:"Conquering Alien Warlord"};
	var omnitron = {name:"omnitron", edition:"enhanced", difficulty:"1", maxhp:"100", deck:"one-shot, ongoing, component, device, drone", nemesis:"omnitron x", title:"Self-Aware Robotics Factory"};
	//---------ROOK CITY---------//
	var chairman = {name:"the chairman and the operative", edition:"rook", difficulty:"4", maxhp:"35", deck:"one-shot, thug, underboss", nemesis:"mister fixer", title:"Master of the Underworld"};
	var matriarch = {name:"the matriarch", edition:"rook", difficulty:"3", maxhp:"70", deck:"one-shot, relic, cohort, domain, fowl", nemesis:"tachyon", title:"Her Avian Majesty"};
	var plague_rat = {name:"plague rat", edition:"rook", difficulty:"2", maxhp:"85", deck:"one-shot, ongoing, nest", nemesis:"chrono ranger", title:"Plaguebearer"};
	var spite = {name:"spite", edition:"rook", difficulty:"2", maxhp:"80", deck:"one-shot, ongoing, drug, victim, safe house", nemesis:"wraith", title:"Transhuman Serial Killer"};
	//---------INFERNAL RELICS---------//
	var akash_bhuta = {name:"akash'bhuta", edition:"relics", difficulty:"2", maxhp:"200", deck:"one-shot, ongoing, primeval limb", nemesis:"argent adept", title:"Chaos-Bound Creator"};
	var apostate = {name:"apostate", edition:"relics", difficulty:"2", maxhp:"66", deck:"one-shot, ongoing, relic, demon", nemesis:"fanatic", title:"Infernal Emissary"};
	var ennead = {name:"the ennead", edition:"relics", difficulty:"3", maxhp:"varies", deck:"villians, one-shot, shrine", nemesis:"ra", title:"The Ennead"};
	var gloomweaver = {name:"gloomweaver", edition:"relics", difficulty:"3", maxhp:"90", deck:"one-shot, ongoing, relic, voodoo pin, cultist, familiar, zombie", nemesis:"nightmist", title:"Nightmare Walker"};
	//---------SHATTERED TIMELINES---------//
	var dreamer = {name:"the dreamer", edition:"timelines", difficulty:"3", maxhp:"6", deck:"one-shot, projections", nemesis:"visionary", title:"The Dreamer Dreams"};
	var iron_legacy = {name:"iron legacy", edition:"timelines", difficulty:"4", maxhp:"32", deck:"one-shot, ongoing", nemesis:"tachyon, absolute zero, tempest, wraith, unity, bunker", title:"Ironclad Tyrant"};
	var kismet = {name:"kismet", edition:"timelines", difficulty:"2", maxhp:"70", deck:"one-shot, jinx, lucky, talisman", nemesis:"setback", title:"Charmed Scoundrel"};
	var capitan = {name:"la capitan", edition:"timelines", difficulty:"2", maxhp:"75", deck:"one-shot, ongoing, crew, relic", nemesis:"the sentinels", title:"Time Corsair"};
	//---------VENGEANCE---------//
	var baron_blade_vengeance = {name:"baron blade vengeance", edition:"vengeance", difficulty:"3", maxhp:"32", deck:"citizen slash, empyreon, omni-blade, ruin, zhu long", nemesis:"legacy", title:"Evolved Mad Man"};
	var ermine = {name:"ermine", edition:"vengeance", difficulty:"2", maxhp:"25", deck:"calypso, equity, the seer, tantrum", nemesis:"the wraith", title:"Con Artist Extraordinaire"};
	var friction = {name:"friction", edition:"vengeance", difficulty:"2", maxhp:"26", deck:"argentium, highbrow, the hippo, revenant", nemesis:"tachyon", title:"Shockingly Speedy"};
	var fright_train = {name:"fright train", edition:"vengeance", difficulty:"3", maxhp:"35", deck:"choke, the crackjaw crew, major flay, man-grove", nemesis:"bunker", title:"One-Track Warrior"};
	var proletariat = {name:"proletariat", edition:"vengeance", difficulty:"2", maxhp:"20", deck:"doc tusser, hermetic, the radioactivist, vyktor", nemesis:"absolute zero", title:"The Every Man"};
	//---------WRATH OF THE COSMOS---------//
	var deadline = {name:"deadline", edition:"cosmos", difficulty:"3", maxhp:"80", deck:"unknown", nemesis:"the naturalist", title:"Radical Peacemonger"};
	var infinitor = {name:"infinitor", edition:"cosmos", difficulty:"2", maxhp:"65", deck:"unknown", nemesis:"captain cosmic", title:"Tormented Malefactor"};
	var kaargra_warfang = {name:"kaargra warfang", edition:"cosmos", difficulty:"3", maxhp:"40", deck:"unknown", nemesis:"sky scraper", title:"Bloodsworn Master"};
	var progeny = {name:"progeny", edition:"cosmos", difficulty:"3", maxhp:"90", deck:"unknown", nemesis:"knyfe", title:"Vassal of Destruction"};
	//---------MINI EXPANSIONS---------//
	var ambuscade = {name:"ambuscade", edition:"enhanced", difficulty:"2", maxhp:"50", deck:"unknown", nemesis:"haka", title:"Superhero Hunter"};
	var miss_information = {name:"miss information", edition:"enhanced", difficulty:"3", maxhp:"45", deck:"one-shot, ongoing, diversion", nemesis:"parse", title:"Demure Office Worker"};
	var wager_master = {name:"wager master", edition:"enhanced", difficulty:"2", maxhp:"77", deck:"unknown", nemesis:"guise", title:"A Cosmic Challenge"};
	//---------PROMOS---------//
	var baron_mad_bomber = {name:"baron blade: mad bomber", edition:"enhanced", difficulty:"3", maxhp:"30", deck:"unknown", nemesis:"legacy", title:"Mad Bomber"};	
	var cosmic_omnitron = {name:"cosmic omnitron", edition:"enhanced", difficulty:"2", maxhp:"100", deck:"unknown", nemesis:"omnitron x", title:"Cosmic-Powered Exterminator"};
	var gloomweaver_skinwalker = {name:"skinwalker gloomweaver", edition:"enhanced", difficulty:"2", maxhp:"50", deck:"unknown", nemesis:"nightmist", title:"Skinwalker"};
	var spite_gloom = {name:"spite: agent of gloom", edition:"enhanced", difficulty:"2", maxhp:"90", deck:"unknown", nemesis:"wraith", title:"Skinwalker"};
	
	//------------------------------------//
	//------RETURN FUNCTION------//
	//-----------------------------------//
	
	if (request == "baron blade") {return baron_blade;}
	if (request == "citizen dawn") {return citizen_dawn;}
	if (request == "voss") {return grand_warlord_voss;}
	if (request == "omnitron") {return omnitron;}
	if (request == "the chairman") {return chairman;}
	if (request == "the matriarch") {return matriarch;}
	if (request == "plague rat") {return plague_rat;}
	if (request == "spite") {return spite;}
	if (request == "akashbhuta") {return akash_bhuta;}
	if (request == "apostate") {return apostate;}
	if (request == "ennead") {return ennead;}
	if (request == "gloomweaver") {return gloomweaver;}
	if (request == "the dreamer") {return dreamer;}
	if (request == "iron legacy") {return iron_legacy;}
	if (request == "kismet") {return kismet;}
	if (request == "la capitan") {return capitan;}
	if (request == "baron blade vengeance") {return baron_blade_vengeance;}
	if (request == "ermine") {return ermine;}
	if (request == "friction") {return friction;}
	if (request == "fright train") {return fright_train;}
	if (request == "proletariat") {return proletariat;}	
	if (request == "deadline") {return deadline;}
	if (request == "infinitor") {return infinitor;}
	if (request == "kaargra warfang") {return kaargra_warfang;}
	if (request == "progeny") {return progeny;}
	if (request == "ambuscade") {return ambuscade;}
	if (request == "miss information") {return miss_information;}
	if (request == "wager master") {return wager_master;}
	if (request == "baron blade mad bomber") {return baron_mad_bomber;}
	if (request == "cosmic omnitron") {return cosmic_omnitron;}
	if (request == "gloomweaver skinwalker") {return gloomweaver_skinwalker;}
	if (request == "spite agent of gloom") {return spite_gloom;}	
}

function getEnvData(request) {
	//---------ENHANCED---------//
	var insula_primalis = {name:"insula primalis", edition:"enhanced", difficulty:"3", type:"dinosaurs"};
	var megalopolis = {name:"megalopolis", edition:"enhanced", difficulty:"2", type:"urban"};
	var ruins_of_atlantis = {name:"ruins of atlantis", edition:"enhanced", difficulty:"4", type:"underwater"};
	var wagner_mars_base = {name:"wagner mars base", edition:"enhanced", difficulty:"2", type:"mars"};
	//---------ROOK CITY---------//
	var pike_complex = {name:"pike industrial complex", edition:"rook", difficulty:"3", type:"industrial"};
	var rook_city = {name:"rook city", edition:"rook", difficulty:"4", type:"urban"};
	//---------INFERNAL RELICS---------//
	var realm_of_discord = {name:"realm of discord", edition:"relics", difficulty:"1", type:"mystery"};
	var tomb_of_anubis = {name:"tomb of anubis", edition:"relics", difficulty:"3", type:"mummy"};
	//---------SHATTERED TIMELINES---------//
	var time_cataclysm = {name:"time cataclysm", edition:"timelines", difficulty:"2", type:"time warp"};
	var block = {name:"the block", edition:"timelines", difficulty:"1", type:"prison"};
	//---------VENGEANCE---------//
	var freedom_tower = {name:"freedom tower", edition:"vengeance", difficulty:"2", type:"corporation"};
	var defense_platform = {name:"mobile defense platform", edition:"vengeance", difficulty:"1", type:"airship"};
	//---------WRATH OF THE COSMOS---------//
	var dokthorath_capital = {name:"dok'thorath capital", edition:"cosmos", difficulty:"?", type:"airship"};
	var enclave = {name:"enclave of the endlings", edition:"vengeance", difficulty:"?", type:"enclave"};
	//---------MINI EXPANSIONS---------//
	var silver_gulch = {name:"silver gulch 1883", edition:"enhanced", difficulty:"3", type:"western"};
	var final_wasteland = {name:"the final wasteland", edition:"enhanced", difficulty:"1", type:"aliens"};
	var omnitron_iv = {name:"omnitron IV", edition:"enhanced", difficulty:"?", type:"computers"};
	//---------PROMOS---------//

	//------------------------------------//
	//------RETURN FUNCTION------//
	//-----------------------------------//

	if (request == "insula primalis") {return insula_primalis;}
	if (request == "megalopolis") {return megalopolis;}
	if (request == "ruins of atlantis") {return ruins_of_atlantis;}	
	if (request == "wagner mars base") {return wagner_mars_base;}
	if (request == "pike industrial complex") {return pike_complex;}
	if (request == "rook city") {return rook_city;}
	if (request == "realm of discord") {return realm_of_discord;}
	if (request == "tomb of anubis") {return tomb_of_anubis;}
	if (request == "time cataclysm") {return time_cataclysm;}
	if (request == "the block") {return block;}	
	if (request == "freedom tower") {return freedom_tower;}
	if (request == "mobile defense platform") {return defense_platform;}
	if (request == "dokthorath capital") {return dokthorath_capital;}
	if (request == "enclave of the endlings") {return enclave;}
	if (request == "silver gulch 1883") {return silver_gulch;}
	if (request == "final wasteland") {return final_wasteland;}
	if (request == "omnitron iv") {return omnitron_iv;}
}

