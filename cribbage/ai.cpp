/*
 ============================================================================
 Name        : ai.cpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <algorithm>
#include "ai.hpp"

namespace ai {
	//CREATE AN AI OBJECT OF TYPE PLAYER:
	AI::AI() : player::Player() {
		for(int i=1; i<14; i++) {
			this->probabilitySuit.push_back(card::Card(i, 5, i));
		}
	}

	//AI DESTRUCTOR
	AI::~AI() {
		//do we need this?
	} 

	//OVERRIDE: AI SELECTS A RANDOM SPOT TO CUT THE DECK
	 int AI::cutDeck() {
		std::cout << "the computer cut the deck this time" << std::endl;
		srand(time(NULL));
		int cut = rand() %27 + 3;
		return cut;
	}

	//OVERRIDE: AI SELECTS A CARD
	int AI::playCard(std::vector<card::Card>& playedCards, int tally) {
		int play = -1;
		if(this->hand.empty()) {
			std::cout << "the computer says \"go\"" <<std::endl;
			return 0;
		}
		//GENERATE A LIST OF PLAYABLE CARDS
		std::vector<int> eligible;
		for(int i=0; i<hand.size(); i++) {
			if(cardPlayable(this->hand[i].getValue(), tally)) {
				eligible.push_back(i);
			}
		}
		//NO CARDS ARE PLAYABLE
		if(eligible.empty()) {
			std::cout << "the computer says \"go\"" <<std::endl;
			return 0;
		}
		//ONLY ONE CARD IS PLAYABLE
		if(eligible.size() == 1) {
			play = eligible.front();

		//CHOOSE THE BEST OPTION
		} else {
			int maxPoints = 0;
			int currPoints = 0;
			for(int i=0; i<eligible.size(); i++) {
				playedCards.push_back(this->hand[eligible[i]]);
				currPoints = checkPegPoints(playedCards, tally+this->hand[eligible[i]].getValue());
				if(currPoints > maxPoints) {
					//OPTIMUM PLAY FOUND:
					maxPoints = currPoints;
					play = i;
				}
				playedCards.pop_back();
			}
			//NO OPTIMUM PLAY FOUND:
			if(play <= 0) {
				play = eligible.back();
			}
		}
		//PLAYS THE CARD
		std::cout << "the computer played : " << this->hand[play] << std::endl;
		int value = this->hand[play].getValue();
		this->played.push_back(this->hand[play]);
		playedCards.push_back(this->hand[play]);
		this->hand.erase(this->hand.begin()+play);
		return value;
	}

	//OVERRIDE: KEEPS THE LARGEST VALUE HAND, PLACES 2 CARDS IN CRIB
	void AI::addToCrib(std::vector<card::Card>& crib, int playersCrib) {
		std::vector<card::Card> maxHand;
		std::vector<card::Card> tempHand;
		int max = 0;
		int temp = 0;
		int i=0;
		int j=0;
		int k=0;
		int l=0;
		//CHECK EVERY COMBINATION OF CARDS FOR THE HIGHEST SET
		for(i=0; i<3; i++) {
			for(j=i+1; j<4; j++) {
				for(k=j+1; k<5; k++) {
					for(l=k+1; l<6; l++) {
						tempHand.push_back(this->hand[i]);
						tempHand.push_back(this->hand[j]);
						tempHand.push_back(this->hand[k]);
						tempHand.push_back(this->hand[l]);
						temp = checkPoints(tempHand);
						if(temp > max) {
							max = temp;
							maxHand.clear();
							for(int c=0; c<tempHand.size(); c++) {
								maxHand.push_back(tempHand[c]);
							}
						}
						tempHand.clear();
					}
				}
			}
		}
		int card1 = -1;
		int card2 = -1;
		//REMOVE THE TWO CARDS THAT DON'T CONTRIBUTE TO OUR HIGHEST SCORE
		if(!maxHand.empty()) {
			for(int d=0; d<this->hand.size(); d++) {
				std::vector<card::Card>::iterator it = find(maxHand.begin(), maxHand.end(), this->hand[d]);
				if (it != maxHand.end()) {
				} else {
    				if (card1 < 0) {
    					card1 = d;
    				} else {
    					card2 = d;
    				}
 				}
			}
		}
		//NO POINTS FOUND IN HAND, 4 STRATEGIES: 
		//THROW HIGH AND LOW CARD (minimizes points in the crib)
		//THROW RANDOM CARDS (we use this method)
		//THROW 2 HIGHEST (allows for better options to gain points by pegging)
		//THROW LOWEST PROBABILITY OF POINTS (guess what the flip card will be)
		else {
			srand(time(NULL));
			card1 = rand()%5;
			card2 = (card1+1)%5;
		}
		crib.push_back(this->hand[card1]);
		crib.push_back(this->hand[card2]);
		if(card1 > card2) {
			this->hand.erase(this->hand.begin()+card1);
			this->hand.erase(this->hand.begin()+card2);
		} else {
			this->hand.erase(this->hand.begin()+card2);
			this->hand.erase(this->hand.begin()+card1);
		}
	}

	//RETURNS THE POTENTIAL SCORE OF A HAND
	int AI::checkPoints(std::vector<card::Card>& hand) {
		int flush = checkFlush(hand);
		int pairs = checkPairs(hand);
		int fifteens = checkFifteens(hand);
		int runs = checkRuns(hand);
		return (flush + pairs + fifteens + runs);
	}

	//CHECKS THE HAND FOR A FLUSH
	int AI::checkFlush(std::vector<card::Card>& hand) {
		int flushCount = 0;
		for (int i = 0; i<hand.size(); i++) {
			if(hand[i].getSuit() == hand[0].getSuit()) {
				flushCount++;
			}
		}
		if(flushCount == 4) {
			return flushCount;
		}
		return 0;
	}

	//CHECKS FOR ANY AVAILABLE PEGGING POINTS
	int AI::checkPegPoints(std::vector<card::Card>& playedCards, int tally) {
		//CHECK 15'S/31'S
		int points = 0;
		if(tally == 15 || tally == 31) {
			points+=2;
		}

		//CHECK PAIRS:
		std::vector<card::Card> pairVector;
		for(int i=0; i<playedCards.size(); i++) {
			pairVector.push_back(playedCards[i]);
		}
		int rank = pairVector.back().getRank();
		pairVector.pop_back();
		int pairs = 0;
		while(!pairVector.empty()) {
			if(pairVector.back().getRank() == rank) {
				pairs++;
				pairVector.pop_back();
			} else {
				pairVector.clear();
			}
		}

		//CHECK RUNS:
		int maxRuns = 0;
		if(playedCards.size() > 2) {
			std::vector<card::Card> runVector;
			for(int i=0; i<playedCards.size(); i++) {
				runVector.push_back(playedCards[i]);
			}
			std::vector<int> bucketList(14, 0);
			bool checkRuns = true;
			card::Card lastCard;
			int maxIndex = 0;
			int minIndex = 14;
			int rank = 0;
			int runs = 0;
			int min = minIndex;
			int max = maxIndex;
			while(!runVector.empty() && checkRuns == true) {
				lastCard = runVector.back();
				rank = lastCard.getRank();
				if(maxIndex < rank) {
					maxIndex = rank;
				}
				if(minIndex > rank) {
					minIndex = rank;
				}
				bucketList[rank] = bucketList[rank]+1;
				//DOUBLES (no run):
				if(bucketList[rank] > 1) {
					checkRuns = false;
				}
				//CHECK FROM MIN TO MAX:
				min = minIndex;
				max = maxIndex;
				runs = 0;
				while(min<=max) {
					if(bucketList[min] == 1) {
						runs++;
					} else {
						runs = 0;
					}
					if(runs > maxRuns) {
						maxRuns = runs;
					}
					min++;
				}
				runVector.pop_back();
			}
			if(maxRuns < 3) {
				maxRuns = 0;
			}
		}
		return (points + pairs*2 + maxRuns);
	}
};