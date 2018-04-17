/*
 ============================================================================
 Name        : card.cpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <string>
#include "card.hpp"

namespace card {
	//CARD CONSTRUCTOR:
	Card::Card(int r, int s, int v) {
		this->rank = r;
		this->suit = s;
		if(v > 10) {
			this->value = 10;	
		} else {
			this->value = v;
		}
		
	} 

	//CARD DESTRUCTOR:
	Card::~Card() { 
		//do we need a destructor??
	}

	//PRINT A CARD: |RS|
	//R=Rank, S=Suit
	std::ostream& operator<<(std::ostream &os, const Card& c) {
		bool number = false;
		std::string r;
		std::string s;
		int rank = c.rank;
		int suit = c.suit;
		switch(rank) {
			case 1:
				r = 'A';
				break;
			case 11:
				r = 'J';
				break;
			case 12:
				r = 'Q';
				break;
			case 13:
				r = 'K';
				break;
			default:
				number = true;
				break;
		}
		switch(suit) {
			case 0:
				s = "S";
				break;
			case 1:
				s = "C";
				break;
			case 2:
				s = "H";
				break;
			case 3:
				s = "D";
				break;
			default:
				s = "invalid suit";
		}
		if(number) {
			os << "|" << rank << s << "| ";
		} else {
			os << "|" << r << s << "| ";
		}
		return os;
	}
}