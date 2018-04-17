/*
 ============================================================================
 Name        : player.ccp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include <iostream>
#include <algorithm>

#include "player.hpp"

namespace player {
	
	//CONSTRUCT A PLAYER:
	Player::Player() {
		this->fPeg = 0;
		this->bPeg = 0;
	} 

	//DESTRUCT THE PLAYER OBJECT:
	Player::~Player() { 
		//do we need a deconstructor??
	}

	//CUT THE DECK:
	int Player::cutDeck() {
		int cut;
		bool valid = false;
		while(!valid) {
			std::cout << "you cut the deck this round (3-28): " ;
			std::cin >> cut;
			while(std::cin.fail()) {
				std::cout << "please choose an INTEGER (3-28): ";
				std::cin.clear();
				std::cin.ignore();
				std::cin >> cut;
			}
			if(cut > 2 && cut < 29) {
				valid = true;
			}
		}
		return cut;
	}

	//PRINTS THE CONTENTS OF A PLAYERS HAND:
	void Player::printHand(std::vector<card::Card>& crib) {
		for(std::vector<card::Card>::iterator it = crib.begin(); it != crib.end(); ++it) {
			std::cout << *it;
		}
		std::cout << std::endl;
	}

	//SORTS A PLAYERS HAND BY RANK:
	void Player::sortHand() {
		std::sort(this->hand.begin(), this->hand.end());
	}

	//ADDS POINTS TO THE PLAYERS SCORE, RETURNS CURRENT SCORE
	int Player::addPoints(int points) {
		setBackPeg(getFrontPeg());
		setFrontPeg(getBackPeg() + points);
		if(getFrontPeg() >= 120) {
			setFrontPeg(120);
		}
		return this->getFrontPeg();
	}

	//ENSURES THE CARD CAN BE PLAYED:
	bool Player::cardPlayable(int cardValue, int runningTotal) {
		if(runningTotal + cardValue <32) {
			return true;
		}
		return false;
	}

	//ALLOWS THE PLAYER TO SELECT A CARD TO PLAY:
	int Player::playCard(std::vector<card::Card>& playedCards, int tally) {
		if(this->hand.empty()) {
			std::cout << "you are out of cards! That's a go" <<std::endl;
			return 0;
		}
		int play = 0;
		std::vector<int> eligible;
		for(int i=0; i<hand.size(); i++) {
			if(cardPlayable(hand[i].getValue(), tally)) {
				eligible.push_back(i+1);
			}
		}
		this->printHand(this->hand);

		//PRINT OUT CARD NUMBERS:
		for(int i=0; i<hand.size(); i++) {
			std::cout << " #" << i+1 << "  ";
			if(hand[i].getRank() == 10) {
				std::cout << " ";
			}
		}

		//INPUT LOOP:
		bool valid = false;
		while(!valid) {
			std::cout  << std::endl << "play a card or 0 to \"go\": ";
			std::cin >> play;
			while(std::cin.fail()) {
				std::cout  << std::endl << "please choose an eligible card (0 to \"go\"): ";
				std::cin.clear();
				std::cin.ignore();
				std::cin >> play;
			}

			//PLAYER PASSED AND NO ELIGIBLE CARDS:
			if(play == 0) {
				if(eligible.empty()) {
					return 0;
				//PLAYER PASSED BUT ELIGIBLE CARDS IN HAND:
				} else {
					std::cout  << std::endl << "you must play an eligible card if you have one: ";	
				}
			}
			//ENSURE THE SELECTION REPRESENTS A CARD IN HAND:
			else if(play <= hand.size()) {
				if(cardPlayable(hand[play-1].getValue(), tally)) {
					valid = true;
				} 
			}
		}
		play--;
		std::cout << "you played " << hand[play] << std::endl;
		int value = this->hand[play].getValue(); 	//get the value of the card played
		this->played.push_back(this->hand[play]);	//add to players played cards
		playedCards.push_back(this->hand[play]);	//add to all players current cards in play
		this->hand.erase(this->hand.begin()+play);	//remove the card from players hand
		return value;
	}

	//ALLOWS THE PLAYER TO CHOOSE TWO CARDS FOR THE CRIB:
	void Player::addToCrib(std::vector<card::Card>& crib, int playersCrib) {
		for(int i=0; i<hand.size(); i++) {
			std::cout << " #" << i+1 << "  ";
			if(hand[i].getRank() == 10) {
				std::cout << " ";
			}
		}
		std::cout << std::endl;
		
		int crib1 = 0;
		int crib2 = 0;
		bool valid = false;
		while(!valid) {
			switch(playersCrib) {
				case 1:
				std::cout << "pick 2 cards for YOUR crib (1-6): ";
				break;
				case 3:
				std::cout << "pick 2 cards for your TEAMMATES crib (1-6): ";
				break;
				default:
				std::cout << "pick 2 cards for your OPPONENTS crib (1-6): ";
				break;
			}
			std::cin >> crib1 >> crib2;
			while(std::cin.fail()) {
				std::cout << "Please choose an INTEGER pair between 1 and 6: ";
				std::cin.clear();
				std::cin.ignore();
				std::cin >> crib1 >> crib2;
			}
			if(crib1 > 0 && crib2 > 0 && crib1 < 7 && crib2 < 7 && crib1 != crib2) {
				valid = true;
			}
		}
		crib1--;
		crib2--;
		std::cout << "you put these cards in the crib: " << this->hand[crib1] << "and " << this->hand[crib2] << std::endl;
		crib.push_back(this->hand[crib1]);
		crib.push_back(this->hand[crib2]);
		if(crib1 > crib2) {
			this->hand.erase(hand.begin()+crib1);
			this->hand.erase(hand.begin()+crib2);	
		} else {
			this->hand.erase(hand.begin()+crib2);
			this->hand.erase(hand.begin()+crib1);
		}
	}

	//ADDS UP THE NUMBER OF POINTS RECIEVED DURING PLAY PHASE (PEGGING):
	int Player::pegPoints(std::vector<card::Card>& playedCards, int tally) {
		//CALCULATE 15'S/31'S
		int total = 0;
		if(tally == 15 || tally == 31) {
			total+=2;
			std::cout << "[-!-] " << tally << " for 2 points [-!-]" << std::endl;
		}

		//CALCULATE PAIRS:
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
		switch(pairs) {
			case 1: 
			std::cout << "[-!-] pair for 2 points [-!-]" << std::endl;
			total +=2;
			break;
			case 2: 
			std::cout << "[-!-] three pair for 6 points [-!-]" << std::endl;
			total +=6;
			break;
			case 3:
			std::cout << "[-!-] four pair for 12 points [-!-]" << std::endl;
			total +=12;
			break;
			default:
				//no pairs
			break;
		}

		//CALCULATE RUNS:
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
			} else {
				std::cout << "[-!-] run for " << maxRuns << " points [-!-]" << std::endl;
			}
		}
		return total + maxRuns;
	}


	//RETURNS THE TOTAL NUMBER OF POINTS FOR A HAND:
	int Player::scoreHand(card::Card faceup) {
		std::vector<card::Card> scoreCards = this->played;		//create a new vector for our cards
		int flush = checkFlush(scoreCards, faceup);				//check for a flush
		int knobs = checkKnobs(scoreCards, faceup);				//check for knobs
		scoreCards.push_back(faceup);							//add the facecard to the deck
		int pairs = checkPairs(scoreCards);						//check for pairs
		int fifteens = checkFifteens(scoreCards);				//check for any 15's
		int runs = checkRuns(scoreCards);						//check for any runs	
		scoreCards.pop_back();	
		int totalScore = flush + knobs + pairs + fifteens + runs;
		if(this->playerId == 0) {
			std::cout << "COMPUTER: -- " << faceup << std::endl;
		} else {
			std::cout << "PLAYER: -- " << faceup << std::endl;
		}
		printHand(played);
		std::cout << "pairs: " << pairs  << std::endl 
		<< "15s:   " << fifteens  << std::endl 
		<< "flush: " << flush << std::endl 
		<< "runs:  " << runs << std::endl 
		<< "knobs: " << knobs  << std::endl
		<< "TOTAL: " << totalScore << std::endl;
		return totalScore;										//return the total score
	}

	//RETURNS THE TOTAL NUMBER OF POINTS IN THE CRIB:
	int Player::scoreCrib(std::vector<card::Card>& crib, card::Card faceup) {
		int flush = checkFlush(crib, faceup);
		if(flush != 5) {
			flush = 0;
		}
		int knobs = checkKnobs(crib, faceup);
		crib.push_back(faceup); //add the faceup card to the hand for scoring
		int pairs = checkPairs(crib);
		int fifteens = checkFifteens(crib);
		int runs = checkRuns(crib);
		int totalScore = flush + knobs + pairs + fifteens + runs;
		crib.pop_back(); //remove the faceup card from the crib
		if(this->playerId == 0) {
			std::cout << "COMPUTER CRIB: -- " << faceup << std::endl;
			printHand(crib);
		} else {
			std::cout << "PLAYER CRIB: -- " << faceup << std::endl;
			printHand(crib);
		}
		std::cout << "pairs: " << pairs  << std::endl 
		<< "15s:   " << fifteens  << std::endl 
		<< "flush: "  << flush << std::endl 
		<< "runs:  " << runs << std::endl 
		<< "knobs: " << knobs  << std::endl
		<< "TOTAL: " << totalScore << std::endl;
		return totalScore;
	}

	//CHECKS THE HAND FOR A FLUSH (4 CARDS OF THE SAME SUIT + TURNUP CARD)
	int Player::checkFlush(std::vector<card::Card>& hand, card::Card faceup) {
		int handSize = hand.size();
		int flushCount = 0;
		for (int i = 0; i<handSize; i++) {
			if(hand[i].getSuit() == hand[0].getSuit()) {
				flushCount++;
			}
		}
		if(flushCount == 4) {
			if(hand[0].getSuit() == faceup.getSuit()) {
				flushCount++;
			}
			return flushCount;
		}
		return 0;
	}

	//CHECKS FOR KNOBS (PLAYER HAS A JACK OF THE SAME SUIT AS THE TURNUP CARD)
	int Player::checkKnobs(std::vector<card::Card>& hand, card::Card faceup) {
		for(int i = 0; i<hand.size(); i++) {
			if(hand[i].getRank() == 11 && hand[i].getSuit() == faceup.getSuit()) {
				return 1;
			}
		}
		return 0;
	}

	//CHECKS THE HAND FOR PAIRS (CARDS OF THE SAME RANK)
	int Player::checkPairs(std::vector<card::Card>& hand) {
		int pairCounter = 0;
		for(int i=0; i<hand.size(); i++) {
			for(int j=i+1; j<hand.size()-1; j++) {
				if(hand[i].getRank() == hand[j].getRank()) {
					pairCounter = pairCounter + 1;
				}
			}
		}
		return pairCounter*2;
	}

	//CHECKS THE HAND FOR CARDS WHOSE VALUE ADDS UP TO 15
	int Player::checkFifteens(std::vector<card::Card>& hand) {
		int handSize = hand.size();
		//TWO CARDS:
		int twoCardFifteens = 0;
		for(int i=0; i<handSize; i++) {
			for(int j=i+1; j<handSize; j++) {
				if((hand[i].getValue() + hand[j].getValue()) == 15) {
					twoCardFifteens++;
				}
			}
		}
		//THREE CARDS:
		int threeCardFifteens = 0;
		for(int i=0; i<handSize; i++) {
			for(int j=i+1; j<handSize; j++) {
				for(int k=j+1; k<handSize; k++) {
					if((hand[i].getValue() + hand[j].getValue() + hand[k].getValue()) == 15) {
						threeCardFifteens++;
					}
				}
			}
		}
		//FOUR CARDS:
		int fourCardFifteens = 0;
		for(int i=0; i<handSize; i++) {
			for(int j=i+1; j<handSize; j++) {
				for(int k=j+1; k<handSize; k++) {
					for(int l=k+1; l<handSize; l++) {
						if((hand[i].getValue() + hand[j].getValue() + hand[k].getValue() + hand[l].getValue()) == 15) {
							fourCardFifteens++;
						}
					}
				}
			}
		}
		//FIVE CARDS:
		int fiveCardTotal = 0;
		int fiveCardFifteens = 0;
		for(int i=0; i<handSize; i++) {
			fiveCardTotal += hand[i].getValue();
		}
		if(fiveCardTotal == 15) {
			fiveCardFifteens++;
		}
		return (twoCardFifteens + threeCardFifteens + fourCardFifteens + fiveCardFifteens)*2;
	}

	//CHECKS THE HAND FOR RUNS (3 OR MORE CARDS IN A CONSECUTIVE SEQUENCE; AKA: A STRAIGHT):
	int Player::checkRuns(std::vector<card::Card>& hand) {
		std::vector<int> bucketList(14, 0);
		int handSize = hand.size();
		for(int i=0; i<handSize; i++) {
			bucketList[hand[i].getRank()] = bucketList[hand[i].getRank()]+1;
		}
		int runIndex = 0;
		int runCount = 1;
		int biggestRun = 0;
		for(int j=0; j<bucketList.size(); j++) {
			if(bucketList[j] == 0) {
				runCount = 0;
			}
			else if(bucketList[j] > 0) {
				runCount++;
				if(runCount > biggestRun) {
					biggestRun = runCount;
					runIndex = j;
				}
			}
		}
		int checks = biggestRun;
		if(biggestRun > 2) {
			while(checks > 0) { 
				//int mult = bucketList[runIndex];
				biggestRun = bucketList[runIndex] * biggestRun;
				runIndex--;
				checks--;
			}
			return biggestRun;
		}
		return 0;
	}


};
