/*
*/

var first_glyph = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
var second_glyph = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ";
var last_glyph = "　ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ";

var korean_code_start = 0xAC00;
var korean_code_end = 0xD7A0;
var first_w = second_glyph.length * last_glyph.length;
var second_w = last_glyph.length;

var enko_map = {
	 '`':'*',	'1':'ㅎ',	'2':'ㅆ',	'3':'ㅂ',	'4':'ㅛ',	'5':'ㅠ',	'6':'ㅑ',	'7':'ㅖ'
	,'8':'ㅢ',	'9':'ㅜ',	'0':'ㅋ',	'-':')',	'=':'>',	'q':'ㅅ',	'w':'ㄹ',	'e':'ㅕ'
	,'r':'ㅐ',	't':'ㅓ',	'y':'ㄹ',	'u':'ㄷ',	'i':'ㅁ',	'o':'ㅊ',	'p':'ㅍ',	'[':'('
	,']':'<',	'\\':':',	'a':'ㅇ',	's':'ㄴ',	'd':'ㅣ',	'f':'ㅏ',	'g':'ㅡ',	'h':'ㄴ'
	,'j':'ㅇ',	'k':'ㄱ',	'l':'ㅈ',	';':'ㅂ',	'\'':'ㅌ',	'z':'ㅁ',	'x':'ㄱ',	'c':'ㅔ'
	,'v':'ㅗ',	'b':'ㅜ',	'n':'ㅅ',	'm':'ㅎ',	',':',',	'.':'.',	'/':'ㅗ'

	,'~':'※',	'!':'ㄲ',	'@':'ㄺ',	'#':'ㅈ',	'$':'ㄿ',	'%':'ㄾ',	'^':'=',	'&':'“'
	,'*':'”',	'(':'\'',	')':'~',	'_':';',	'+':'+',	'Q':'ㅍ',	'W':'ㅌ',	'E':'ㄵ'
	,'R':'ㅀ',	'T':'ㄽ',	'Y':'5',	'U':'6',	'I':'7',	'O':'8',	'P':'9',	'{':'%'
	,'}':'/',	'|':'\\',	'A':'ㄷ',	'S':'ㄶ',	'D':'ㄼ',	'F':'ㄻ',	'G':'ㅒ',	'H':'0'
	,'J':'1',	'K':'2',	'L':'3',	':':'4',	'\"':'·',	'Z':'ㅊ',	'X':'ㅄ',	'C':'ㅋ'
	,'V':'ㄳ',	'B':'?',	'N':'-',	'M':'\"',	'<':',',	'>':'.',	'?':'!'
};

var first_glyph_keys = "0yuiophjkl;'nm";

var composing_rule = [
	[
		['ㄱ','ㄱ','ㄲ'],
		['ㄷ','ㄷ','ㄸ'],
		['ㅂ','ㅂ','ㅃ'],
		['ㅅ','ㅅ','ㅆ'],
		['ㅈ','ㅈ','ㅉ'],
	],	
	[
		['ㅗ','ㅏ','ㅘ'],
		['ㅗ','ㅐ','ㅙ'],
		['ㅗ','ㅣ','ㅚ'],
		['ㅜ','ㅓ','ㅝ'],
		['ㅜ','ㅔ','ㅞ'],
		['ㅜ','ㅣ','ㅟ'],
		['ㅡ','ㅣ','ㅢ'],
	],
	[
	],
];

function char2input(en_char) {
	var glyph = enko_map[en_char]||en_char;
	var type = 0;
	var code = 0;
	
	if (first_glyph_keys.indexOf(en_char) >= 0 && (code = first_glyph.indexOf(glyph)) >= 0) {
		type = 1;
	} else if ((code = second_glyph.indexOf(glyph)) >= 0) {
		type = 2;
	} else if ((code = last_glyph.indexOf(glyph)) >= 0) {
		type = 3;
	} else {
		type = 0;
	}
	
	return [type, glyph];
}

function isKorean(glyph) {
	var code = glyph.charCodeAt(0);
	if (code >= korean_code_start && code < korean_code_end)
		return true;
	else if (getType(glyph) > 0) return true;
	else {
		for (var i in enko_map) {
			if (enko_map[i] == glyph) return true;
		}
	}
	return false;
}

function isDecomposable(glyph) {
	var code = glyph.charCodeAt(0);
	return code >= korean_code_start && code < korean_code_end;
}

function decompose(ko_char) {
	var code = ko_char.charCodeAt(0);
	
	var first, second, last;
	code -= korean_code_start;
	last = code % last_glyph.length;
	code = Math.floor(code/last_glyph.length);
	second = code % second_glyph.length;
	first = Math.floor(code / second_glyph.length);
	
	return [first, second, last];
}

