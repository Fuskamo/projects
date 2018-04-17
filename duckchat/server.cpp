/*
=============================================================================
 Name        : server.cpp
 Author      : David Jensen
 Class       : CIS 432, Fall 17
 Description : Project 1: DuckChat
 Sources     : 
 ** socket api			: http://rodrigotufino.info/2017/04/11/a-simple-c-socket-example/
 ** binding to socket 	: https://www.cs.rutgers.edu/~pxk/417/notes/sockets/udp.html
 ** recvfrom functions 	: http://pubs.opengroup.org/onlinepubs/009695399/functions/recvfrom.html
 ** various functions	: http://www.cplusplus.com/reference
 ** function misc       : https://stackoverflow.com/questions/
=============================================================================
 */

#include <algorithm>
#include <arpa/inet.h>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <netinet/in.h>
#include <stdlib.h>
#include <stdio.h>
#include <string>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <vector>

#include "duckchat.h"

#define MAXBUFLEN 1024
#define LOCALHOST "127.0.0.1"
#define MAX_CHANNELS 50
#define MAX_USERS 50

//FUNCTION DEFINITIONS:
int createUser(std::string username, struct sockaddr_in client);
void sendError(struct sockaddr_in client, std::string errMsg);
int getUserIndex(struct sockaddr_in client);
int createNewChannel(std::string channel);
int getChannelIndex(std::string channel);
int getUsersInChannel(int chan);
void deleteEmptyChannels();

//DATA STRUCTURES:
std::vector<std::vector<int> > userChannelArray(MAX_USERS, std::vector<int>(MAX_CHANNELS));
struct ip_address {std::string ip; int port; struct sockaddr_in obj; };
std::vector<struct ip_address> clientIps;
std::vector<std::string> usernames;
std::vector<std::string> channels;

//GLOBAL VARIABLES:
int server; // socket file descriptor

