
  Template.main.events({
    'submit .new-story': function(event){
      event.preventDefault();

      var title = event.target.title.value;
      var text = event.target.text.value;
      var tags = event.target.tags.value.split(';');

      console.log(tags);

      var newStoryID = Panels.insert({
        title: title,
        text: spanify(text),
        tags: tags,
        parentPanel: null,
        parentStory: null,
        children: [],
        createdAt: new Date(),
        createdBy: Meteor.userId(),
        origin: true,
        terminal: false,
      }, function(){
          //TODO: error handling
      }
      );

      //update this new panel so it's its own parent story
      Panels.update( 
          {_id: newStoryID},
          {$set: {parentStory: newStoryID}}
      );

      Router.go('/story/' + newStoryID);
  },

  'click .sentenceGenButton': function(event){

    var lines = [
  'The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us.',
  'I think that at that time none of us quite believed in the Time Machine.',
  'Paul Grayson walked the city street slowly.',
  'The police car U-turned in the broad roadway and headed off to return Nora Phillips to her home and to pick up the officer set to sentry duty.',
  'Paul Grayson awoke the following morning to the tune of the telephone beside his bed.',
  'Chadwick Haedaecker was the kind of man who collected college degrees, both earned and honorary, and had them lettered on his office door like a collection of trophies.',
  'I\'m pointing for Alpha Centauri," said Paul.',
  'Buried in the loose, powdery dust that covered Proxima Centauri I, a spacecraft lay concealed.',
  'Ten days later when Paul\'s ship dropped out of the realm of invisibility, he was no nearer to the problem\'s solution.',
  'Stacey\'s voice was as dry as ever.',
  'With a smile of self-confidence, Paul faced the cheering auditorium and gloried in the praise.',
  'There is something about a pair of handcuffs far above and beyond the mere chaining of wrist to wrist.',
  'Nine days had passed according to the Solar clock on Paul\'s instrument panel.',
  'No one would have believed in the last years of the nineteenth century that this world was being watched keenly and closely by intelligences greater than man\'s and yet as mortal as his own.',
  'Then came the night of the first falling star.',
  'I found a little crowd of perhaps twenty people surrounding the huge hole in which the cylinder lay.',
  'By the 23rd century Earth\'s population had reached seven billion.',
  'He stepped out of the office, glancing around furtively.',
  'Roy Walton watched his brother\'s head and shoulders take form out of the swirl of colors on the screen.',
  'At precisely 1255 Walton tidied his desk, rose and for the second time that day, left his office.',
  'I am a very old man; how old I do not know.',
  'I have never told this story, nor shall mortal man see this manuscript until after I have passed over for eternity.',
  'A sense of delicious dreaminess overcame me, my muscles relaxed, and I was on the point of giving way to my desire to sleep when the sound of approaching horses reached my ears.',
  'When the first strong sunlight of May covered the tree-arched avenues of Center City with green, the riots started.',
  'The Russian soldier made his way nervously up the ragged side of the hill, holding his gun ready.',
  'He picked up his rifle and stepped carefully up to the mouth of the bunker, making his way between blocks of concrete and steel prongs, twisted and bent.',
  'Mr. Hungerton, her father, really was the most tactless person upon earth.',
  'My friend\'s fear or hope was not destined to be realized.',
  'The cabin in which I found myself was small and rather untidy.',
  'The stranger came early in February, one wintry day, through a biting wind and a driving snow, the last snowfall of the year, over the down, walking from Bramblehurst railway station, and carrying a little black portmanteau in his thickly gloved hand.',
  'Mrs. Hall lit the fire and left him there while she went to prepare him a meal with her own hands.',
  'Mr. Utterson the lawyer was a man of a rugged countenance that was never lighted by a smile',
  'Mr. Utterson was sitting by his fireside one evening after dinner, when he was surprised to receive a visit from Poole.',
  'It was a life-and-death struggle — cruel, remorseless, one-sided.',
  'The fact that he had no weapon put him at a terrifying disadvantage.',
  'Lambert was terribly nervous; he trembled under the gaze of the stern detective, come with several colleagues from a neighboring town at the call of Madge Crawford\'s frightened family.',
];

var terminals = {};
var startwords = [];
var wordstats = {};

for (var i = 0; i < lines.length; i++) {
    var words = lines[i].split(' ');
    terminals[words[words.length-1]] = true;
    startwords.push(words[0]);
    for (var j = 0; j < words.length - 1; j++) {
        if (wordstats.hasOwnProperty(words[j])) {
            wordstats[words[j]].push(words[j+1]);
        } else {
            wordstats[words[j]] = [words[j+1]];
        }
    }
}

var choice = function (a) {
    var i = Math.floor(a.length * Math.random());
    return a[i];
};

var make_line = function (min_length) {
    word = choice(startwords);
    var line = [word];
    while (wordstats.hasOwnProperty(word)) {
        var next_words = wordstats[word];
        word = choice(next_words);
        line.push(word);
        if (line.length > min_length && terminals.hasOwnProperty(word)) break;
    }
    if (line.length < min_length) return make_line(min_length);
    return line.join(' ');
};

var line = make_line(3 + Math.floor(3 * Math.random()));

console.log(line);
$('.sentenceGenButton').html('Generate another');
$('.storyInput').val(line);
  }
});
