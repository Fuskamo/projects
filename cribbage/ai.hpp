/*
 ============================================================================
 Name        : ai.hpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include "player.hpp"

#ifndef AI_H_
#define AI_H_

namespace ai {

class AI : public player::Player {

public:
	AI();
	~AI();

	//OVERRIDE:
	int cutDeck();
	int playCard(std::vector<card::Card>&, int);
	void addToCrib(std::vector<card::Card>&, int);
	
	//AI CODE:
	int checkPoints(std::vector<card::Card>&);
	
private:
	//AI CODE:
	int checkFlush(std::vector<card::Card>&);
	int checkPegPoints(std::vector<card::Card>&, int);
	
	//NOT ENOUGH TIME TO IMPLEMENT =[
	std::vector<card::Card> probabilitySuit;
};
};
#endif