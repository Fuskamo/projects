 ============================================================================
 Name        : readme.txt
 Author      : David Jensen
 Class       : CIS 432, FALL17
 Description : ServerChat
 ============================================================================

DuckChat is a client/server chat tool 
Use the "make" command to generate client and server files
The server must be running for the client to connect
Load the server by running:
	./server <serverIP> <serverPort> <optionalPeerIP> <optionalPeerPort>
Load the client by running:
	./client <serverIP> <serverPort> <username>

Server logs important events to console
Client logs relevant information to console

Use the "make" command to generate client and server files
*NEW* In this version, the server log level can be customized
The default setting is LOGGING = 3 (this logs errors, warnings, and S2S messages only)
See the description in server.cpp for more information