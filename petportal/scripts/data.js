var p0 = "When it comes to pets, it's easy to forget about that once-a-year vaccine or yearly vet check-up. When was the last time you applied flea medication to a particular cat? Was it Erin or Chloe who is allergic to Frontline? It's easy to forget some of the details, especially when there's a lot of pets. The Pet Portal was designed to eliminate some of the guess work and simplify the pet owning experience.</br></br>My girlfriend Megan works at a vet clinic and occasionally brings home foster animals. Additionally, we stumbled across a situation where someone needed to re-home 16 cats this last summer! Trying to keep all the pet information up to date (who's been spayed, neutered, vaccinated, microchipped, tested, etc...) and in one place was quite a challenge, especially whilst trying to keep on top of our personal pets' needs. We needed a way to manage all of this data, and this project is the perfect time to compile all of our information! Although those with multiple pets will gain the most use from the PetPortal database, anyone can use the database design to simplify the pet owning experience!<hr>Use the dropdown to view all information for a specific table: ";
var p1 = "In the PetPortal Database, all animals are organized into categories. Each type of animal has different types of care, which is reflected in the REQUIRED_TREATMENT table. This page executes some simple queries to familiarize visitors with the myriad of pet types and pet names that are present in the database. Any of these pet names can be used in any query that requires a pet name. However, the Felines and Canines will have the most information present in the database. <hr>Choose an option to display all the pets for a particular animal type: ";
var p2 = "In the PetPortal Database, pet treatment information is either performed at home (HOME_TREATMENT) or at the vet's office (VET_TREATMENT). Typical home treatments include flea medication or other simple pet care treatments. Vet treatments are typically more advanced and can contain treatments such as vaccinations or surgery (although there are no limits on the type of treatments that can be added to the database). This page concatenates the vet and home treatment information into a single result set. This can be useful if you need to take a pet to a new vet - all the history is in the same place! The table to the right lists a pet with their respective record count. <hr>Lookup pet records here: <input type='text' name='q2txt' id='q2txt' value='Nacho'><input type='button' value='Submit' onclick='q2b()'/>";
var p3 = "In the PetPortal Database, each type of animal is linked to specific treatments that are required (REQ_TREATMENT) for a specific type of animal. For example, all cats need the FeLV sequence, FVRCP sequence, and Rabies sequence of vaccines. Additionally, certain pets require additional specific treatments (ATYPICAL_TREATMENT) that may be unique to a particular pet. These include treatments such as a Sentry Calming Collar (for cats with mild to moderate behavioral issues/quirks) or a different brand of flea medication (due to allergic reactions with a particular brand). As a last example, the feline FVRCP vaccine comes in two flavors: the 1 year and 3 year FVRCP vaccination. For higher risk cats (outdoor or indoor/outdoor or cats that come into frequent contact with dogs who are outside more frequently), the 1 year vaccine is recommended. For low risk cats (older, indoor only cats), the 3 year is adequate. This page leverages both tables (REQ_TREATMENT, ATYPICAL_TREATMENT) to determine which treatments need to be applied to a designated animal. Use the box to look up required treatments that have not been implemented. A table will also appear to the right that displayed required treatments that this pet has already received.<hr>Lookup a pet to see if they still need required treatments: <input type='text' name='q3txt' id='q3txt' value='Stanley'><input type='button' value='Submit' onclick='q3b()'/>";
var p4 = "In the PetPortal Database, most types of treatments are recurring. The TREATMENT table tracks the repeat cycles of all recurring treatments. This page utilizes the TREATMENTS table in conjunction with treatments that are already in place (VET_TREATMENTS, HOME_TREATMENTS) to compile a list of due dates for recurring treatments. These are sorted in reverse order - so the treatment that should be applied next (future or past) is listed at the top. This is especially useful to determine when the next flea medication or 3 year vaccine needs to be applied. This page will allow you to look up a pet to see which treatments are due. A table will appear on the right which lists required treatments which have not yet been implemented. <hr>Lookup when a pets treatments are due: <input type='text' name='q4txt' id='q4txt' value='Nitro'><input type='button' value='Submit' onclick='q4b()'/>";
var p5 = "The PetPortal Database allows for pet weight tracking. Monitoring a pets weight is important because a pet that is under or over weight can signify pet health concerns. As with people, a pet that is overweight is at increased risk for developing disorders such as diabetes, arthritis, kidney disease, cancer and other life threatening diseases. Underweight animals can signify issues such as thyroid problems, intestinal parasites, worms and many other issues. Although this page doesn't leverage extremely beefy queries, the information is still vital to track and review. The table on the right list the number of weight records per pet. <hr>Lookup weight records for a specific pet: <input type='text' name='q5txt' id='q5txt' value='NotStan'><input type='button' value='Submit' onclick='q5b()'/>";
var p6 = "The PetPortal Database maintains a record of pet microchip information. If a pet is lost (or stolen I guess), the microchip information is used locate the owners of the pet. By maintaining a list of owner information and pet microchip data, we can easily look the microchip up in the database to give the owner a call. The database contains all the information regarding an owner, but their personal information has been obfuscated here for security purposes. A list of microchips in the database is displayed on the right. <hr>Lookup pet information via microchip: <input type='text' name='q6txt' id='q6txt' value='981020023266809'><input type='button' value='Submit' onclick='q6b()'/>";
var p7 = "The PetPortal Database was designed because we love doing pet rescue work. Seeing our furry (and not so furry) animals that have been adopted to good homes is its own reward. On the right we have our adoption counter. Below is a chart of all animals who have been adopted.<hr> ";
var p8 = "This page provides a list of all pets associated to a particular owner. This will be more useful as more owners are added to the database. Once an owner has been selected, the number and type of animals will be displayed on the right. <hr>Choose an owner to view pet information: <input type='text' name='q8txt' id='q8txt' value='Megan'><input type='button' value='Submit' onclick='q8b()'/>";
var p9 = "Here is the source list for all files. It is recommended to open each link in a new tab or save the file. Using the 'back' button will take you to the 'Home' page.<hr>Misc Files: [<a href = 'files/project.zip'>Source Code Zip</a>] [<a href = 'files/jensen_project_pt2.pdf'>Project Write Up (pdf)</a>]<hr>SQL Queries: [<a href='txt/queries.txt'>queries.sql</a>]<hr>CSS file: [<a href='css/format.css'>format.css</a>]<hr>JavaScript files: [<a href='scripts/main.js'>main.js</a>] [<a href='scripts/data.js'>data.js</a>] [<a href='scripts/pet_queries.js'>pet_queries.js</a>]<hr>PHP files: ";

function getData(input) {
	switch(input) {
		case 0:
			return p0;
			break;
		case 1:
			return p1;
			break;
		case 2:
			return p2;
			break;
		case 3:
			return p3;
			break;
		case 4:
			return p4;
			break;
		case 5:
			return p5;
			break;
		case 6:
			return p6;
			break;
		case 7:
			return p7;
			break;
		case 8:
			return p8;
			break;
		case 9:
			return p9;
			break;
	}
}