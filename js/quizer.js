let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// EN songs

const en_2000_gr_icon = [
	'pop_medium',
	'pop_hard',
	'womens_vocals',
	'rock_1',
	'rock_2',
	'rock_hard'
];

const EN_2000_GR_PACK_1 = 3;
const EN_2000_GR_PACK_2 = 4;
const EN_2000_GR_PACK_3 = 6;
const EN_2000_GR_PACK_4 = 2;
const EN_2000_GR_PACK_5 = 1;
const EN_2000_GR_PACK_6 = 5;

let en_2000_gr = [
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'American Idiot (2004)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : 'The Saints Are Coming (ft U2)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Green Day',
			song : '21 Guns',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Want You Bad",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Hit That",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Offspring',
			song : "Kristy, Are You Doing Okay?",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "Fat Lip (2001)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "Pieces (2005)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Sum 41',
			song : "In Too Deep (2001)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "I Miss You (2004)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "Always (2004)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Blink 182',
			song : "Stay Together For The Kids (2002)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Linkin Park",
			song : 'In the end',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : 'Mr. Brightside',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : 'Breaking The Habit',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Linkin Park',
			song : "Bleed It Out",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'By the way',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'The Zephyr Song',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Red Hot Chili Peppers',
			song : 'Tell Me Baby',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'U2',
			song : "Elevation"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'U2',
			song : "Electrical Storm"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'U2',
			song : "City Of Blinding Lights"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Rockstar",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "Somebody Told Me",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Killers',
			song : "When You Were Young",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "Photograph",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Nickelback',
			song : "If Today Was Your Last Day",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "My Generation"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Rollin' (Air Raid Vehicle)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "My Way"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Papa Roach',
			song : 'Last Resort'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : 'Bon Jovi',
			song : "It's My Life",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Drowning Pool",
			song : 'Bodies'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "System of a Down",
			song : 'Chop Suey! (2001)'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Evanescence",
			song : 'Bring Me To Life',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "White Stripes",
			song : 'Seven Nation Army',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Hoobastank',
			song : 'The Reason'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Three Days Grace',
			song : 'I Hate Everything About You'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Skillet',
			song : "Comatose"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Skillet',
			song : "Hero"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Skillet',
			song : "Monster"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : '3 Doors Down',
			song : "Train"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : '3 Doors Down',
			song : "Kryptonite"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : '3 Doors Down',
			song : "Here Without You"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Androgyny",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Run Baby Run",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Garbage',
			song : "Cherry Lips",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Evanescence",
			song : 'My Immortal',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "My Chemical Romance",
			song : 'Welcome to the Black Parade (2006)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Kaiser Chiefs",
			song : 'Ruby'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Paramore",
			song : 'Emergency',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Kasabian",
			song : 'Fire'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Kasabian",
			song : 'Club Foot'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Kasabian",
			song : 'L.S.F.'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Foo Fighters",
			song : 'No Way Back (2005)'
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Metallica",
			song : 'The Day That Never Comes',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Say My Name (1999)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'Ms. Jackson',
			ignore : true
		},		
		{
			pack : EN_2000_GR_PACK_5,
			group : "Coldplay",
			song : 'The Scientist',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Coldplay',
			song : 'Clocks',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'Hey Ya!',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'This Love',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'She Will Be Loved',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "Don't Cha"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Pussycat Dolls",
			song : 'Buttons (ft Snoop Dogg)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "Apologize (ft Timbaland)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Coldplay",
			song : "Viva La Vida",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : 'Clint Eastwood',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : 'Dare',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Falling asleep (2006)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Save Me (2007)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Morandi",
			song : 'Colors (2009)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "Stop And Stare",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "OneRepublic",
			song : "All The Right Moves",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Uprising",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Starlight",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Muse",
			song : "Undisclosed Desires",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Cure",
			song : "Cut Here",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Cure",
			song : "The Only One",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OutKast',
			song : 'The Way You Move (ft Sleep Brown)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "I Gotta Feeling",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Don't Phunk With My Heart",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Black Eyed Peas",
			song : "Meet Me Half Way",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Independent Women, Pt. I (2000)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Destiny's Child",
			song : 'Survivor (2001)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Pussycat Dolls',
			song : "Hush Hush"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Maroon 5',
			song : 'Makes Me Wonder',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Lady Antebellum',
			song : 'Need You Now (2010)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Owl City',
			song : 'Fireflies'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Cascada",
			song : 'Everytime We Touch',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Panic! At The Disco",
			song : 'I Write Sins Not Tragedies (2006)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "MGMT",
			song : 'Kids'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Straight through my heart",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Hi Tack",
			song : "Say Say Say"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Global Deejays",
			song : "The Sound Of San Francisco",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Benassi Bros",
			song : "Hit My Heart",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Narcotic Thrust",
			song : "I Like It"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Reamonn",
			song : "Tonight",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Travis",
			song : "Sing"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Blue',
			song : 'Guilty',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Morcheeba',
			song : 'Otherwise',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Morcheeba',
			song : 'World Looking In',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Westlife',
			song : 'Mandy (2003)'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'ATC',
			song : 'Around the World',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "NSYNC",
			song : 'Bye Bye Bye',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Simply Red',
			song : 'Sunrise'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'ATC',
			song : "I'm in Heaven",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Snow Patrol',
			song : 'Chasing Cars'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Baha Men',
			song : 'Who Let The Dogs Out (2000)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Madcon',
			song : "Beggin'"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'No Angels',
			song : "Still In Love With You"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Brainstorm',
			song : "Maybe",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Five',
			song : "Rock the Party (2001)"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Florence + The Machine',
			song : "Rabbit Heart (Raise It Up)"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Florence + The Machine',
			song : "Cosmic Love"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Beastie Boys',
			song : "An Open Letter To NYC",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Daft Punk',
			song : "One More Time",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Fort Minor',
			song : "Believe Me"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Chemical Brothers',
			song : "Galvanize",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Hurts',
			song : "Wonderful Life (2010)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Hurts',
			song : "Stay (2010)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Basic Element',
			song : "To You",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Mondotek',
			song : "Alive"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Aly & AJ',
			song : "Potential Breakup Song",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Lighthouse Family',
			song : "Run"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Incomplete",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Backstreet Boys',
			song : "Inconsolable",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Super Electric",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Hypnotic",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Bomfunk MCs",
			song : "Live Your Life",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "RIO",
			song : "Shine On"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "RIO",
			song : "When the Sun Comes Down",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "RIO",
			song : "After the Love",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Fall Out Boy",
			song : "Dance, Dance (2005)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Fall Out Boy",
			song : "This Ain’t a Scene, It’s an Arms Race (2006)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Fall Out Boy",
			song : "Thanks for the Memories (2007)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Tokio Hotel",
			song : "By Your Side"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Tokio Hotel",
			song : "1000 Oceans"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Tokio Hotel",
			song : "Darkside of the Sun"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Gorillaz",
			song : "Dirty Harry",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Jakarta",
			song : "One Desire"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Sylver",
			song : "Forgiven"
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Sylver",
			song : "Turn The Tide"
		},
		{
			pack : EN_2000_GR_PACK_3,
			group : "Guns N Roses",
			song : "Chinese Democracy (2008)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Semisonic",
			song : "Chemistry",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "INXS",
			song : "Afterglow",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "INXS",
			song : "Original Sin",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Faithless",
			song : "We Come 1 (2001)"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Faithless",
			song : "One Step Too Far (ft Dido) (2002)",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Dangerous",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Wonder Where You Are",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Da Buzz",
			song : "Let Me Love You Tonight",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Papa Roach',
			song : 'Scars'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Papa Roach',
			song : 'Getting Away with Murder'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Klubbheads',
			song : 'Hiphopping'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'OK Go',
			song : 'Here It Goes Again'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Incubus',
			song : 'Drive'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : 'Benefit',
			song : "Sex Sells",
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Paramore",
			song : 'Misery Business (2007)'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Paramore",
			song : 'Decode (2008)'
		},
		{
			pack : EN_2000_GR_PACK_4,
			group : "Paramore",
			song : 'Ignorance (2009)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Theory of a Deadman",
			song : 'Bad Girlfriend (2008)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Theory of a Deadman",
			song : 'All or Nothing',
			year : 2008,
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Theory of a Deadman",
			song : 'Hate My Life',
			year : 2008,
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Hollywood Undead",
			song : 'Everywhere I Go',
			year : 2009
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Hollywood Undead",
			song : 'Undead',
			year : 2008
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Hollywood Undead",
			song : 'Hear Me Now',
			year : 2010
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Breaking Benjamin",
			song : 'The Diary of Jane',
			year : 2006
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Breaking Benjamin",
			song : 'I Will Not Bow',
			year : 2009,
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Breaking Benjamin",
			song : 'Breath',
			year : 2007,
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Veronicas",
			song : 'Untouched (2007)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Weezer",
			song : 'Beverly Hills (2005)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Weezer",
			song : 'Island in the Sun (2001)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Weezer",
			song : 'Pork and Beans (2008)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Yeah Yeah Yeahs',
			song : 'Heads Will Roll (2009)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : 'Yeah Yeah Yeahs',
			song : 'Maps (2004)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "My Chemical Romance",
			song : 'Teenagers (2007)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "My Chemical Romance",
			song : 'Helena (2005)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Westlife',
			song : 'Uptown Girl (2001)',
			ignore : true
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Westlife',
			song : 'You Raise Me Up (2005)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Five',
			song : "Let's Dance (2001)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Panic! At The Disco",
			song : 'She Had the World (2008)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Fly Project",
			song : 'Brasil (ft Anca Parghel and Tom Boxer) (2008)'
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : "Fly Project",
			song : 'Raisa (2005)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Thirty Seconds to Mars",
			song : 'The Kill (2006)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Thirty Seconds to Mars",
			song : 'Kings and Queens (2009)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Thirty Seconds to Mars",
			song : 'A Beautiful Lie (2007)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Gregorian",
			song : "Moment of Peace (2001)"
		},
		{
			pack : EN_2000_GR_PACK_5,
			group : 'Westlife',
			song : 'My Love (2000)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Fort Minor',
			song : "Remember the Name (ft Styles of Beyond)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : '3OH!3',
			song : "Don't Trust Me (2008)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Mis-Teeq",
			song : 'Scandalous (2003)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Plain White T's",
			song : "Hate (I Really Don't Like You) (2006)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "AFI",
			song : 'Miss Murder (2006)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "AFI",
			song : 'Prelude 12/21 (2006)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Arctic Monkeys",
			song : '505 (2007)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Arctic Monkeys",
			song : 'Mardy Bum (2006)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Arctic Monkeys",
			song : 'Old Yellow Bricks (2007)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Audioslave",
			song : 'Like a Stone (2003)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Audioslave",
			song : 'Revelations (2006)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Rise Against",
			song : 'Savior (2009)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Rise Against",
			song : 'Under The Knife (2006)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Static-X",
			song : 'New Pain (2003)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Static-X",
			song : 'Skinnyman (2005)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Static-X",
			song : 'The Only (2003)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Slipknot",
			song : 'Wait and Bleed (2001)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Slipknot",
			song : 'Psychosocial (2008)'
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "Slipknot",
			song : 'Left Behind (2000)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Simple Plan",
			song : "I'm Just a Kid (2002)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Simple Plan",
			song : 'Take My Hand (2008)'
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Simple Plan",
			song : "When I'm Gone (2007)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "POD",
			song : "Boom (2002)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "POD",
			song : "Find My Way (2003)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : "POD",
			song : "Youth Of The Nation (2001)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Counting Crows",
			song : "Accidentally In Love (2004)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Scissor Sisters",
			song : "I Don't Feel Like Dancin' (2006)"
		},
		{
			pack : EN_2000_GR_PACK_1,
			group : "Scissor Sisters",
			song : "Laura (2003)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Wheatus",
			song : "Teenage Dirtbag (2000)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Lustra",
			song : "Scotty Doesn't Know (2004)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Lazlo Bane",
			song : "Superman (2002)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "US5",
			song : "Maria (2005)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : "Alien Ant Farm",
			song : "Smooth Criminal (2001)"
		},
		{
			pack : EN_2000_GR_PACK_2,
			group : 'Limp Bizkit',
			song : "Take A Look Around (2000)"
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Calling',
			song : 'Wherever You Will Go (2001)'
		},
		{
			pack : EN_2000_GR_PACK_6,
			group : 'Empire Of The Sun',
			song : 'Walking On a Dream (2008)'
		}
];

