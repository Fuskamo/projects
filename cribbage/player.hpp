/*
 ============================================================================
 Name        : player.hpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <vector>
#include "card.hpp"

#ifndef PLAYER_H_
#define PLAYER_H_

namespace player {

class Player {
public:
	Player();
	~Player();

	//OVERRIDE:
	virtual void addToCrib(std::vector<card::Card>&, int);
	virtual int playCard(std::vector<card::Card>&, int);
	virtual int cutDeck();

	//NO OVERRIDE:
	void sortHand();
	bool cardPlayable(int, int);
	
	//PRINTING:	
	void printHand(std::vector<card::Card>&);
	
	//SCORING:
	int scoreCrib(std::vector<card::Card>&, card::Card);
	int pegPoints(std::vector<card::Card>&, int);
	int scoreHand(card::Card);
	int addPoints(int);

	//STORAGE:
	std::vector<card::Card> played;
	std::vector<card::Card> hand;
	
	//SETTERS:
	void setPlayerId(int p) { this->playerId = p; }
	void setFrontPeg(int p) { this->fPeg = p; }
	void setBackPeg(int p) { this->bPeg = p; }

	//GETTERS:
	int getPlayerId() { return this->playerId; }
	int getFrontPeg() { return this->fPeg; }
	int getBackPeg() { return this->bPeg; }

	//SCORING:
	virtual int checkFlush(std::vector<card::Card>&, card::Card);
	int checkKnobs(std::vector<card::Card>&, card::Card);
	int checkFifteens(std::vector<card::Card>&);
	int checkPairs(std::vector<card::Card>&);
	int checkRuns(std::vector<card::Card>&);
private:
	//PEGS:
	int fPeg;
	int bPeg;

	//MISC:	
	int playerId;

};
};
#endif