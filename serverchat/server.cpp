/*
=============================================================================
 Name        : server.cpp
 Author      : David Jensen
 Class       : CIS 432, Fall 17
 Description : Project 2: ServerChat
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
#include <stdio.h>
#include <string>
#include <sys/types.h>
#include <sys/socket.h>
#include <unistd.h>
#include <vector>
#include <fcntl.h>
#include <time.h>

#include "duckchat.h"

/*
Set the LOGGING value based on the type of output messages:
0 = no console messages
1 = |E| errors
2 = |W| warnings
3 = |S| S2S messages
4 = |C| client messages
5 = |I| informational messages
6 = |D| debugging messages 
*/
#define LOGGING 3

//FUNCTION DEFINITIONS:
int createUser(std::string username, struct sockaddr_in client);
void sendError(struct sockaddr_in client, std::string errMsg);
int getUserIndex(struct sockaddr_in client);
int createNewChannel(std::string channel);
int getChannelIndex(std::string channel);
int getUsersInChannel(int chan);
void deleteEmptyChannels();

//GENERIC DATA STRUCTURES:
struct ip_address {std::string ip; int port; struct sockaddr_in obj; };

//CLIENT DATA STRUCTURES:
std::vector<std::vector<int> > userChannelArray(MAX_USERS, std::vector<int>(MAX_CHANNELS));
std::vector<struct ip_address> clientIps;
std::vector<std::string> usernames;
std::vector<std::string> channels;

//S2S DATA STRUCTURES:
std::vector<std::vector<int> > serverChannelArray(MAX_SERVERS, std::vector<int>(MAX_CHANNELS));
std::vector<struct ip_address> serverIps;
std::vector<std::string> peerChannels;
std::vector<uint64_t> messageIDs;
std::string my_socket;

//S2S DEFINITIONS:
int getServerIndex(struct sockaddr_in serverPeer);
int getPeerChannelIndex(std::string channel);
int createNewPeerChannel(std::string channel);
int getServersInChannel(int chan);
bool checkMessageId(uint64_t testval);
uint64_t generateMessageId();

//SOFT STATES:
std::vector<std::vector<time_t> > softL(MAX_SERVERS, std::vector<time_t>(MAX_CHANNELS));
void softStates();
void softLeaves();
void softJoins();
time_t sendJoins;

//SEND PACKET DEFINITIONS:
void sendS2SLeave(int srvIndex, int peerChIndex, std::string channel);
void sendS2SSay(int srvIndex, int peerChIndex, std::string username, std::string channel, std::string msg, uint64_t msgID);
void sendS2SSayAll(int peerChIndex, std::string username, std::string channel, std::string msg, uint64_t msgID);
void sendClientSay(int chIndex, std::string user, std::string channel, std::string msg);
void sendS2SJoin(int srvIndex, int peerChIndex, std::string channel);
void sendS2SJoinAll(int peerChIndex, std::string channel);

//GLOBAL VARIABLES:
int server; // socket file descriptor

