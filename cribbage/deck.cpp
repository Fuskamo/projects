/*
 ============================================================================
 Name        : deck.cpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <algorithm>
#include "deck.hpp"

#define DECKSIZE 52
#define SUITS 4
#define RANKS 13

namespace deck {
	//DECK CONSTRUCTOR:
	Deck::Deck() { 
		int count = 0;
		for(int i=0; i<SUITS; i++) {
			for(int j=1; j<=RANKS; j++) {
				this->gameDeck.push_back(card::Card(j, i, j));
				count++;
			}
		}
	}

	//SHUFFLE THE DECK:
	void Deck::shuffle() {
		srand(time(NULL));
		int seed = rand() %10;
		for (int i=0; i<seed; ++i) {
			std::random_shuffle(this->gameDeck.begin(), this->gameDeck.end());
		}
	}

	//DECK DESTRUCTOR:
	Deck::~Deck() { 
		std::cout << "Time to play " << DECKSIZE << "-card pickup!" << std::endl;
	}

	//DRAW THE TOP CARD OF THE DECK
	card::Card Deck::draw() {
		card::Card firstCard;
		firstCard = this->gameDeck.front();
		this->gameDeck.erase(this->gameDeck.begin());
		return firstCard;
	}

	//CUT THE DECK
	card::Card Deck::cutDeck(int cut) {
		return this->gameDeck.at(cut+1);
	}


}