//MAIN FUNCTION
int main(int argc, char **argv) {
    //VALIDATE INPUT
    if (argc != 3) {
        fprintf(stderr, "ERROR: Invalid input parameters! server hostname/IP, server port number\n");
        exit(1);
    }

	/* Structure describing an Internet socket address. */
	struct sockaddr_in server_addr, client_addr;
	socklen_t server_size = sizeof(server_addr);
	socklen_t client_size = sizeof(client_addr);
	std::cout << "I | Server is starting..." << std::endl;

	/* ---------- ESTABLISHING SOCKET CONNECTION ----------*/
	server = socket(AF_INET, SOCK_DGRAM, 0);
	if (server < 0) {
		std::cout << "E | Error creating socket!..." << std::endl;
		exit(-1);
	}
    memset((char *) &server_addr, 0, server_size);
	server_addr.sin_family = AF_INET;
	server_addr.sin_addr.s_addr = htonl(std::atoi(argv[1]));
	server_addr.sin_port = htons(std::atoi(argv[2]));
    std::cout << "I | Server socket created..." << std::endl;

    /* ---------------- SET SOCKET LEVEL --------------- */

	int yes = 1;
	if (setsockopt(server, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes)) == -1) {
		perror("setsockopt");
		exit(1);
	}
	/* ---------------- BINDING THE SOCKET --------------- */

	if ((bind(server, (struct sockaddr*) &server_addr, server_size)) < 0) {
		std::cout << "E | Error binding connection. The socket has already been established..." << std::endl;
        exit(-1);
    }

    std::cout << "I | Server supports up to "<< MAX_CHANNELS << " channels and " << MAX_USERS << " users " << std::endl;
    std::cout << "I | Listening for clients..." << std::endl;

	//PROGRAM LOOP VARIABLES:
    bool listening = true;
    int bytesReceived;

    while (listening) {
        //CLEAR BUFFER
        char buffer[MAXBUFLEN]; // buffer to receive
        bytesReceived = 0;

        //GET MESSAGE FROM CLIENT
        if ((bytesReceived = recvfrom(server, buffer, MAXBUFLEN-1 , 0, (struct sockaddr*) &client_addr, &client_size)) == -1) {
            perror("E | Error receiving file: ");
            bytesReceived = 0;
        }

        //BEGIN PROCESSING MESSAGE
        buffer[bytesReceived] = '\0';
        std::cout << "I | Packet (" << bytesReceived << " bytes) from " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl;
        if(sizeof(buffer) > MAXBUFLEN) {
            std::cout << "W | Datagram too large for buffer and was truncated" << std::endl;
        }

        //CONVERT INCOMING MESSAGE TO A PACKET
        struct request *incomingPacket = (struct request*) buffer;
        int type = incomingPacket->req_type;

        //DETERMINE MESSAGE TYPE
        int userIndex, channelIndex;
        if(type == REQ_LOGIN) {
            //CREATE A USER
            std::cout << "C | REQ_LOGIN" << std::endl;
            struct request_login *login = (struct request_login*) incomingPacket;
            userIndex = createUser(login->req_username, client_addr);
        } else {
            //GET USER STATUS
            userIndex = getUserIndex(client_addr);
        }
        switch(type) {
            //LOGIN REQUEST
            case REQ_LOGIN: {
                if (userIndex == -1) { //user already exists in clientIps
                    sendError(client_addr, "E | You are already logged in I guess..");
                } else if (userIndex == -2) { //we have reached our user limit
                    sendError(client_addr, "E | Sorry bud, we have too many users right now.");
                }
                std::cout << "I | Login successful for [" << usernames[userIndex] << "]" << std::endl;
                break;
            }

            //LOGOUT REQUEST
            case REQ_LOGOUT: {
                std::cout << "C | REQ_LOGOUT" << std::endl;
                if(userIndex < 0) { //user not in our list
                    sendError(client_addr, "E | You can't log out if you aren't logged in!");
                } else {
                    std::cout << "I | User [" << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << "] has logged out" << std::endl;
                    //LOGOUT & DELETE ALL USER DATA
                    for(int i = 0; i < CHANNEL_MAX; i++) {
                        if(userChannelArray[userIndex][i] == 1) {
                            userChannelArray[userIndex][i] = 0;
                            std::cout << "removing " << usernames[userIndex] << " from channel " << channels[channelIndex] << std::endl;
                        }
                    }
                    userChannelArray.erase(userChannelArray.begin()+userIndex);
                    clientIps.erase(clientIps.begin()+userIndex);
                    usernames.erase(usernames.begin()+userIndex);
                    deleteEmptyChannels();
                }
                break;
            }

            //JOIN REQUEST
            case REQ_JOIN: {
                std::cout << "C | REQ_JOIN" << std::endl;
                struct request_join *join = (struct request_join*) incomingPacket;
                if (userIndex < 0) { //user not logged in
                    sendError(client_addr, "E | You are not a registered user! Please log in");
                } else {
                    channelIndex = getChannelIndex(join->req_channel);
                    if (channelIndex < 0) { //channel doesnt exist
                        //CREATE A NEW CHANNEL
                        channelIndex = createNewChannel(join->req_channel);
                    } 
                    if(channelIndex < 0) { //the channel array is full, channel not created
                        sendError(client_addr, "E | Wow! That's a hot channel, all the cool kids are in there. And you are not.");
                    } else {
                        if (userChannelArray[userIndex][channelIndex] == 1) {
                            std::cout << "I | User [" << usernames[userIndex] << "] is already in channel [" << channels[channelIndex] << "]" << std::endl;
                            sendError(client_addr, "E | You are already in that channel");
                        } else {
                            //ADD USER TO CHANNEL
                            userChannelArray[userIndex][channelIndex] = 1;
                            std::cout << "I | User [" << usernames[userIndex] << "] joined channel [" << channels[channelIndex] << "]" << std::endl;
                        }
                    }
                    
                }
                break;
            }

            //LEAVE REQUEST
            case REQ_LEAVE: {
                std::cout << "C | REQ_LEAVE" << std::endl;
                struct request_leave *leave = (struct request_leave*) incomingPacket;
                if(userIndex < 0) { //user not logged in
                    sendError(client_addr, "E | You are not a registered user! Please log in");
                } else {
                    channelIndex = getChannelIndex(leave->req_channel);
                    if(channelIndex < 0) { //channel doesn't exist
                        sendError(client_addr, "E | That's not a real channel...");
                    } else if (userChannelArray[userIndex][channelIndex] == 0) {
                        sendError(client_addr, "E | You are not in channel: " + channels[channelIndex]);
                    } else {
                        //LEAVE THE CHANNEL
                        userChannelArray[userIndex][channelIndex] = 0;
                        std::cout << "I | User [" << usernames[userIndex] << "] left channel [" << channels[channelIndex] << "]" << std::endl;
                        deleteEmptyChannels();
                    }
                }
                break;
            }

            //LIST REQUEST
            case REQ_LIST: {
                std::cout << "C | REQ_LIST" << std::endl;
                if(userIndex < 0) { //user not logged in
                    sendError(client_addr, "E | You are not a registered user! Please log in");
                } else {
                    int channelCount = channels.size(); //get number of active channels
                    if(channelCount == 0) { //no active channels
                        sendError(client_addr, "E | There are no active channels on the server");
                    } else {

                        //GENERATE LIST PACKET
                        struct text_list result = { TXT_LIST, channelCount };
                        result.txt_channels[channelCount];
                        for(int i = 0; i < channelCount; i++) {
                            strcpy(result.txt_channels[i].ch_channel, channels[i].c_str());
                        }

                        //SEND LIST PACKET
                        int totalSize = sizeof(result) + (sizeof(result.txt_channels[0]) * channelCount);
                        if(sendto(server, &result, totalSize, 0, (struct sockaddr *) &client_addr, sizeof(client_addr)) == -1) {
                            perror("E | Error sending list packet");
                        }
                        std::cout << "I | Sent a list response to [" << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << "]" << std::endl;
                    }
                }
                break;
            }

            //WHO REQUEST
            case REQ_WHO: {
                std::cout << "C | REQ_WHO" << std::endl;
                if(userIndex < 0) { //user not logged in
                    sendError(client_addr, "E | You are not a registered user! Please log in");
                } else {
                    struct request_who *who = (struct request_who*) incomingPacket;
                    channelIndex = getChannelIndex(who->req_channel);
                    if(channelIndex < 0) { //channel doesn't exist
                        sendError(client_addr, "E | That's not a real channel");
                    } else {
                        int numUserInChan = getUsersInChannel(channelIndex);
                        if(numUserInChan == 0) {
                            std::cout << "W | This channel is empty and should have been deleted. Let's delete it now" << std::endl;
                            sendError(client_addr, "E | Nobody is in that channel");
                            deleteEmptyChannels();
                        } else {

                            //GENERATE WHO PACKET
                            struct text_who result = { TXT_WHO, numUserInChan };
                            strcpy(result.txt_channel, channels[channelIndex].c_str());
                            result.txt_users[numUserInChan];
                            for(int i = 0; i < MAX_USERS; i++) {
                                if(userChannelArray[i][channelIndex] == 1) {
                                    strcpy(result.txt_users[i].us_username, usernames[i].c_str());
                                }
                            }

                            //SEND WHO PACKET
                            int totalSize = sizeof(result) + (sizeof(result.txt_users[0]) * numUserInChan);
                            if(sendto(server, &result, totalSize, 0, (struct sockaddr *) &client_addr, sizeof(client_addr)) == -1) {
                                perror("E | Error sending who packet");
                            }
                            std::cout << "I | Sent a who response to [" << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << "]" << std::endl;
                        }
                    }
                }
                break;
            }
            //SAY REQUEST
            case REQ_SAY: {
                std::cout << "C | REQ_SAY" << std::endl;
                struct request_say *say = (struct request_say*) incomingPacket;
                if(userIndex < 0) { //user not logged in
                    sendError(client_addr, "E | Not logged in");
                } else {
                    channelIndex = getChannelIndex(say->req_channel);
                    if(channelIndex < 0) { //trying to talk on null channel
                        sendError(client_addr, "E | Not a valid channel. /join this channel first");
                    } else {
                        if(userChannelArray[userIndex][channelIndex] == 0) { //not subscribed to this channel
                            sendError(client_addr, "E | You are not in that channel");
                        } else {
                        	std::cout << "I | User [" << usernames[userIndex] << "] is talking on [" << channels[channelIndex] << "]" << std::endl;

                            //GENERATE SAY PACKET
                            struct text_say result;
                            result.txt_type = TXT_SAY;

                            //COPY CHANNEL, USER, AND SAY TEXT TO A REPLY PACKET
                            strcpy(result.txt_channel, channels[channelIndex].c_str());
                            strcpy(result.txt_username, usernames[userIndex].c_str());
                            strcpy(result.txt_text, say->req_text);

                            //SEND TO ALL SUBSCRIBERS OF CHANNEL
                            for(int i = 0; i < MAX_USERS; i++) {
                                if(userChannelArray[i][channelIndex] == 1) {
                                    struct sockaddr_in tempClient = clientIps[i].obj;
                                    if(sendto(server, &result, sizeof(result), 0, (struct sockaddr *) &tempClient, sizeof(client_addr)) ==-1) {
                                        perror("E | Error sending say packet");
                                    }
                                }
                            }
                        }
                    }

                }
            break;
            }
            //DEFAULT:
            default: {
                std::cout << "E | Invalid command received... wtf" << std::endl;
                sendError(client_addr, "E | Keep your malformed packets to yourself!");
                break;
            }
        }
    } //END WHILE
    close(server);
} //END MAIN


