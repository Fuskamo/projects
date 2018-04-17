/*
 ============================================================================
 Name        : card.hpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <cstdlib>
#include <vector>
#include "card.hpp"

#ifndef DECK_H_
#define DECK_H_

namespace deck {

class Deck {
public:
	Deck();
	~Deck();

	//DECK MANIPULATION:
	void addCard(card::Card newCard) { this->gameDeck.push_back(newCard); }
	card::Card cutDeck(int);
	card::Card draw();
	void shuffle();
	int size() { return this->gameDeck.size(); }

private:
	//STORAGE:
	std::vector<card::Card> gameDeck;
};
};
#endif