function getType(glyph) {
	if (first_glyph.indexOf(glyph) >= 0) return 1;
	else if (second_glyph.indexOf(glyph) >= 0) return 2;
	else if (last_glyph.indexOf(glyph) >= 0) return 3;
	return 0;
}

function code2glyph(code, type) {
	switch (type) {
	case 1:
		return first_glyph[code];
		break;
	case 2:
		return second_glyph[code];
		break;
	case 3:
		return last_glyph[code];
		break;
	}
	return false;
}

function glyph2enchar(glyph, type) {
	var enchar = glyph;
	
	if (type == 1) {
		for (var i in composing_rule[type-1]) {
			var rule = composing_rule[type-1][i];
			if (rule[2] == glyph)
				return glyph2enchar(rule[0], type) + glyph2enchar(rule[1], type);
		}
	} else if (type == 2 && "ㅘㅙㅚㅝㅞㅟ".indexOf(glyph) >= 0) {
		for (var i in composing_rule[type-1]) {
			var rule = composing_rule[type-1][i];
			if (rule[2] == glyph)
				return (rule[0]=='ㅗ'? '/' : '9') + glyph2enchar(rule[1], type);
		}
	}
	
	for (var i in enko_map) {
		if (glyph == enko_map[i]) {
			enchar = i;
			var first = first_glyph_keys.indexOf(enchar) >= 0;
			if ((type == 1 && !first) || (type == 3 && first)) {
				continue;
			}
			break;
		}
	}
	return enchar;
}

function toKo() {
	var src = document.getElementById("en-text").value + ' ';
	var dst = document.getElementById("ko-text");

	var out = "";
	
	var state = 0;
	var glyph = ['','','',''];
	
	for (var i in src) {
		var ch = src[i];
		var input = char2input(ch);
		var type = input[0];

		var A, B, C;
		A = type == 1;
		B = type == 2;
		C = type == 3;

		var composed = false;
		while (!composed)
		{
			switch (state) {
			case 0:		// 초기상태
				state = A ? 1 : B||C? 2 : 0;
				break;
			case 1:		// 초성
				state = A ? 1 : B||C? 3 : 0;
				if (state == 0) {
					out += glyph[1];
				}
				break;
			case 2:		// 중성|종성
				state = A ? 3 : B||C? 2 : 0;
				if (state == 0) {
					out += glyph[2]||glyph[3];
				}
				break;
			case 3:		// 초성+중성|종성
				state = B||C? 3 : 0;
				if (state == 0) {
					var code = [];
					code[0] = first_glyph.indexOf(glyph[1]);
					code[1] = glyph[2] == "" ? -1 : second_glyph.indexOf(glyph[2]);
					code[2] = glyph[3] == "" ? 0 : last_glyph.indexOf(glyph[3]);
					if (code[1] < 0)
						out += glyph[1];
					else
						out += String.fromCharCode(korean_code_start+code[0]*first_w+code[1]*second_w+code[2]);
				}
				break;
			}

			if (type == 0) {
				composed = true;
				out += input[1];
			}
			if (state == 0) {
				glyph = ['','','',''];
				code = [0, 0, 0, 0];
			} else if (A || B || C) {
				if (glyph[type] == '') {
					composed = true;
					glyph[type] = input[1];
				} else {
					for (var j in composing_rule[type-1]) {
						rule = composing_rule[type-1][j];
						if (rule[0] == glyph[type] && rule[1] == input[1]) {
							composed = true;
							glyph[type] = rule[2];
							break;
						}
					}
					if (!composed) {
						A = B = C = false;
						continue;
					}
				}
			}
			A = type == 1;
			B = type == 2;
			C = type == 3;
		}
		
	}
	
	dst.value = out.trim();
}


function toEn() {
	var src = document.getElementById("ko-text").value;
	var dst = document.getElementById("en-text");
	
	var out = "";
	
	for (var i in src) {
		var ch = src[i];
		if (!isKorean(ch)) {
			out += ch;
		} else {
			if (isDecomposable(ch)) {
				var data = decompose(ch);
				out += glyph2enchar(code2glyph(data[0], 1), 1);
				out += glyph2enchar(code2glyph(data[1], 2), 2);
				if (data[2] > 0) out += glyph2enchar(code2glyph(data[2], 3), 3);
			} else {
				out += glyph2enchar(ch, getType(ch));
			}
		}
	}

	dst.value = out;
}