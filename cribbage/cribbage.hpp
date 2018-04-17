/*
 ============================================================================
 Name        : cribbage.hpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include "deck.hpp"
#include "ai.hpp"

#ifndef CRIBBAGE_H_
#define CRIBBAGE_H_

namespace cribbage {

class Cribbage {
public:
	Cribbage();
	~Cribbage();

	//GETTERS:
	card::Card getFaceup() { return this->faceup; }
	int getDealer() { return this->dealer; }
	int getPone() { return this->pone; }
	void switchDealer();

	//SETTERS:
	void setDealer(int d) { this->dealer = d; }
	void setWinner(int);

	//WINNING:
	int isWinner() { return this->gameover; }
	int getWinner() { return this->winner; }
	
	//GAMEPLAY:
	void printBoard(player::Player&, player::Player&);
	void printCrib();
	void scoreCrib();
	void cleanup();
	
	//PLAYERS:
	void removePegs();
	void setPegs(player::Player&, player::Player&);
	void deal(player::Player&, player::Player&);
	void cutDeck(int);

	//STORAGE:
	std::vector<card::Card> cardsInPlay;	//cards in play (player hands, crib)
	std::vector<card::Card> crib;			//vector which stores the crib
	deck::Deck gameDeck; 					//card deck used for the game

private:
	//STORAGE:
	int ** gameBoard;
	card::Card faceup;

	//GAMEPLAY:
	bool gameover;
	int pone;
	int dealer;
	int winner;
};
};
#endif