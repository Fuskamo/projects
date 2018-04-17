/*
 ============================================================================
 Name        : main.cpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include "cribbage.hpp"

#define NUM_PLAYERS 2

int main(int argc, char** argv) {
	//CREATE BOARD OBJECT:
	cribbage::Cribbage cb;

	//CREATE PLAYERS:
	player::Player human = player::Player();
	ai::AI computer = ai::AI();
	computer.setPlayerId(0);
	human.setPlayerId(1);

	//GAME VARIABLES:
	std::vector<card::Card> playedCards;
	int rounds = NUM_PLAYERS*4;
	int theCount = 0;
	int cardPlayed = 0;
	int goCounter = 0;
	int turn = 0;
	int cScore = 0;
	int pScore = 0;
	int winner = -1;
	int newPoints = 0;
	//MAIN GAME LOOP:
	while(cScore < 120 && pScore < 120) {
		turn = cb.getDealer();
		cb.gameDeck.shuffle();
		cb.deal(computer, human);
		human.printHand(human.hand);
		human.addToCrib(cb.crib, turn);
		computer.addToCrib(cb.crib, turn);
		switch(turn) {
			case 0:
				cb.cutDeck(human.cutDeck());
				if(cb.getFaceup().getRank() == 11) {
					std::cout << "computer gets 2 points for turning up a jack!" << std::endl;
					cScore = computer.addPoints(2);
					cb.printBoard(computer, human);
					if(cScore >= 120 && !cb.isWinner()) { cb.setWinner(turn); }
				}
				break;
			case 1:
				cb.cutDeck(computer.cutDeck());
				if(cb.getFaceup().getRank() == 11) {
					std::cout << "you get 2 points for turning up a jack!" << std::endl;
					pScore = human.addPoints(2);
					cb.printBoard(computer, human);
					if(pScore >= 120 && !cb.isWinner()) { cb.setWinner(turn); }
				}
				break;
		}
		std::cout << std::endl;

		//PLAY PHASE:
		rounds = NUM_PLAYERS*4;
		theCount = 0;
		playedCards.clear();
		//PLAY UNTIL EVERYONE IS OUT OF CARDS IN THEIR HAND:
		while(rounds > 0) {
			//PLAY A CARD:
			if(turn != 0) {
				cardPlayed = human.playCard(playedCards, theCount); 
			}
			else { 
				cardPlayed = computer.playCard(playedCards, theCount); 
			}			
			//PLAYER WAS UNABLE TO PLAY (GO):
			if(cardPlayed == 0) {
				goCounter++;
				if(goCounter == NUM_PLAYERS) {
					switch(turn) {
						case 0:	//computers turn
							std::cout << "computer get's 1 point for a go" << std::endl;
							cScore = computer.addPoints(1);
							if(cScore >= 120 && !cb.isWinner()) { cb.setWinner(0); }
							break;
						case 1: //players turn
							std::cout << "you get 1 point for a go" << std::endl;
							pScore = human.addPoints(1);
							if(pScore >= 120 && !cb.isWinner()) { cb.setWinner(1); }
							break;
					}
					//RESET THE CARDS FOR NEXT ROUND
					cb.printBoard(computer, human);
					goCounter = 0;
					theCount = 0;
					playedCards.clear();
				}
			}
			//A CARD WAS ELIGIBLE AND WAS PLAYED:
			else {
				rounds--;
				goCounter = 0;
				theCount += playedCards.back().getValue();
				switch(turn) {
					case 0:
						//THIS IS THE LAST CARD:
						if(rounds == 0) {
							std::cout << "computer get's 1 point for the last card" << std::endl; 
							cScore = computer.addPoints(1);
						}
						//NOT THE LAST CARD:
						newPoints = computer.pegPoints(playedCards, theCount);
						if(newPoints>0) {
							cScore = computer.addPoints(newPoints);
							cb.printBoard(computer, human);
						}
						if(cScore >= 120 && !cb.isWinner()) { cb.setWinner(0); }
						break;
					case 1: 
						//THIS IS THE LAST CARD:
						if(rounds == 0) {
							std::cout << "you get 1 point for the last card" << std::endl; 
							pScore = human.addPoints(1); 
						} 
						//NOT THE LAST CARD:
						newPoints = human.pegPoints(playedCards, theCount);
						if(newPoints>0) {
							pScore = human.addPoints(newPoints);
							cb.printBoard(computer, human);
						}
						if(pScore >= 120 && !cb.isWinner()) { cb.setWinner(1); }
						break;
				}
				//IF WE REACH 31, RESET THE CARDS
				if(theCount == 31) {
					theCount = 0;
					playedCards.clear();
				}
			}

			//PRINT CARDS IN PLAY, COUNT:
			if(!playedCards.empty() ) { 
				std::cout << std::endl << "Cards in play: "; 
				human.printHand(playedCards); 
			}
			std::cout << "The count is at: " << theCount << std::endl;

			//NEXT PLAYER GETS A TURN:
			turn = (turn+1)%NUM_PLAYERS;
		}

		//SCORE HANDS, DEALER COUNTS LAST (DEALER GETS POINTS FOR THE CRIB):
		int countFirst = cb.getPone();
		std::cout << std::endl << "SCORE RESULTS:" << std::endl;
		for(int i=0; i<NUM_PLAYERS; i++) {
			switch(countFirst) {
				case 0: 
					newPoints = computer.scoreHand(cb.getFaceup());
					cScore = computer.addPoints(newPoints);
					std::cout << "the computer got " << newPoints << " points!" << std::endl;
					if(cb.getDealer() == 0) {
						newPoints = computer.scoreCrib(cb.crib, cb.getFaceup());
						cScore = computer.addPoints(newPoints);
						std::cout << "the computer got " << newPoints << " points in the crib!" << std::endl;
					}
					if(cScore >= 120 && !cb.isWinner()) { cb.setWinner(0); }
					break;
				case 1: 
					newPoints = human.scoreHand(cb.getFaceup());
					pScore = human.addPoints(newPoints);
					std::cout << "you got " << newPoints << " points!" << std::endl;
					if(cb.getDealer() == 1) {
						newPoints = human.scoreCrib(cb.crib, cb.getFaceup());
						pScore = human.addPoints(newPoints);
						std::cout << "you got " << newPoints << " points in the crib!" << std::endl;
					}
					if(pScore >= 120 && !cb.isWinner()) { cb.setWinner(1); }
					break;
			}
			countFirst = (countFirst+1) % NUM_PLAYERS;
		}
		cb.printBoard(computer, human);
		cb.switchDealer();
		cb.cleanup();
		computer.played.clear();
		human.played.clear();
	}
	//GAMEOVER:
	int humanScore = human.getFrontPeg();
	int computerScore = computer.getFrontPeg();
	switch(cb.getWinner()) {
		case 0:
			if(humanScore < 60) {
				std::cout << "You just got DOUBLE-SKUNKED by the computer!" << std::endl;
			} else if (humanScore < 90) { 
				std::cout << "You just got SKUNKED by the computer!" << std::endl;
			} else {
				std::cout << "The computer wins this round! Sucker!" << std::endl;
			}
			break;
		case 1:
			if(computerScore < 60) {
				std::cout << "You just DOUBLE-SKUNKED the computer!!" << std::endl;
			} else if (computerScore < 90) { 
				std::cout << "You just SKUNKED the computer!!" << std::endl;
			} else {
				std::cout << "You win!! Nice job!" << std::endl;
			}
			break;
	}
	return 0;
}
