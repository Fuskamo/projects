C_SOURCES = client.cpp
S_SOURCES = server.cpp
HEADERS = duckchat.h
C_OBJECTS = $(C_SOURCES:.c=.o)
S_OBJECTS = $(S_SOURCES:.c=.o)
LIBS = -lm

CC = g++
CFLAGS = -std=c++11 -g

%.o: %.c
	$(CC) -c $(CFLAGS) $<

all: client server

client: $(C_OBJECTS)
	$(CC) -o $@ $(C_OBJECTS)

tests: test-client

test-client: test-client.o client.o
	$(CC) -o $@ test-client.o client.o $(LIBS)

server: $(S_OBJECTS)
	$(CC) -o $@ $(S_OBJECTS)

tests: test-client

test-server: test-server.o server.o
	$(CC) -o $@ test-server.o server.o $(LIBS)

clean: 
	$(RM) client server