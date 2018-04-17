/*
 ============================================================================
 Name        : card.hpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <iostream>

#ifndef CARD_H_
#define CARD_H_

namespace card {

class Card {
public:
	Card() {};
	Card(int, int, int);
	~Card();

	Card& operator=(const Card& c) {
		rank = c.rank;
		value = c.value;
		suit = c.suit;
		return *this;
	};
	
	//OPERATOR OVERRIDES:
	friend bool operator<(const Card &c1, const Card &c2) { return c1.rank < c2.rank; };
	friend bool operator==(const Card &c1, const Card &c2) { return c1.rank == c2.rank; };
	friend bool operator!=(const Card &c1, const Card &c2) { return !(c1==c2); };
	friend int operator+(const Card &c1, const Card &c2) { return c1.value + c2.value; };
	friend std::ostream & operator<<(std::ostream &os, const Card& c);
	
	//GETTERS
	int getRank() { return this->rank; }
	int getSuit() { return this->suit; }
	int getValue() { return this->value; }
private:
	int rank;				//numeric value A, 2-10, J, Q, K (1-13)
	int suit;				//diamonds, hearts, clubs, spades (D, H, C, S)
	int value;				//numeric value of the card (points it is worth)
};
};
#endif