//MAIN FUNCTION
int main(int argc, char **argv) {
    //VALIDATE INPUT
    if (argc < 3 || argc %2 != 1) {
        fprintf(stderr, "ERROR: Invalid input parameters! Enter data in server hostname/port number pairs\n");
        exit(1);
    }

	/* Structure describing an Internet socket address. */
	struct sockaddr_in server_addr, client_addr;
	socklen_t server_size = sizeof(server_addr);
	if(LOGGING > 2) { std::cout << "I | Server is starting..."; }

	/* ---------- ESTABLISHING SOCKET CONNECTION ----------*/
	server = socket(AF_INET, SOCK_DGRAM, 0);
	if (server < 0) {
		std::cout << "E | Error creating socket!..." << std::endl;
		exit(-1);
	}
   // fcntl(server, F_SETFL, O_NONBLOCK);

    memset((char *) &server_addr, 0, server_size);
	server_addr.sin_family = AF_INET;
	server_addr.sin_addr.s_addr = htonl(std::atoi(argv[1]));
	server_addr.sin_port = htons(std::atoi(argv[2]));
    if(LOGGING > 2) { std::cout << "server socket created successfully... | Port: " << argv[2] << std::endl; }

    /* ---------------- SET SOCKET LEVEL --------------- */
	int yes = 1;
	if (setsockopt(server, SOL_SOCKET, SO_REUSEADDR, &yes, sizeof(yes)) == -1) {
		perror("setsockopt");
		exit(1);
	}

	/* ---------------- BINDING THE SOCKET --------------- */
	if ((bind(server, (struct sockaddr*) &server_addr, server_size)) < 0) {
		std::cout << "E | Error binding connection. The socket has already been established... | Port: " << argv[2] << std::endl;
        exit(-1);
    }

    //ASSIGN IP FOR CONSOLE LOG PURPOSES
    my_socket = argv[1];
    std::string my_port = argv[2];
    my_socket.append(":").append(my_port);
    std::string replaceHost = "127.0.0.1";
    std::string input;

    //GENERATE ADJACENT SERVER LIST:
    for (int s = 3; s<argc; s+=2) {
        input = argv[s];
        struct sockaddr_in server_peer;
        memset((char *) &server_peer, 0, sizeof(server_peer));
        server_peer.sin_family = AF_INET;
        server_peer.sin_port = htons(std::atoi(argv[s+1]));
        if(input.compare("localhost") == 0) {
            inet_aton(replaceHost.c_str(), &server_peer.sin_addr);
        } else {
            inet_aton(input.c_str(), &server_peer.sin_addr);    
        }
        
        //Create a new server mapping using ip:port combo (unique identifier)
        struct ip_address newServer = { inet_ntoa(server_peer.sin_addr), ntohs(server_peer.sin_port), server_peer };
        if(LOGGING > 5) { std::cout << "S | " << my_socket << " [info] Creating peer server: " << newServer.ip << ":" << newServer.port << std::endl; }
        serverIps.push_back(newServer);
    }

    //BUILD SELECT FUNCTION: https://beej.us/guide/bgnet/output/html/multipage/advanced.html#select
    //Copied from client code
    fd_set read_fds;
    struct timeval tv;
    tv.tv_sec = 1;
    tv.tv_usec = 0;

	//PROGRAM LOOP VARIABLES:
    bool listening = true;
    int bytesReceived;

    sendJoins = time(NULL);

    while (listening) {

        //CLEAR BUFFER
        char buffer[MAXBUFLEN]; // buffer to receive, initialize every loop to ensure it is cleared
        bytesReceived = 0;

        //CHECK SOFT STATES
        softStates();

        //SET FILE DESCRIPTERS
        FD_ZERO(&read_fds);
        FD_SET(server, &read_fds);

        //CHECK SELECT
        if (select(server+1, &read_fds, NULL, NULL, &tv) < 0) {
            perror("Failed to select");
        }


        if(FD_ISSET(server, &read_fds)) {

            //GET MESSAGE FROM CLIENT
            if ((bytesReceived = recvfrom(server, buffer, MAXBUFLEN-1 , 0, (struct sockaddr*) &client_addr, &server_size)) == -1) {
                if(LOGGING > 0) { perror("E | Failed to read message from buffer"); }
                bytesReceived = 0;
            }

            //BEGIN PROCESSING MESSAGE
            buffer[bytesReceived] = '\0';
            if(LOGGING > 5) { std::cout << "D | " << my_socket << " [recv] Packet received | Bytes: " << bytesReceived << " | Sender: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
            if(sizeof(buffer) > MAXBUFLEN) {
                if(LOGGING > 1) { std::cout << "W | " << my_socket << " *!* | datagram is too large for the buffer and was truncated | Buffer Size: " << sizeof(buffer) << " | Datagram Size: " << bytesReceived << std::endl; }
            }

            //CONVERT INCOMING MESSAGE TO A PACKET
            struct request *incomingPacket = (struct request*) buffer;
            int type = incomingPacket->req_type;

            //DETERMINE MESSAGE TYPE
            int userIndex, serverIndex, localChannelIndex, peerChannelIndex;
            if(type == REQ_LOGIN) { //create a user
                struct request_login *login = (struct request_login*) incomingPacket;
                if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_LOGIN | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | User: " << login->req_username << std::endl; }
                userIndex = createUser(login->req_username, client_addr);
            } else if (type < 8) { //message from client
                if(LOGGING > 5) { std::cout << "D | " << my_socket << " [info] REC_PACK | Received client packet" << std::endl; }
                userIndex = getUserIndex(client_addr);
            } else { //message from server
                if(LOGGING > 5) { std::cout << "D | " << my_socket << " [info] REC_PACK | Received server packet" << std::endl; }
                serverIndex = getServerIndex(client_addr);
            }
            switch(type) {

                //LOGIN REQUEST
                case REQ_LOGIN: {
                    if (userIndex == -1) { //user already exists in clientIps
                        sendError(client_addr, "E | You are already logged in I guess..");
                    } else if (userIndex == -2) { //we have reached our user limit
                        sendError(client_addr, "E | Sorry bud, we have too many users right now.");
                    }
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [info] REQ_LOGIN success | User: " << usernames[userIndex] << std::endl; }
                    break;
                }

                //LOGOUT REQUEST
                case REQ_LOGOUT: {
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_LOGOUT | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
                    if(userIndex < 0) { //user not in our list
                        sendError(client_addr, "E | You can't log out if you aren't logged in!");
                    } else {
                        if(LOGGING > 3) { std::cout << "C | " << my_socket << " [info] logging out | User: " << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << std::endl; }
                        //LOGOUT & DELETE ALL USER DATA
                        for(int i = 0; i < CHANNEL_MAX; i++) {
                            if(userChannelArray[userIndex][i] == 1) {
                                userChannelArray[userIndex][i] = 0;
                            }
                        }
                        userChannelArray.erase(userChannelArray.begin()+userIndex);
                        clientIps.erase(clientIps.begin()+userIndex);
                        usernames.erase(usernames.begin()+userIndex);
                        deleteEmptyChannels();
                        if(LOGGING > 3) { std::cout << "C | " << my_socket << " [info] REQ_LOGOUT success | User: " << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << std::endl; }
                    }
                    break;
                }

                //JOIN REQUEST
                case REQ_JOIN: {
                    bool sendJoin = false;
                    struct request_join *join = (struct request_join*) incomingPacket;
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_JOIN | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << join->req_channel << std::endl; }
                    if (userIndex < 0) { //user not logged in
                        sendError(client_addr, "E | You are not a registered user! Please log in");
                    } else {
                        localChannelIndex = getChannelIndex(join->req_channel);
                        if (localChannelIndex < 0) { //channel doesnt exist
                            localChannelIndex = createNewChannel(join->req_channel);
                        } 
                        if(localChannelIndex < 0) { //the channel array is full, channel not created
                            sendError(client_addr, "E | Wow! That's a hot channel, all the cool kids are in there. And you are not.");
                        } else {
                            if (userChannelArray[userIndex][localChannelIndex] == 1) {
                                if(LOGGING > 3) { std::cout << "I | " << my_socket << " [info] REQ_JOIN failed | Reason: User " << usernames[userIndex] << " is already in channel " << channels[localChannelIndex] << std::endl; }
                                sendError(client_addr, "E | You are already in that channel");
                            } else {
                                //ADD USER TO LOCAL CHANNEL
                                userChannelArray[userIndex][localChannelIndex] = 1;
                                if(LOGGING > 3) { std::cout << "C | " << my_socket << " [info] REQ_JOIN success | User: " << usernames[userIndex] << " | Channel: " << channels[localChannelIndex] << std::endl; }
                                sendJoin = true;
                            }
                        }
                    }
                    if(sendJoin) {
                        peerChannelIndex = getPeerChannelIndex(join->req_channel);
                        if(peerChannelIndex < 0) { //peer channel doesnt exist
                            peerChannelIndex = createNewPeerChannel(join->req_channel);
                        }
                        if(peerChannelIndex < 0) {
                            if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] | Message: Unable to join peer channel, array is full" << std::endl; }
                        } else {
                            sendS2SJoinAll(peerChannelIndex, join->req_channel);
                        }
                    }
                    break;
                }

                //LEAVE REQUEST
                case REQ_LEAVE: {
                    struct request_leave *leave = (struct request_leave*) incomingPacket;
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_LEAVE | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << leave->req_channel << std::endl; }
                    if(userIndex < 0) { //user not logged in
                        sendError(client_addr, "E | You are not a registered user! Please log in");
                    } else {
                        localChannelIndex = getChannelIndex(leave->req_channel);
                        if(localChannelIndex < 0) { //channel doesn't exist
                            sendError(client_addr, "E | That's not a real channel...");
                        } else if (userChannelArray[userIndex][localChannelIndex] == 0) {
                            sendError(client_addr, "E | You are not in channel: " + channels[localChannelIndex]);
                        } else {
                            //LEAVE THE CHANNEL
                            userChannelArray[userIndex][localChannelIndex] = 0;
                            if(LOGGING > 3) { std::cout << "C | " << my_socket << " [info] REQ_LEAVE success | User " << usernames[userIndex] << " | Channel: " << channels[localChannelIndex] << std::endl; }
                            deleteEmptyChannels();
                        }
                    }
                    break;
                }

                //LIST REQUEST
                case REQ_LIST: {
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_LIST | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
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
                            if(LOGGING > 3) { std::cout << "C | " << my_socket << " [send] TXT_LIST success | Client: " << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << std::endl; }
                        }
                    }
                    break;
                }

                //WHO REQUEST
                case REQ_WHO: {
                    struct request_who *who = (struct request_who*) incomingPacket;
                    if(LOGGING > 3) { std::cout << "C | " << my_socket << " [recv] REQ_WHO | Client: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << who->req_channel << std::endl; }
                    if(userIndex < 0) { //user not logged in
                        sendError(client_addr, "E | You are not a registered user! Please log in");
                    } else {
                        localChannelIndex = getChannelIndex(who->req_channel);
                        if(localChannelIndex < 0) { //channel doesn't exist
                            sendError(client_addr, "E | That's not a real channel");
                        } else {
                            int numUserInChan = getUsersInChannel(localChannelIndex);
                            if(numUserInChan == 0) {
                                if(LOGGING > 1) { std::cout << "W | " << my_socket << " [warn] | Message: This channel is empty and should have been deleted...time to purge" << std::endl; }
                                sendError(client_addr, "E | Nobody is in that channel");
                                deleteEmptyChannels();
                            } else {

                                //GENERATE WHO PACKET
                                struct text_who result = { TXT_WHO, numUserInChan };
                                strcpy(result.txt_channel, channels[localChannelIndex].c_str());
                                result.txt_users[numUserInChan];
                                for(int i = 0; i < MAX_USERS; i++) {
                                    if(userChannelArray[i][localChannelIndex] == 1) {
                                        strcpy(result.txt_users[i].us_username, usernames[i].c_str());
                                    }
                                }

                                //SEND WHO PACKET
                                int totalSize = sizeof(result) + (sizeof(result.txt_users[0]) * numUserInChan);
                                if(sendto(server, &result, totalSize, 0, (struct sockaddr *) &client_addr, sizeof(client_addr)) == -1) {
                                    perror("E | Error sending who packet");
                                }
                                if(LOGGING > 3) { std::cout << "C | " << my_socket << " [send] TXT_WHO success | Client: " << usernames[userIndex] << "@" << clientIps[userIndex].ip << ":" << clientIps[userIndex].port << std::endl; }
                            }
                        }
                    }
                    break;
                }

                //SAY REQUEST
                case REQ_SAY: {
                    struct request_say *say = (struct request_say*) incomingPacket;
                    if(LOGGING > 5) { std::cout << "C | " << my_socket << " [recv] REQ_SAY | Channel: " << say->req_channel << std::endl; }
                    if(userIndex < 0) { //user not logged in
                        sendError(client_addr, "E | Not logged in");
                    } else {
                        localChannelIndex = getChannelIndex(say->req_channel);
                        if(localChannelIndex < 0) { //trying to talk on null channel
                            sendError(client_addr, "E | Not a valid channel. /join this channel first");
                        } else {
                            if(userChannelArray[userIndex][localChannelIndex] == 0) { //not subscribed to this channel
                                sendError(client_addr, "E | You are not in that channel: " + channels[localChannelIndex]);
                            } else {
                                //GENERATE SAY PACKET
                                sendClientSay(localChannelIndex, usernames[userIndex], channels[localChannelIndex], say->req_text);

                                //FORWARD SAY MESSAGE TO SERVER PEERS
                                peerChannelIndex = getPeerChannelIndex(channels[localChannelIndex]);
                                if(peerChannelIndex < 0) { //we don't have a peer channel that a user is talking on
                                    peerChannelIndex = createNewPeerChannel(say->req_channel);
                                    if(peerChannelIndex < 0) {
                                        if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] S2S_JOIN failed | Error: Failed to join peer channel tree | Reason: Max peer channels reached" << std::endl; }
                                    }
                                } else {
                                    uint64_t msgId = generateMessageId();
                                    sendS2SSayAll(peerChannelIndex, usernames[userIndex], channels[localChannelIndex], say->req_text, msgId);
                                }
                            }
                        }
                    }
                    break;
                }

                //SERVER JOIN REQUEST
                case S2S_JOIN: {
                    struct server_join *srv_join = (struct server_join*) incomingPacket;
                    if(LOGGING > 2) { std::cout << "S | " << my_socket << " [recv] S2S_JOIN | Peer: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << srv_join->req_channel << std::endl; }
                    if(serverIndex < 0) { //not a valid s2s host
                        if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] S2S_JOIN failed | Error: Failed to join peer channel tree | Reason: S2S host does not exist: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
                    } else {
                        peerChannelIndex = getPeerChannelIndex(srv_join->req_channel); //check local peer channel array
                        if (peerChannelIndex < 0) { //channel doesnt exist in peer channel array
                            peerChannelIndex = createNewPeerChannel(srv_join->req_channel);
                        }
                        if(peerChannelIndex < 0) {
                            if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] S2S_JOIN failed | Error: Failed to join peer channel tree | Reason: Max peer channels reached" << std::endl; }
                        } else { //channel created successfully
                            softL[serverIndex][peerChannelIndex] = time(NULL);
                            if(serverChannelArray[serverIndex][peerChannelIndex] == 1) {
                                if(LOGGING > 5) { std::cout << "D | " << my_socket << " [dbug] S2S_JOIN | Not forwarding packet; already in channel | Channel: " << srv_join->req_channel << std::endl; }
                            } else { //forward the join
                                serverChannelArray[serverIndex][peerChannelIndex] = 1;
                                sendS2SJoin(serverIndex, peerChannelIndex, srv_join->req_channel);
                            }
                        } 
                    }
                    break;
                }

                //SERVER LEAVE REQUEST
                case S2S_LEAVE: {
                    struct server_leave *srv_leave = (struct server_leave*) incomingPacket;
                    if(LOGGING > 2) { std::cout << "S | " << my_socket << " [recv] S2S_LEAVE | Peer: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << srv_leave->req_channel << std::endl; }
                    if(serverIndex < 0) { //not a valid s2s host
                        if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] S2S_LEAVE failed | Error: Failed to leave peer channel tree | Reason: S2S host does not exist: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
                    } else {
                        peerChannelIndex = getPeerChannelIndex(srv_leave->req_channel); //check local peer channel array
                        if(peerChannelIndex < 0) { //we dont have a record of that channel, do nothing
                            if(LOGGING > 1) { std::cout << "W | " << my_socket << " [warn] S2S_LEAVE failed | Error: Failed to leave peer channel tree | Reason: Channel does not exist: " << srv_leave->req_channel << std::endl; }
                        } else {
                            //LEAVE THE CHANNEL
                            serverChannelArray[serverIndex][peerChannelIndex] = 0;
                            if(LOGGING > 4) { std::cout << "S | " << my_socket << " [info] S2S_LEAVE success | Peer: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << " | Channel: " << peerChannels[peerChannelIndex] << std::endl; }
                        }
                    }
                    break;
                }

                //SERVER SAY REQUEST
                case S2S_SAY: {
                    struct server_say *srv_say = (struct server_say*) incomingPacket;
                    if(LOGGING > 2) { std::cout << "S | " << my_socket << " [recv] S2S_SAY | Peer: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
                    bool localUsers = true;
                    bool peerServers = true;                 
                    if(serverIndex < 0) { //not a valid s2s host
                        if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] S2S_SAY failed | Error: Failed to process S2S_SAY request | Reason: S2S host does not exist: " << inet_ntoa(client_addr.sin_addr) << ":" << ntohs(client_addr.sin_port) << std::endl; }
                    } else {
                        peerChannelIndex = getPeerChannelIndex(srv_say->req_channel);
                        localChannelIndex = getChannelIndex(srv_say->req_channel);
                        if(peerChannelIndex < 0) { peerServers = false; } //not in peer channel
                        if(localChannelIndex < 0) { localUsers = false; } //not in local channel  
                        if(checkMessageId(srv_say->message_id)) { //duplicate message, send leave request

                            if(LOGGING > 1) { std::cout << "W | " << my_socket << " [warn] S2S_SAY failed | Error: Duplicate message detected | ID: " << srv_say->message_id << std::endl; }
                            //SEND LEAVE REQUEST TO SENDER
                            if(peerServers) {
                                sendS2SLeave(serverIndex, peerChannelIndex, srv_say->req_channel); 
                            }
                        } else { //NOT A DUPLICATE MESSAGE
                            if(LOGGING > 5) { std::cout << "D | " << my_socket << " [info] S2S_SAY debug | Not a duplicate message ID" << std::endl; }
                            if(localUsers && !peerServers) { //local users, not in peer channel
                                if(LOGGING > 1) { std::cout << "W | " << my_socket << " [warn] S2S_SAY error | Error: Not in peer channel | Reason: Unknown, joining channel: " << srv_say->req_channel << std::endl; }
                                peerChannelIndex = createNewPeerChannel(srv_say->req_channel);
                                if(peerChannelIndex < 0) {
                                    if(LOGGING > 0) { std::cout << "E | " << my_socket << " [fail] S2S_SAY error | Error: Failed to created peer channel | Reason: Peer array is full: " << srv_say->req_channel << std::endl; }
                                    peerServers = false;
                                } else {
                                    sendS2SJoin(serverIndex, peerChannelIndex, srv_say->req_channel);
                                    peerServers = true;  
                                }
                            }
                            if(localUsers) { //send to local users of that channel
                                sendClientSay(localChannelIndex, srv_say->req_username, srv_say->req_channel, srv_say->req_text);
                            }
                            if(peerServers) {
                                if(getServersInChannel(peerChannelIndex) > 0) { //we are in a channel tree with at least 2 servers
                                    //CREATE AND FORWARD S2S_SAY PACKET TO ALL PEERS ON CHANNEL
                                    sendS2SSay(serverIndex, peerChannelIndex, srv_say->req_username, srv_say->req_channel, srv_say->req_text, srv_say->message_id);
                                }
                            }
                            //leave conditions: no local users (users in local chan = 0) AND only 1 peer server (servers in peer chan == 1)
                            if(!localUsers && getServersInChannel(peerChannelIndex) < 2) { //no local users in that channel and less than 1 subscribed server
                                if(LOGGING > 5) { std::cout << "D | " << my_socket << " [ckpt] S2S_SAY debug | CKPT 5: send s2s leave" << std::endl; }
                                //SEND LEAVE REQUEST TO SENDER
                                sendS2SLeave(serverIndex, peerChannelIndex, srv_say->req_channel);
                            }
                        }
                    }
                    break;
                }

                //DEFAULT:
                default: {
                    if(LOGGING > 1) { std::cout << "E | " << my_socket <<  " [warn] | Error: Invalid command received... wtaf | Reason: Malformed packet received" << std::endl; }
                    //sendError(client_addr, "E | Keep your malformed packets to yourself!");
                    break;
                }  
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
        if(LOGGING > 0) { std::cout << "E | " << my_socket << " [warn] REQ_LOGIN failed | Error: Unable to create a new user | Reason: User already exists: " << usernames[key] << "@" << clientIps[key].ip << ":" << clientIps[key].port << " with index [" << key << "]" << std::endl; }
        return key; //user exists, return index
    }
    //Check if user array is full
    key = usernames.size();
    if(key >= MAX_USERS) {
        return -2;  //max user limit reached
    }
    //Create a new user using ip:port combo (unique identifier)
    struct ip_address newUser = { inet_ntoa(client.sin_addr), ntohs(client.sin_port), client };
    if(LOGGING > 4) { std::cout << "I | " << my_socket << " [info] REQ_LOGIN success | User: " << username << "@" << newUser.ip << ":" << newUser.port << std::endl; }
    usernames.push_back(username);
    clientIps.push_back(newUser);
    return key;
}