/*
=============================================================================
 # creates a new user and returns the user index [0->MAX_USERS]
 # if user already exists return -1
 # if user array is full return -2
 ~ O(1) + user lookup
=============================================================================
*/
int createUser(std::string username, struct sockaddr_in client) {
    if(username.length() > USERNAME_MAX) { //truncate username if necessary
        username.erase(USERNAME_MAX-1, std::string::npos);
    }
    //Check if user already exists
    int key = getUserIndex(client);
    if(key != -1) {
        std::cout << "E | User already exists - " << usernames[key] << "@" << clientIps[key].ip << ":" << clientIps[key].port << " with index [" << key << "]" << std::endl;
        return key; //user exists, return index
    }
    //Check if user array is full
    key = usernames.size();
    if(key >= MAX_USERS) {
        return -2;  //max user limit reached
    }
    //Create a new user using ip:port combo (unique identifier)
    struct ip_address newUser = { inet_ntoa(client.sin_addr), ntohs(client.sin_port), client };
    std::cout << "I | Creating new user: " << username << "@" << newUser.ip << ":" << newUser.port << "]" << std::endl;
    usernames.push_back(username);
    clientIps.push_back(newUser);
    return key;
}

/*
=============================================================================
 # return the user index [0->MAX_USERS]
 # if user doesn't exists return -1
 if user array is full return -2
 ~ O(n*USERNAME_MAX) -- string compare is letter by letter
=============================================================================
*/
int getUserIndex(struct sockaddr_in client) {
    int clSize = clientIps.size();  //compile error if using clientIps.size() in min function?
    int minimum = std::min(MAX_USERS, clSize);
    for(int i = 0; i<minimum; i++) {
        if((clientIps[i].ip.compare(inet_ntoa(client.sin_addr)) == 0) && ntohs(client.sin_port) == clientIps[i].port) {
            return i;
        }
    }
    if(clSize < MAX_USERS) {
        return -1;  //new user
    } else { 
        return -2;  //user array full
    }
}

