import { Deck, Players, Card, isSet, isSameOrDiff} from "../src/javascripts/set-model";

describe("Test Card class", function () {
  
  it("Test constructor", function() {
    const card = new Card(1, "rectangle", "solid", "red");
    expect(card.shapeNum).toEqual(1);
    expect(card.shape).toEqual("rectangle");
    expect(card.shading).toEqual("solid");
    expect(card.color).toEqual("red");
  });
});
describe("Test Deck class", function() {
  const shapeNums = [1, 2, 3];
  const shapes = ['rectangle', 'diamond', 'squiggle'];
  const shadings = ['solid', 'striped', 'empty'];
  const colors = ['red', 'blue', 'green'];

  let deck = new Deck(shapeNums, shapes, shadings, colors);

  it("Test test_deck size", function() {
    expect(deck.deal_pile.length).toEqual(81);
  });
  it("Test deal by dealing 21 cards", function() {
    deck.deal(21);
    expect(deck.deal_pile.length).toEqual(60);
    expect(deck.dealt.length).toEqual(21);
  });
  it("Make sure that setExists returns a valid set from the dealt pile", function() {
    let set = deck.setExists();
    let check = isSet(set);
    expect(set.length).toEqual(3);
    expect(check).toBe(true);
  });
  it("Test pick by discarding first 3 cards from dealt pile", function() {
    const indices=[0,1,2];
    deck.pick(indices);
    expect(deck.deal_pile.length).toEqual(60);
    expect(deck.dealt.length).toEqual(18);
    expect(deck.discarded.length).toEqual(3);
  });
  it("Test shuffle and make sure deal_pile is reset", function() {
    deck.shuffle();
    expect(deck.deal_pile.length).toEqual(81);
    expect(deck.dealt.length).toEqual(0);
    expect(deck.discarded.length).toEqual(0);
  });  
  it("Make sure that setExists returns an empty array because there should be no set", function() {
    deck.deal(3);
    let set = deck.setExists();
    expect(set.length).toEqual(0);
  });

});

describe("Test isSet function", function(){
  it("Test three cards that are a set", function(){
    let card_one = new Card(1, "rectangle","solid","red");
    let card_two = new Card(1, "rectangle","solid","blue");
    let card_three = new Card(1, "rectangle","solid","green");
    let choices_one = [card_one, card_two, card_three];
    expect(isSet(choices_one)).toBe(true);
  })
  it("Test three cards that are not a set", function(){
    let card_one = new Card(1, "rectangle","solid","red");
    let card_two = new Card(1, "rectangle","solid","blue");
    let card_three = new Card(1, "rectangle","striped","green");
    let choices_one = [card_one, card_two, card_three];
    expect(isSet(choices_one)).toBe(false);
  })
})

describe("Test isSameOrDiff function", function(){
  it("Test three attributes that are all the same", function(){
    let attributes=["red", "red", "red"];
    expect(isSameOrDiff(attributes)).toBe(true);
  })
  it("Test three attributes that are all different", function(){
    let attributes=["red", "blue", "green"];
    expect(isSameOrDiff(attributes)).toBe(true);
  })
  it("Test three attributes that are not all different or all the same", function(){
    let attributes=["red", "blue", "blue"];
    expect(isSameOrDiff(attributes)).toBe(false);
  })
})

describe("Test Players class", function(){
  it("Test constructor with 3 players", function(){
    const numOfPlayers = 3;
    const players = new Players(numOfPlayers);
    expect(players.setsFound).toEqual(0);
    expect(players.chosen).toEqual(0);
    expect(players.count).toEqual(numOfPlayers);
    expect(players.scores[0]).toEqual(0);
    expect(players.scores[1]).toEqual(0);
    expect(players.scores[2]).toEqual(0);
  })
})


