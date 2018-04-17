The WE+ Sorting Hat is a team collaboration project by Steve, Madeline, Andy, Jaden and David. It is a web based application that allows an authenticated user to create classes and sort survey results for that class by language preference with a strong correlation to group students by GPA. The survey page collect data about a students name, nickname, id, gpa history, language preference, skillset, previous experience, currently enrolled courses, and expected learning outcomes. The program maintains state, meaning if the same course is opened in two windows, any changes made in one tab will be reflected in the other. If a course enrollment is disabled, no further surveys will be accepted. If a professor does not have any courses open for enrollment open, the professor will not appear on the survey page. Adding new courses, new users, and surveys perform form validation. All survey, professor and course information is stored in a MySQL database and leverage PHP/JavaScript to retrieve and store the data. Statistics are created automatically each time a course is loaded from the admin page. This allows the sorting data to stay current and dynamic. Stastical data analyzes all survey information for the class and creates an average (or baseline) and standard deviation to normalize student responses. To become an authenticated user and start creating your own courses, open the admin page and click "new". Several authenticated users already exist in the system, and it is quickest to use one of these: faulk:temp, djensen:temp.

Since this relies heavily on sample survey data, we have created the randomize(int) function, which can be run from the SURVEY page:
1) Open the survey page: http://ix.cs.uoregon.edu/~djensen/cis422/p2/survey/
2) Enter a 9 digit student ID number, select the professor and class to add survey information for
3) Press submit to log in
4) Open the developer tools from the browser (F12 on Chrome)
5) In the console tab of the developer tools, type the following: "randomize(integer);" where "integer" is an integer between 0 and 40
6) Random data will be generated for the selected number of surveys
7) On the admin page, reselect the class from the dropdown list to load the new data


Sorting Hat Installation on ix.cs.uoregon.edu:
1) Download all the files from the git repository via a git administration tool such as MinTTY
2) Enter the following command to clone the repo to a local, empty directory
          git clone git@git.assembla.com:uocis/cis422w18-team5.git
3) The files will contain two folders, one for each project. Copy project 2 folder into the location of your choosing.
4) Navigate to /files/php/ in the "survey" and "admin" subfolders and open connectionData.txt in a text editor
          The server, database name, username, password and port can be modified based on the settings of your MySQL server. 
          NOTE: If the file is left unedited, it will connect to the current sortinghat database hosted on ix.cs.uoregon.edu
5) If the connectionData.txt files have been edited, save the files.
6) Using an FTP program such as WinSCP, copy the entire contents of the downloaded git to the public_html folder on the web server. If using ix.cs.uoregon.edu, this will be in:
          /home/users/<username>/public_html/<optional folder>
7) From a web browser, visit the corresponding locations:
          ix.cs.uoregon.edu/~<username>/<optional folder>/survey
          ix.cs.uoregon.edu/~<username>/<optional folder>/admin
8) The site will load the index page and the sortinghat application is live!
	<username> = your duckID 
	<optional folder> = optional sub directory (useful if hosting multiple applications)