/*
=============================================================================
 # if channel exists return index
 # if channel doesn't exist return -1
 ~ O(n*CHANNEL_MAX) -- string compare is letter by letter
=============================================================================
*/
int getChannelIndex(std::string channel) {
    if(channel.length() > CHANNEL_MAX) {
        channel.erase(CHANNEL_MAX-1, std::string::npos);
    }
    int chSize = channels.size();   //compile error if using channels.size() on next row?
    int minimum = std::min(MAX_CHANNELS, chSize);
    for(int i = 0; i<minimum; i++) {
        if(channel.compare(channels[i]) == 0) {
            return i;
        }
    }
    return -1;
}

/*
=============================================================================
 # creates a new channel and returns channel index
 # if channel array is full return -1
 ~ O(1) + channel lookup
=============================================================================
*/
int createNewChannel(std::string channel) {
    if(channel.length() > CHANNEL_MAX) {
        channel.erase(CHANNEL_MAX-1, std::string::npos);
    }
    int chSize = channels.size();
    if(chSize == CHANNEL_MAX) {
        return -1;
    } else {
        std::cout << "I | Creating channel: [" << channel << "]" << std::endl;
        channels.push_back(channel);
        return chSize;
    }
}


/*
=============================================================================
 # returns the count of users in a channel
 # if channel array is full return -1
 ~ O(n)
=============================================================================
*/
int getUsersInChannel(int chan) {
    int count = 0;
    for(int i = 0; i<MAX_USERS; i++) {
        if (userChannelArray[i][chan] == 1) {
            count++;
        }
    }
    return count;
}


/*
=============================================================================
 # sends an error to the client
 ~ O(1)
=============================================================================
*/
void sendError(struct sockaddr_in client, std::string errMsg) {
    struct text_error result = { TXT_ERROR };
    strcpy(result.txt_error, errMsg.c_str());
    std::cout << "W | Error occured: " << errMsg << std::endl;
    if(sendto(server, &result, sizeof(result), 0, (struct sockaddr*) &client, sizeof(client)) == -1) {
        perror("E | Error sending error packet");
    }
}


/*
=============================================================================
 # deletes all empty channels (bulk delete, if a user leaving was in multiple channels)
 ~ O(n) -- could be linear if we pass in channel index
=============================================================================
*/
void deleteEmptyChannels() {
    int channelListSize = channels.size();
    for(int i = channelListSize-1; i>=0; i--) {
        if(getUsersInChannel(i) == 0) {
            std::cout << "I | Empty channel [" << channels[i] << "] was erased!" << std::endl;
            channels.erase(channels.begin()+i);
        }
    }
}