The WE+ Address Book is a team collaboration project by Steve, Madeline, Andy, Jaden and David. It is a web based application that allows an authenticated user to create address books, add new contacts, edit existing contacts, delete existing contacts, import contacts from TSV, export contacts to TSV, sort contacts by any header field, and search for contacts. Contact information that is stored includes name, address, city, state, zip code, phone number, email address, and Facebook page. The program maintains state, meaning if the same book is opened in two windows, any changes made in one tab will be reflected in the other. If an address book is deleted, all other tabs for the same address book will be closed. Adding and editing contacts perform form validation, but allows the user to override the validation and store the contact anyways. All contacts and address books are stored in a MySQL database and leverage PHP/JavaScript to retrieve and store the data. To become an authenticated user and start storing your own contacts, open the console from Chrome (F12) and type createUser('username'); Several authenticated users already exist in the system, and it is quickest to use one of these: faulk, sfaulk, djensen, andy, jaden, steve, madeline.

**All project code has been written by David (50%) and Jaden (50%)**

Address Book Installation on a web server:
1) Download all the files from the git repository via a git administration tool such as MinTTY
2) The files will contain book.html, index.html and a folder called files 
3) Navigate to /files/php/ and open connectionData.txt in a text editor
          The server, database name, username, password and port can be modified based on the settings of your MySQL server. 
          NOTE: If the file is left unedited, it will connect to the current addressdb database hosted on ix.cs.uoregon.edu
4) If the connectionData.txt has been edited, save the file.
5) Using an FTP program such as WinSCP, copy the entire contents of the downloaded git to the public website folder
6) Configure your website via IIS or Apache
7) From a web browser, visit your newly created site
8) The site will load the index page and the address book application is live!