$(document).ready(function (){       

	var RANKS = {
					'Ace' : [1,0],
					'Two' : [2,1],
					'Three' : [3,2],
					'Four' : [4,3],
					'Five' : [5,4],
					'Six' : [6,5],
					'Seven' : [7,6],
					'Eight' : [8,7],
					'Nine' : [9,8],
					'Ten' : [10,9],
					'Jack' : [10,10],
					'Queen' : [10,11],
					'King' : [10,12]
				};

	var SUITS = ['Clubs','Diamonds','Hearts','Spades'];


	var CARD_SIZE_MOD = 0.75
	var CARD_IMG = '../static/images/cards_75.png'
	var CARD_SIZE = [123*CARD_SIZE_MOD,79*CARD_SIZE_MOD]

	function Card(rank, suit) {
		this.rank = rank;
		this.suit = suit;
		this.value = RANKS[rank][0];
		// top, right, bottom, left
		this.card_pos = [CARD_SIZE[0]*SUITS.indexOf(suit), CARD_SIZE[1]*RANKS[rank][1]];
		this.card_img = "<div class='card' style='height:"+CARD_SIZE[0]+"px; width:"+CARD_SIZE[1]+"px; display:inline-block; background: url("+CARD_IMG+")"+-this.card_pos[1]+"px "+-this.card_pos[0]+"px no-repeat;'></div>";
		this.toHtml = function(hidden) {
			// not a prototype method because cards drawn depend on game state
			if (!hidden) {
				return (this.card_img);
			} else {
				return ("<div class='card' style='height:"+CARD_SIZE[0]+"px; width:"+CARD_SIZE[1]+"px; display:inline-block; background: url("+CARD_IMG+") 0px "+-(CARD_SIZE[0]*4)+"px no-repeat;'></div>");
			}
		}
	}

	function Deck(){
		this.cards = []
	}

	Deck.prototype.shuffle = function() {
		// algorithm taken from 
		// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
		var j,x,i;
			for (i = this.cards.length; i; i--) {
				j = Math.floor(Math.random() * i);
				x = this.cards[i-1];
				this.cards[i-1] = this.cards[j];
				this.cards[j] = x;

			}
	}

	Deck.prototype.reset = function() {
		while (this.cards.length < 52) {
			for (suit in SUITS){
				for (rank in RANKS){
						this.cards.push(new Card(rank, SUITS[suit]));
				}
			}
		}
	}

	Deck.prototype.deal = function() {
		if (this.cards.length > 0) { return this.cards.pop(); }
		this.reset();
		this.shuffle();
		return this.cards.pop();
	}

	function Player(name) {
		this.name = name;
		this.hand = [];
		this.handValue = function(){
			// not a prototype method because hand values are scored differently in card games
			var sum = 0;
			var cardValue;
			var aceInHand = false;
			for (idx in this.hand) {
				cardValue = this.hand[idx].value
				sum += cardValue
				if (cardValue == 1) {
					aceInHand = true;
				}
			}
			if (aceInHand && sum + 10 < 22) {
				sum += 10;
			}
			return sum;
		}

		this.drawHand = function() {
			// not a prototype method because cards drawn depend on game state
			var el = document.getElementById(this.name);
			el.innerHTML = ""
			for (idx in this.hand) {
				if (idx==0 && this.name == 'dealer' && !game.gameOver) {
					el.innerHTML+=this.hand[idx].toHtml(!game.gameOver);
				}
				else {
					el.innerHTML+=this.hand[idx].toHtml();
				}
			}
			el = document.getElementById(this.name+"_score");
			if (!game.gameOver && this.name == 'dealer') {
				el.innerHTML = "<h3>"+this.name+"'s score: ??</h3>";
			}else {
				el.innerHTML="<h3>"+this.name+" score: "+this.handValue()+"</h3>";
			}
		}
	} //end of player object

	Player.prototype.take = function() {
		this.hand.push(game.deck.deal());
	}

	Player.prototype.discard = function() {
		var discard = false;
			for (var i=0; i < this.hand.length-1; i++) {
				if (this.hand[i] === card) {
					this.hand[i] = this.hand[i+1];
					discard = true;
				}
			}
			if (discard) {
				this.hand.pop();
			}
	}

	function BlackJack() {
		this.deck = new Deck();
		this.dealer = new Player('dealer');
		this.player = new Player('Your');
		this.player_record = {wins: parseInt($('#record').attr('wins')),losses: parseInt($('#record').attr('wins'))};
		this.newGame = function(){
			// not a prototype method because HTML element names could change
			this.gameOver = false;
			this.dealer.hand = [];
			this.player.hand = [];
			var el = document.getElementById('prompts');
			el.innerHTML = ""
			$('#new_game').css("display", "none");
			$('#hit').css("display", "inline-block");
			$('#stand').css("display", "inline-block");	
			for (var i = 0; i < 2; i++) {
				this.player.take();
				this.dealer.take();
			}
			this.dealer.drawHand();
			this.player.drawHand();
			this.checkWinner();

		}
		var self = this;
		$(document).on('click', '#hit', function(){
			if (!self.gameOver) {
				self.player.take();
				self.player.drawHand();
				self.checkWinner();
			}
		});
		$(document).on('click', '#stand', function(){
			self.player_stand();

		});

		$(document).on('click', '#new_game', function(){
			self.newGame();

		});

		this.player_stand = function(){
			// not a prototype method. Tied to game state?
			if (!this.gameOver){
				this.gameOver = true;
				while (this.dealer.handValue() < 17) {
					this.dealer.take();
					
				}
				this.dealer.drawHand();
				this.checkWinner();
			}
		}

		this.checkWinner = function () {
			// not a prototype method because HTML element names could change
			var dealer_score = this.dealer.handValue();
			var player_score = this.player.handValue();
			var score_dif = dealer_score - player_score
			var el = document.getElementById('prompts');

			if (!this.gameOver) {
				if (player_score > 21) {
					this.player_record.losses += 1
					el.innerHTML = "<h2>You Busted!!</h2>";
					this.gameOver = true;
				} else if (player_score == 21 && this.player.hand.length == 2) {
					this.player_record.wins += 1
					el.innerHTML = "<h2>BLACKJACK!!!</h2>"
					this.gameOver = true;
				}
			} else {
				if (dealer_score > 21) {
					this.player_record.wins += 1
					el.innerHTML = "<h3>Dealer Busted! You Win!!!</h3>"
					this.gameOver = true;
				}
				else if (score_dif > 0) {
					this.player_record.losses += 1
					el.innerHTML = "<h2>Dealer Wins</h2>"
					this.gameOver = true;
				}
				else if (score_dif < 0) {
					this.player_record.wins += 1
					el.innerHTML = "<h2>You Win!!!</h2>"
					this.gameOver = true;
				}
				else {
					el.innerHTML = "<h2>Pushed...BORING...</h2>"
					this.gameOver = true;
				}
			}

			if (this.gameOver) { 
				$('#new_game').css("display", "inline-block");
				$('#hit').css("display", "none");
				$('#stand').css("display", "none");
				socket.emit('game_over', {_id: $('#new_game').attr('data'),  score:player_score, dealer:dealer_score, record:this.player_record});

			}
		}	
	}
	var game = new BlackJack();
});
// setTimeout(game.newGame(), 1000);