/*
=============================================================================
 # return the user index [0->MAX_USERS]
 # if user doesn't exists return -1
 # if user array is full return -2
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
 # return the server index [0->MAX_SERVERS]
 # if server doesn't exists return -1
 ~ O(n*SERVERNAME_MAX) -- string compare is letter by letter
=============================================================================
*/
int getServerIndex(struct sockaddr_in serverPeer) {
    int srvSize = serverIps.size();  //compile error if using serverIps.size() in min function?
    int minimum = std::min(MAX_SERVERS, srvSize);
    for(int i = 0; i<minimum; i++) {
        if((serverIps[i].ip.compare(inet_ntoa(serverPeer.sin_addr)) == 0) && ntohs(serverPeer.sin_port) == serverIps[i].port) {
            return i;
        }
    }
    //NEW PEER ADDRESS
    return -1;
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
 # if peerChannel exists return index
 # if peerChannel doesn't exist return -1
 ~ O(n*CHANNEL_MAX) -- string compare is letter by letter
=============================================================================
*/
int getPeerChannelIndex(std::string channel) {
    if(channel.length() > CHANNEL_MAX) {
        channel.erase(CHANNEL_MAX-1, std::string::npos);
    }
    int chSize = peerChannels.size();   //compile error if using peerChannels.size() on next row?
    int minimum = std::min(MAX_CHANNELS, chSize);
    for(int i = 0; i<minimum; i++) {
        if(channel.compare(peerChannels[i]) == 0) {
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
    if(chSize == MAX_CHANNELS) {
        return -1;
    } else {
        if(LOGGING > 4) { std::cout << "I | " << my_socket << " [info] Create local channel success | New Channel: " << channel << std::endl; }
        channels.push_back(channel);
        return chSize;
    }
}

/*
=============================================================================
 # creates a new Peer channel and returns channel index
 # if Peer channel array is full return -1
 ~ O(1) + channel lookup
=============================================================================
*/
int createNewPeerChannel(std::string channel) {
    if(channel.length() > CHANNEL_MAX) {
        channel.erase(CHANNEL_MAX-1, std::string::npos);
    }
    int chSize = peerChannels.size();
    if(chSize == MAX_CHANNELS) {
        return -1;
    } else {
        if(LOGGING > 4) { std::cout << "I | " << my_socket << " [info] Create peer channel success | New Peer Channel: " << channel << std::endl; }
        peerChannels.push_back(channel);
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
 # returns the count of servers in the channel tree
 # if server channel array is full return -1
 ~ O(n)
=============================================================================
*/
int getServersInChannel(int chan) {
    int count = 0;
    for(int i = 0; i<MAX_SERVERS; i++) {
        if (serverChannelArray[i][chan] == 1) {
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
    if(LOGGING > 1) { std::cout << "W | " << my_socket << " [warn] error occured | Error: " << errMsg << std::endl; }
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
    int channelListSize = channels.size()-1;
    for(int i = channelListSize; i>=0; i--) {
        if(getUsersInChannel(i) == 0) {
            //CHANNEL IS EMPTY, DELETE IT
            channels.erase(channels.begin()+i);

            if(LOGGING > 4) { std::cout << "I | " << my_socket << " [info] remove channel success | Empty Channel Erased: " << channels[i] << std::endl; }
        }
    }
    
}



/*
=============================================================================
 # generates a random 64bit number using /dev/urandom
 ~ O(64) - reads bits 1 at a time until we have 64
=============================================================================
*/
uint64_t generateMessageId() {
    int myFile = open("/dev/urandom", O_RDONLY);            
    uint64_t rand;            
    int ret = read(myFile, &rand, sizeof(rand)-1);
    if(LOGGING > 5) { std::cout << "I | " << my_socket << " S2S_SAY message id created | Message ID: " << rand << std::endl; }
    close(myFile);
    messageIDs.push_back(rand);
    return rand;
}

/*
=============================================================================
 # checks the list of message id's to see if we've encounted a duplicate
 # returns true if duplicate is detected
 # returns false and adds the message id to the array if the value is not found
 ~ O(n) -- could be linear if we pass in channel index
=============================================================================
*/
bool checkMessageId(uint64_t testval) {
    for(int i = 0; i < messageIDs.size(); i++) {
        if(testval == messageIDs[i]) {
            return true;
        }
    }
    if(messageIDs.size() > 50) {
        messageIDs.erase(messageIDs.begin(),messageIDs.end()-20); //keep 20 of the most recent elements
    }
    messageIDs.push_back(testval);
    return false;
}

/*
=============================================================================
 # manages the soft state S2S_JOIN requests
 ~ O(n + 1) -- we check the timestamp for every channel + timestamp for joins
=============================================================================
*/
void softStates() {
    softJoins();
    softLeaves();
}    

/*
=============================================================================
 # keeps a 60 second timer; 
 # if timer is past 60 seconds, send a soft_join to every subscribed server on a channel
 ~ O(1) 
=============================================================================
*/
void softJoins() {
    double timePassed = difftime(time(NULL), sendJoins);
    if(timePassed > 60) { //longer than a minute
        for(int s = 0; s < MAX_SERVERS; s++) {
            for(int t = 0; t < MAX_CHANNELS; t++) {
                if(serverChannelArray[s][t] == 1) {
                    if(LOGGING > 5) { std::cout << "D | " << my_socket << " Sending soft join | Port: " <<  serverIps[s].port << " | Channel: " << peerChannels[t] <<  std::endl; }
                    struct server_join sftJoin;
                    sftJoin.req_type = S2S_JOIN;
                    strcpy(sftJoin.req_channel, peerChannels[t].c_str());
                    struct sockaddr_in tempServer = serverIps[s].obj;
                    if(sendto(server, &sftJoin, sizeof(sftJoin), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
                        perror("E | Error sending SOFT_JOIN packet to server peers");
                    } else {
                        if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] SFT_JOIN | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << sftJoin.req_channel << std::endl; }
                    }
                }    
            }
        }
        sendJoins = time(NULL);
    }
}

/*
=============================================================================
 # checks the 2d array for channels over 120 seconds
 # sends a soft leave if channels are over 120 seconds
 ~ O(n2) 
=============================================================================
*/
void softLeaves() {
    for(int s = 0; s < MAX_SERVERS; s++) {
        for(int t = 0; t < MAX_CHANNELS; t++) {
            if(serverChannelArray[s][t] == 1) { //we are in the channel
                double timePassed = difftime(time(NULL), softL[s][t]);
                if(timePassed > 120) { //longer than 2 minutes
                    struct server_leave sftLeave;
                    sftLeave.req_type = S2S_LEAVE;
                    strcpy(sftLeave.req_channel, peerChannels[t].c_str());
                    struct sockaddr_in tempServer = serverIps[s].obj;
                    if(sendto(server, &sftLeave, sizeof(sftLeave), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
                        perror("E | Error sending SOFT_LEAVE packet to server peers");
                    } else {
                        if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] SFT_LEAVE | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << sftLeave.req_channel << std::endl; }
                        softL[s][t] = time(NULL);
                        serverChannelArray[s][t] = 0;
                    }
                }    
            }
        } 
    }
}


/*
=============================================================================
 # generates and sends a S2S_LEAVE request 
 ~ O(1) 
=============================================================================
*/
void sendS2SLeave(int srvIndex, int peerChIndex, std::string channel) {
    struct server_leave srv_leave;
    srv_leave.req_type = S2S_LEAVE;
    strcpy(srv_leave.req_channel, channel.c_str());
    struct sockaddr_in tempServer = serverIps[srvIndex].obj;
    if(sendto(server, &srv_leave, sizeof(srv_leave), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
        perror("E | Error forwarding leave packet to server peers");
    } else {
        serverChannelArray[srvIndex][peerChIndex] = 0; //delete the channel from our local list
        if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] S2S_LEAVE | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << srv_leave.req_channel << std::endl; }
    }
}

/*
=============================================================================
 # generates and sends a S2S_JOIN request 
 ~ O(1) 
=============================================================================
*/
void sendS2SJoin(int srvIndex, int peerChIndex, std::string channel) {
    struct server_join srv_join;
    srv_join.req_type = S2S_JOIN;
    strcpy(srv_join.req_channel, channel.c_str());

    for(int s = 0; s < serverIps.size(); s++) {
        serverChannelArray[s][peerChIndex] = 1; //add all peers to this channel
        softL[s][peerChIndex] = time(NULL);
        if(s != srvIndex) {
            struct sockaddr_in tempServer = serverIps[s].obj;
            if(sendto(server, &srv_join, sizeof(srv_join), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
                perror("E | Error forwarding S2S_JOIN packet to server peers");
            } else {
                if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] S2S_JOIN | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << srv_join.req_channel << std::endl; }
            }
        }
    }
}

/*
=============================================================================
 # generates and sends a S2S_JOIN request to all peer servers
 # only client functions invoke this version
 ~ O(n^2) 
=============================================================================
*/
void sendS2SJoinAll(int peerChIndex, std::string channel) {
    struct server_join srv_join;
    srv_join.req_type = S2S_JOIN;
    strcpy(srv_join.req_channel, channel.c_str());

    for(int s = 0; s < serverIps.size(); s++) {
        serverChannelArray[s][peerChIndex] = 1; //add all peers to this channel
        softL[s][peerChIndex] = time(NULL);
        struct sockaddr_in tempServer = serverIps[s].obj;
        if(sendto(server, &srv_join, sizeof(srv_join), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
            perror("E | Error forwarding S2S_JOIN packet to server peers");
        } else {
            if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] S2S_JOIN | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << srv_join.req_channel << std::endl; }
        }
    }
}

/*
=============================================================================
 # generates and sends a S2S_SAY request to all subscribed peer servers
 ~ O(n^2) 
=============================================================================
*/
void sendS2SSay(int srvIndex, int peerChIndex, std::string username, std::string channel, std::string msg, uint64_t msgID) {
    struct server_say srv_say;
    srv_say.req_type = S2S_SAY;
    srv_say.message_id = msgID;
    strcpy(srv_say.req_username, username.c_str());
    strcpy(srv_say.req_channel, channel.c_str());
    strcpy(srv_say.req_text, msg.c_str());

    for(int s = 0; s < serverIps.size(); s++) {
        if(serverChannelArray[s][peerChIndex] == 1) {
            if(s != srvIndex) {
                struct sockaddr_in tempServer = serverIps[s].obj;
                if(sendto(server, &srv_say, sizeof(srv_say), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
                    perror("E | Error forwarding S2S_JOIN packet to server peers");
                } else {
                    if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] S2S_SAY | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << srv_say.req_channel << std::endl; }
                }
            }
        }
    }
}


/*
=============================================================================
 # generates and sends a S2S_SAY request to all peer servers subscribed to a channel
 # only client functions invoke this version
 ~ O(n^2) 
=============================================================================
*/
void sendS2SSayAll(int peerChIndex, std::string username, std::string channel, std::string msg, uint64_t msgID) {
    struct server_say srv_say;
    srv_say.req_type = S2S_SAY;
    srv_say.message_id = msgID;
    strcpy(srv_say.req_username, username.c_str());
    strcpy(srv_say.req_channel, channel.c_str());
    strcpy(srv_say.req_text, msg.c_str());

    for(int s = 0; s < serverIps.size(); s++) {
        if(serverChannelArray[s][peerChIndex] == 1) {
            struct sockaddr_in tempServer = serverIps[s].obj;
            if(sendto(server, &srv_say, sizeof(srv_say), 0, (struct sockaddr *) &tempServer, sizeof(tempServer)) == -1) {
                perror("E | Error forwarding S2S_JOIN packet to server peers");
            } else {
                if(LOGGING > 2) { std::cout << "S | " << my_socket << " [send] S2S_SAY | Peer: " << inet_ntoa(tempServer.sin_addr) << ":" << ntohs(tempServer.sin_port) << " | Channel: " << srv_say.req_channel << std::endl; }
            }
        }
    }
}

/*
=============================================================================
 # generates and sends a TXT_SAY request to all local users on a server
 ~ O(n^2) 
=============================================================================
*/
void sendClientSay(int chIndex, std::string user, std::string channel, std::string msg) {
    struct text_say client_say;
    client_say.txt_type = TXT_SAY;

    //COPY CHANNEL, USER, AND SAY TEXT TO A SAY PACKET
    strcpy(client_say.txt_channel, channel.c_str());
    strcpy(client_say.txt_username, user.c_str());
    strcpy(client_say.txt_text, msg.c_str());

    //SEND TO ALL SUBSCRIBERS OF CHANNEL
    for(int i = 0; i < MAX_USERS; i++) {
        if(userChannelArray[i][chIndex] == 1) {
            struct sockaddr_in tempClient = clientIps[i].obj;
            if(sendto(server, &client_say, sizeof(client_say), 0, (struct sockaddr *) &tempClient, sizeof(tempClient)) == -1) {
                perror("E | Error sending say packet to local subscribers");
            } else {
                if(LOGGING > 3) { std::cout << "C | " << my_socket << " [send] TXT_SAY | Client: " << inet_ntoa(tempClient.sin_addr) << ":" << ntohs(tempClient.sin_port) << " | Channel: " << client_say.txt_channel << std::endl; }
            }
        }
    }
}
