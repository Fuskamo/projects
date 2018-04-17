/*
=============================================================================
 Name        : server.cpp
 Author      : David Jensen
 Class       : CIS 432, Fall 17
 Description : Project 1: DuckChat
 Sources     : stackoverflow.com; cppreference.com; google.com
 Sockets 	 : http://www.binarytides.com/programming-udp-sockets-c-linux/
 Select 	 : https://beej.us/guide/bgnet/output/html/multipage/advanced.html#select
=============================================================================
 */

#include <algorithm>
#include <arpa/inet.h>
#include <cstring>
#include <iostream>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>
#include <vector>

#include "duckchat.h"

#define STDIN 0
#define MAXBUFLEN 1024
#define LOCALHOST "127.0.0.1"
#define MAX_CHANNELS 50
#define MAX_USERS 50


//RUN MAIN
int main(int argc, char *argv[]) {
    //VALIDATE INPUT
	if (argc != 4) {
		std::cout << "E | Invalid input parameters. Try again with: server hostname, server port, username\n" << std::endl;
		exit(1);
	}

	std::cout << "I | Starting client..." << std::endl;

	/* -------------- INITIALIZING VARIABLES -------------- */
	int client, server; // socket file descriptors

	/* Structure describing an Internet socket address. */
	struct sockaddr_in server_addr;
	socklen_t server_size = sizeof(server_addr);

	/* ---------- ESTABLISHING SOCKET CONNECTION ----------*/
	server = socket(AF_INET, SOCK_DGRAM, 0);
	if (server < 0) {
		std::cout << "E | Error creating socket!..." << std::endl;
		exit(-1);
	}
	memset((char *) &server_addr, 0, sizeof(server_addr));
	server_addr.sin_family = AF_INET;
	server_addr.sin_port = htons(std::atoi(argv[2]));
	server_addr.sin_addr.s_addr = htonl(std::atoi(argv[1]));
	std::cout << "I | Client socket created..." << std::endl;

	/* ---------- CONNECTING THE SOCKET ---------- */

	if (connect(client, (struct sockaddr *) &server_addr, sizeof(server_addr)) < 0) {
		std::cout << "I | Connected to the server port number: " << std::atoi(argv[2]) << std::endl;
	}
	
	//CREATE CLIENT DATA STRUCTURES
	std::vector<std::string> channelList;	//contains a list of active channels
	int activeChannel; 						//active channel index

	//LOGIN REQUEST
	struct request_login login_packet = { REQ_LOGIN };
	strcpy(login_packet.req_username, argv[3]); //sets the user name from cmd input
	if(sendto(server, &login_packet, sizeof(login_packet), 0, (struct sockaddr *) &server_addr, server_size) ==-1) {
		perror("failed /login");
		exit(1);
	}

    //JOIN REQUEST FOR COMMON
	std::string temp = "Common";
	struct request_join join_packet = { REQ_JOIN };
	strcpy(join_packet.req_channel, temp.c_str());
	if(sendto(server, &join_packet, sizeof(join_packet), 0, (struct sockaddr *) &server_addr, server_size) ==-1) {
		perror("failed /join");
		exit(1);
	}
	//ADD "COMMON" TO LOCAL CHANNELS
	channelList.push_back(temp);
	std::cout << "I | Joined channel " << temp << std::endl;
	activeChannel = channelList.size()-1;
    bool isActive = true;	//if false, the say command will not be sent. must join a channel

    //SETUP VARIABLES FOR SEND/RECEIVE:
	bool sending = true; 					//variable to continue infinitly (until /exit)
    bool containsArg = true; 				//bool for is(/cmd + arg)
    int bytesReceived;						//measures size of incoming packet
	std::string input; 						//Read line from prompt
	std::string cmd;						//Grab the command portion
	std::string arg;						//Grab the argument portion

	//BUILD SELECT FUNCTION: https://beej.us/guide/bgnet/output/html/multipage/advanced.html#select
	fd_set read_fds;
	struct timeval tv;
	tv.tv_sec = 1;
	tv.tv_usec = 0;
	char buff[255];
	int len;

	std::cout << "# " << std::flush;
	//START MESSAGE LOOP
	while(sending) {
		//SET FILE DESCRIPTERS
		FD_ZERO(&read_fds);
		FD_SET(STDIN, &read_fds);
		FD_SET(server, &read_fds);

		//CHECK SELECT
		if (select(server+1, &read_fds, NULL, NULL, 0) < 0) {
			perror("Failed to select");
		}

		//SOMEONE TYPED SOMETHING
		if(FD_ISSET(STDIN, &read_fds)) {
			containsArg = true;

			//CLEAR INPUT BUFFERS
			cmd.erase(cmd.begin(), cmd.end());
			arg.erase(arg.begin(), arg.end());

			//READ INPUT BUFFER
			fgets(buff, sizeof(buff), stdin);
			len = strlen(buff) - 1;
	        if (buff[len] == '\n') {
	            buff[len] = '\0';
	        }
	        input = buff;

	        //POTENTIAL COMMAND
			if(input[0] == '/') {
				//http://www.cplusplus.com/forum/beginner/85856/
		        std::string::size_type pos = input.find(' '); 	//find the first space character
		    	if(input.npos != pos) {							//make sure there is a space
		    		cmd = input.substr(0, pos);		//set cmd to cmd: /cmd [arg]
			        arg = input.substr(pos + 1);	//set arg to arg: [cmd] arg
			    } else {
		    		//NO SECOND ARGUMENT
			    	containsArg = false;
			    	cmd = input;
			    }

		        //COMMAND: /exit
			    if (cmd == "/exit") {
		        	//CREATE LOGOUT REQUEST
			    	struct request_logout request;
			    	request.req_type = REQ_LOGOUT;
			    	std::cout << "Logging off the server..." << std::endl;
			    	if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) ==-1) {
			    		perror("failed /exit");
			    		exit(1);
			    	}
					//If we log out, we stop sending the server messages
			    	sending = false;
			    }

		        //COMMAND: /join [arg]
			    else if (cmd == "/join") {
			    	if (!containsArg) { //check for argument
			    		std::cout << "E | No channel selected" << std::endl;
			    	} else {
			    		if (channelList.size() < MAX_CHANNELS) {
			    			if(arg.length() > CHANNEL_MAX) { //truncate to CHANNEL_MAX
			    				arg.erase(CHANNEL_MAX-1, std::string::npos);
			    			}
			    			if(std::find(channelList.begin(), channelList.end(), arg) != channelList.end()) {
			    				std::cout << "I | You are already in channel " << arg << std::endl;
			    			} else {

		            			//CREATE THE REQUEST
			    				struct request_join request;
			    				request.req_type = REQ_JOIN;
			    				strcpy(request.req_channel, arg.c_str());

		    					//JOIN THE CHANNEL LOCALLY
			    				activeChannel = channelList.size();
			    				channelList.push_back(arg);
			    				std::cout << "I | You joined " << channelList[activeChannel] << ". Active channel is now: " << channelList[activeChannel] << std::endl;

			                    //SEND REQUEST:
			    				if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) ==-1) {
			    					perror("failed /join");
			    					exit(1);
			    				}
			    				isActive = true; //isActive is true if we are in at least 1 channel
			    			}
			    		} else {
			    			std::cout << "E | You are in too many channels" << std::endl;
			    		}
			    	}
			    }

		        //COMMAND: /leave [arg]
			    else if (cmd == "/leave") {
			    	if (!containsArg) { //check for argument
			    		std::cout << "E | No channel selected" << std::endl;
			    	} else {
		            	//CHECK CURRENT CHANNELS
			    		if(channelList.size() > 0) {
			    			if(arg.length() > CHANNEL_MAX) { //truncate to CHANNEL_MAX
		            			arg.erase(CHANNEL_MAX-1, std::string::npos);  
		            		}
		            		bool inChannel = false; //not in the channel we are trying to leave
		            		for(int i = 0; i<channelList.size(); i++) {
		            			if(arg == channelList[i]) {
		            				inChannel = true;
		            				//GENERATE LEAVE REQUEST
		            				struct request_leave request;
		            				request.req_type = REQ_LEAVE;
		            				strcpy(request.req_channel, arg.c_str());

			    					//SEND THE LEAVE REQUEST
		            				if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) ==-1) {
		            					perror("failed /leave");
		            					exit(1);
		            				}
		            				channelList.erase(channelList.begin()+i);
		            				if(channelList.size() > 0) {
		            					activeChannel = (channelList.size()-1);
		            					std::cout << "I | You left channel " << arg << ". Active channel is set to " << channelList[activeChannel] << std::endl;
		            				} else {
		            					std::cout << "I | You left channel " << arg << ". No active channel set" << std::endl;
		            					isActive = false; //we are not in any channels
		            				}
		            			}
		            		}
		            		if(!inChannel) {
		            			std::cout << "I | You are not in channel " << arg << std::endl;
		            		}
		            	} else {
		            		std::cout << "E | You are not in any channels? Find a channel to join with /list!" << std::endl;
		            	}
		            }
		        } 

		        //COMMAND: /list
		        else if (cmd == "/list") {
		        	if (containsArg) { //check for argument
		        		std::cout << "E | You don't need a second argument for this command.." << std::endl;
		        	} else {
			            //GENERATE LIST REQUEST
		        		struct request_list request = { REQ_LIST };

			    		//SEND LIST REQUEST
		        		if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) == -1) {
		        			perror("failed /list");
		        			exit(1);
		        		}
		        	}
		        }

				//COMMAND: /who [arg]
		        else if (cmd == "/who") {
		        	if (!containsArg) {
		        		std::cout << "E | No channel selected" << std::endl;
		        	} else {
		        		if(arg.length() > CHANNEL_MAX) {
		        			arg.erase(CHANNEL_MAX-1, std::string::npos);
		        		}
		        		
		    			//GENERATE THE WHO REQUEST
		        		struct request_who request = { REQ_WHO };
		        		strcpy(request.req_channel, arg.c_str());

		    			//SEND THE WHO REQUEST
		        		if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) == -1) {
		        			perror("failed /who");
		        			exit(1);
		        		}              
		        	}
		        }


				//COMMAND: /switch [arg]
		        else if (cmd == "/switch") {
		        	if (!containsArg) { //check for argument
		        		std::cout << "E | No channel selected" << std::endl;
		        	} else {
		        		if(arg.length() > CHANNEL_MAX) { //truncate to CHANNEL_MAX
		            		arg.erase(CHANNEL_MAX-1, std::string::npos);
		            	}
		            	bool inChannel = false;
		            	for(int i = 0; i<channelList.size(); i++) {
		            		if(arg.compare(channelList[i]) == 0) {
		            			activeChannel = i;
		            			std::cout << "I | Active channel is now " << channelList[i] << std::endl;
		            			inChannel = true;
		            		}
		            	}
		            	if(!inChannel) {
		            		std::cout << "E | You are not in " << arg << std::endl;
		            	}
		            }
		        } 

				//COMMAND: /help
		        else if (cmd == "/help") { //displays list of available commands
		        	std::cout << "I | Available commands:" << std::endl;
		        	std::cout << "  | /exit             | logout of the server and exit program" << std::endl;
		        	std::cout << "  | /list             | lists the names of all channels" << std::endl;
		        	std::cout << "  | /help             | print this list again?" << std::endl;
		        	std::cout << "  | /switch [channel] | makes the specified channel active for input" << std::endl;
		        	std::cout << "  | /join   [channel] | joins the specified channel" << std::endl;
		        	std::cout << "  | /leave  [channel] | leaves the specified channel" << std::endl;
		        	std::cout << "  | /who    [channel] | lists the users who are on the channel" << std::endl;
		        }

		        //INVALID COMMAND: (first char is a "/", but didnt match a valid command above)
		        else if (cmd[0] == '/') {
		        	std::cout << "E | Not a valid command. Type /help for a list of commands" << std::endl;
		        } 


	        } // <-- END OF if(cmd[0] = '/')

		    //SEND A SAY MESSAGE
	        else {
	        	if(isActive) { //see if we are in at least 1 channel
	        		if(input.length() > SAY_MAX) { //truncate text to SAY_MAX
		        		input.erase(SAY_MAX, std::string::npos); 
		        	}
					//GENERATE SAY REQUEST	        	
		        	struct request_say request = { REQ_SAY };
		        	strcpy(request.req_channel, channelList[activeChannel].c_str());
		        	strcpy(request.req_text, input.c_str());

		    		//SEND SAY REQUEST
		        	if(sendto(server, &request, sizeof(request), 0, (struct sockaddr *) &server_addr, server_size) == -1) {
		        		perror("failed /say");
		        		exit(1);
		        	}
		        } else {
		        	std::cout << "You must join a channel to talk. Use /list to find a channel and /join to connect to a channel." << std::endl;
		        }
		    	
			}

		} // <-- END OF if(issset(stdin, &read_fds))

		//SERVER SENT US A MESSAGE!
		if(FD_ISSET(server, &read_fds)) {
			char buffer[MAXBUFLEN];
			bytesReceived = 0;
			buffer[0] = '\0';
			server_size = sizeof(server_addr);

			if (bytesReceived = recvfrom(server, buffer, MAXBUFLEN-1, 0, (struct sockaddr *) &server_addr, &server_size) == -1) {
				perror("reply from server");
				exit(1);
			}

			//this makes weird formatting issues, but the instructors version does it too
			//adding a newline to the end fixes formatting issues
			std::cout << "\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\n\r" << std::flush;
			
    		//Convert from buffer to struct to decode
			struct text *incomingPacket = (struct text*) buffer;
			text_t type = incomingPacket->txt_type;

    		//Decode incoming message
			switch(type) {
				case TXT_LIST: {
					struct text_list *list = (struct text_list*) incomingPacket;
					std::cout << "I | " << list->txt_nchannels <<  " active channel(s):" << std::endl;
					for (int i = 0; i < list->txt_nchannels; i++) {
						std::cout << i+1 << ") " << list->txt_channels[i].ch_channel << std::endl;
					}
					break;
				}
				case TXT_WHO: {
					struct text_who *who = (struct text_who*) incomingPacket;
					std::cout << "I | " << who->txt_nusernames << " user(s) on channel " << who->txt_channel << ":" << std::endl;
					for (int i = 0; i < who->txt_nusernames; i++) {
						std::cout << i+1 << ") " << who->txt_users[i].us_username << std::endl;
					}
					break;
				}
				case TXT_ERROR: {
					struct text_error *err = (struct text_error*) incomingPacket;
					std::cout << err->txt_error << std::endl;
					break;
				}
				case TXT_SAY: {
					struct text_say *say = (struct text_say*) incomingPacket;
					std::cout << "[" << say->txt_channel << "][" << say->txt_username << "]: " << say->txt_text << std::endl;
					break;
				}
				default: {
					std::cout << "E | Something went wrong! This is not the packet we are expecting..." << std::endl;
				}
			}
			//WE SHOULD PLACE TEXT BACK INTO CMD WINDOW HERE:
			std::cout << "# " << std::flush; //text is preservered, but doesn't appear on cmd?
			fflush(stdin);
		}
	}
	close(server);
	return 0;
}
