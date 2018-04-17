SOURCES = deck.cpp card.cpp cribbage.cpp player.cpp ai.cpp main.cpp
HEADERS = dech.hpp card.hpp cribbage.hpp player.hpp ai.hpp
OBJECTS = $(SOURCES:.c=.o)
LIBS = -lm

CC = g++
CFLAGS = -std=c++11 -g

%.o: %.c
	$(CC) -c $(CFLAGS) $<

main: $(OBJECTS)
	$(CC) -o $@ $(OBJECTS)

tests: test-main

test-card: test-card.o card.o
	$(CC) -o $@ test-card.o card.o $(LIBS)

test-deck: test-deck.o deck.o
	$(CC) -o $@ test-deck.o deck.o $(LIBS)

test-player: test-player.o player.o
	$(CC) -o $@ test-player.o player.o $(LIBS)

test-ai: test-ai.o ai.o
	$(CC) -o $@ test-ai.o ai.o $(LIBS)

test-cribbage: test-cribbage.o cribbage.o
	$(CC) -o $@ test-cribbage.o cribbage.o $(LIBS)

test-main: $(OBJECTS)
	$(CC) -o $@ $(OBJECTS) $(LIBS)

clean: 
	$(RM) main