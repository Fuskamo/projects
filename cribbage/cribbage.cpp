/*
 ============================================================================
 Name        : cribbage.cpp
 Author      : David Jensen
 Class       : CIS 330, WIN17
 Description : Final Project: Cribbage
 ============================================================================
 */

#include "cribbage.hpp"

#define TOTAL_SCORE 121
#define NUM_PLAYERS 2
#define NUM_TEAMS 2
#define MAX_CARDS 12

namespace cribbage {

	//CRIBBAGE CONSTRUCTOR: (DECK, PLAYERS)
	Cribbage::Cribbage() {
		this->dealer = 1;				//player deals first
		this->winner = -1;				//no winners yet
		this->gameover = false;			//game is not over

		//ALLOCATE:
		this->gameBoard = new int *[NUM_TEAMS];
		for(int i=0; i<NUM_TEAMS; i++) {
			this->gameBoard[i] = new int[TOTAL_SCORE];
		}

		//INITIALIZE:
		for(int j=0; j<NUM_TEAMS; j++) {
			for(int k = 0; k<TOTAL_SCORE; k++) {
				this->gameBoard[j][k] = 0;
			}
		}
	}

	//DESTRUCT THE GAME BOARD:
	Cribbage::~Cribbage() {
		for(int i=0; i<NUM_TEAMS; i++) {
			delete this->gameBoard[i];
		}
		delete this->gameBoard;
	}

	//PRINT THE GAMEBOARD:
	void Cribbage::printBoard(player::Player& computer, player::Player& human) {
		removePegs();
		setPegs(computer, human);
		for(int i=0; i<NUM_TEAMS; i++) {
			if(i == 0) { std::cout << " AI - |"; }
			else { std::cout << "YOU - |"; }
			for(int j=0; j<TOTAL_SCORE; j++) {
				if(this->gameBoard[i][j] != 0) { std::cout << "X"; }
				else { 	std::cout << "-"; }
				if((j)%5 == 0) { std::cout << "|"; }
			}
			if(i == 0) { std::cout << " AI - " << computer.getFrontPeg() << std::endl; } 
			else { std::cout << " YOU- " << human.getFrontPeg() << std::endl; }
		}
	}

	//SET THE WINNER:
	void Cribbage::setWinner(int ourWinner) {
		this->winner = ourWinner;
		this->gameover = true;
	}

	//SWITCH DEALERS (dealer gets crib points):
	void Cribbage::switchDealer() { 
		int temp = getDealer();
		this->dealer = getPone();
		this->pone = temp;
	}

	//CLEARS THE PEGS FROM THE BOARD:
	void Cribbage::removePegs() {
		for(int i=0; i<NUM_TEAMS; i++) {
			for(int j=0; j<TOTAL_SCORE; j++) {
				this->gameBoard[i][j] = 0;
			}
		}
	}

	//PLACES THE PEGS ON THE BOARD:
	void Cribbage::setPegs(player::Player& computer, player::Player& human) {
		this->gameBoard[0][computer.getFrontPeg()] = 1;
		this->gameBoard[0][computer.getBackPeg()] = 1;
		if(human.getFrontPeg() >= TOTAL_SCORE || computer.getFrontPeg() >= TOTAL_SCORE) {
			std::cout << "We have a winner!" << std::endl;
			std::cout << "FINAL SCORE: " << std::endl << "Computer: " << computer.getFrontPeg() << std::endl << "You: " << human.getFrontPeg() << std::endl;
		} else {
			this->gameBoard[1][human.getFrontPeg()] = 1;
			this->gameBoard[1][human.getBackPeg()] = 1;
		}	
	}

	//DEAL THE CARDS:
	void Cribbage::deal(player::Player& computer, player::Player& human) {
		int count = 0;
		int first = getPone(); 	//dealer does not deal himself first
		while(count < MAX_CARDS) {
			card::Card drawCard = this->gameDeck.draw();
			switch(first) {
				case 0: 
					computer.hand.push_back(drawCard);
					break;
				case 1:
					human.hand.push_back(drawCard);
					break;
			}
			cardsInPlay.push_back(drawCard);
			first = (first + 1) % NUM_PLAYERS;
			count++;											
		}
		computer.sortHand();
		human.sortHand();
	}

	//CUTS THE DECK:
	void Cribbage::cutDeck(int cut) {
		this->faceup = this->gameDeck.cutDeck(cut);
		std::cout << "card flipped is " << this->faceup << std::endl;
	}

	//PREPARES FOR THE NEXT HAND: (adds all cardsInPlay to the deck, erases the crib)
	void Cribbage::cleanup() {
		for(std::vector<card::Card>::iterator it = cardsInPlay.begin(); it != cardsInPlay.end(); ++it) {
			gameDeck.addCard(*it);
		}
		crib.clear();
		card::Card blankCard;
		faceup = blankCard;
		std::cout << std::endl << std::endl;
		cardsInPlay.clear();
	}

};