let en_2000_gr_1 =	en_2000_gr.filter(item => item.pack == 1);
let en_2000_gr_2 =	en_2000_gr.filter(item => item.pack == 2);
let en_2000_gr_3 =	en_2000_gr.filter(item => item.pack == 3);
let en_2000_gr_4 =	en_2000_gr.filter(item => item.pack == 4);
let en_2000_gr_5 =	en_2000_gr.filter(item => item.pack == 5);

let music = [
	{
		arr: en_2000_gr,
		lang: 'en',
		year: '2000',
		type: 'gr',
		packs: [
				{
					arr: en_2000_gr_1,
					name: 'EN 2000s Groups: Pop'
				},
				{
					arr: en_2000_gr_2,
					name: "EN 2000s Groups: Women's Vocals"
				},
				{
					arr: en_2000_gr_3,
					name: "EN 2000s Groups: Soft Rock"
				},
				{
					arr: en_2000_gr_4,
					name: "EN 2000s Groups: Hard Rock"
				},
				{
					arr: en_2000_gr_5,
					name: 'EN 2000s Groups: One Hit Wonders'
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#sec_15_hist').show();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'en';
	year = '2000';
	artist_type = 'gr';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = en_2000_gr_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/2000';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#sec_15_hist').hide();
	song_stop();
	$('#map').show();
	package_num(pack_num);
}

function song_stop() {
	if(audio){
		audio.pause();
		audio = null;
	}
}