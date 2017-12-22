//Creating the Stack Class
function Stack() {
	this.stuff = [];
	this.len = 0;
	this.Pop = function() {
		var result = this.stuff[this.len - 1];
		this.stuff = this.stuff.slice(0, -1);
   		return result;
	};
	this.Push = function(x) {
		this.stuff = this.stuff.push(x);
   		this.len = this.len + 1;
	};
	this.getLen = function() {
		return this.len;
	};
}
//http://www.dofactory.com/javascript/observer-design-pattern
var ObservableStack = Object.create(Stack);
ObservableStack.handlers = [];
ObservableStack.registerObserver =  function(observer) {
         this.handlers.push(observer);
     };
ObservableStack.fire = function(o, thisObj) {
    var scope = thisObj || window;
    this.handlers.forEach(function(item) {
        item.call(scope, o);
    });  
    };

// ObservableStack.prototype = {
//     subscribe: function(fn) {
//         this.handlers.push(fn);
//     },
//     fire: function(o, thisObj) {
//         var scope = thisObj || window;
//         this.handlers.forEach(function(item) {
//             item.call(scope, o);
//         });
//     }
// }


// Stack.prototype.Pop = function() {
// 	var result = this.stuff[this.len - 1];
// 	this.stuff = this.stuff.slice(0, -1);
//     return result;
// };
// Stack.prototype.Push = function(x) {
// 	this.stuff = this.stuff.push(x);
//    	this.len = this.len + 1;
// };

// class Stack { 
//   constructor() {
//     this.stuff = [];
//     this.len = 0;
//   }
//   
//   Pop() {
//   	var result = this.stuff[this.len - 1];
//     this.stuff = this.stuff.slice(0, -1);
//     return result;
//   }
//   
//   Push(x) {
//   	this.stuff = this.stuff.push(x);
//   	this.len = this.len + 1;
//   }
//   getLen() {
//   	return this.len;
//   }
// }
// 
// class ObservableStack extends Stack {
// constructor() {
//     this.stuff = [];
//     this.len = 0;
//   }
// }
  

	



// See the following on using objects as key/value dictionaries
// https://stackoverflow.com/questions/1208222/how-to-do-associative-array-hashing-in-javascript
var words_init ={'+' : add, '-' : sub,'*' : mult,'/' : div,'nip' : nip,'swap' : swap,'over' : over,'>' : great,'=' : eq,'<' : less};
//created var_words_init to differentiate between user-defined and non user-defined words
var words ={'+' : add, 
			'-' : sub,
			'*' : mult,
			'/' : div,
			'nip' : nip,
			'swap' : swap,
			'over' : over,
			'>' : great,
			'=' : eq,
			'<' : less};

/** 
 * Your thoughtful comment here.
 */
function emptyStack(stack) {
    stack.length = 0;
    renderStack(stack);
};

/**
*    - Standard arithmetic operations: `+`, `-`, `*`, and `/`
    - `nip`
    - `swap`
    - `over`
    - `>`
    - `=`
    - `<`
*/

function add(stack) {
	var first = stack.pop();
	var second = stack.pop();
    stack.push(second+first);
}
function sub(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(second - first);
}
function mult(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first*second);
}
function div(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(second/first);
}
function nip(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first);
}
function swap(stack) {
	var first = stack.pop();
	var second = stack.pop();
	stack.push(first);
	stack.push(second);
}
function over(stack){
	var first = stack.pop();
	var second = stack.pop();
	stack.push(second);
	stack.push(first);
	stack.push(second);
}
function great(stack){
	var first = stack.pop();
	var second = stack.pop();
	if (second > first){
		stack.push(-1);
	}
	else{
		stack.push(0);
	}
}
function eq(stack){
	var first = stack.pop();
	var second = stack.pop();
	if (second === first){
		stack.push(-1);
	}
	else{
		stack.push(0);
	}
}
function less(stack){
	var first = stack.pop();
	var second = stack.pop();
	if (second < first){
		stack.push(-1);
	}
	else{
		stack.push(0);
	}
}

/**
 * Print a string out to the terminal, and update its scroll to the
 * bottom of the screen. You should call this so the screen is
 * properly scrolled.
 * @param {Terminal} terminal - The `terminal` object to write to
 * @param {string}   msg      - The message to print to the terminal
 */
function print(terminal, msg) {
    terminal.print(msg);
    $("#terminal").scrollTop($('#terminal')[0].scrollHeight + 40);
}

/** 
 * Sync up the HTML with the stack in memory
 * @param {Array[Number]} The stack to render
 */
function renderStack(stack) {
    $("#thestack").empty();
    stack.slice().reverse().forEach(function(element) {
        $("#thestack").append("<tr><td>" + element + "</td></tr>");
    });
};

/** 
 * Process a user input, update the stack accordingly, write a
 * response out to some terminal.
 * @param {Array[Number]} stack - The stack to work on
 * @param {string} input - The string the user typed
 * @param {Terminal} terminal - The terminal object
 */
function process(stack, input, terminal) {
    // The user typed a number
    var newInput = input.trim().split(/ +/);
    if(newInput[0] === ":"){
    	userInput(stack, newInput, terminal)
    }else{
		newInput.forEach(function(element){
			if (!(isNaN(Number(element)))) {
				print(terminal,"pushing " + Number(element));
				stack.push(Number(element));
			} else if (element === ".s") {
				print(terminal, " <" + stack.length + "> " + stack.slice().join(" "));
			}else if (element in words) {
				words[element](stack);
			}else {
				print(terminal, ":-( Unrecognized input");
			}
			renderStack(stack);
    });}
};
    
function userInput(stack, newInput, terminal) { //newinput is an array of strings like [":", "hi", "+", ";"]
	var inside = newInput.slice(2,-1);
	var name = newInput[1];
	words[name] = function(){
		process(stack, inside.join(" "), terminal);
	}
	var div = document.getElementById('user-defined-funcs');
	$( '<a/>', {'id' : name,
	'class' : 'btn',
	'href' : '#',
	'role' : 'button',
	'text' : name
	}).click(function(){
		//words[name](stack);
		process(stack, name, terminal);
	}).appendTo(div);
}

function runRepl(terminal, stack) {
    terminal.input("Type a forth command:", function(line) {
        print(terminal, "User typed in: " + line);
        process(stack, line, terminal);
        runRepl(terminal, stack);
    });
};

//maybe will not use
function makeButtons(stack, terminal){
	//https://stackoverflow.com/questions/8936652/dynamically-create-buttons-with-jquery
	var div = document.getElementById('user-defined-funcs');
	//https://stackoverflow.com/questions/327047/what-is-the-most-efficient-way-to-create-html-elements-using-jquery
	for (word in words) {
		if (!(word in words_init)){
			$( '<a/>', {'id' : word,
				'class' : 'btn',
				'href' : '#',
				'role' : 'button',
				'text' : word
				}).click(function(){
					//words[word](stack);
					process(stack, word, terminal);
				}).appendTo(div);
		}
	}
}

// Whenever the page is finished loading, call this function. 
// See: https://learn.jquery.com/using-jquery-core/document-ready/
$(document).ready(function() {
    var terminal = new Terminal();
    terminal.setHeight("400px");
    terminal.blinkingCursor(true);
    
    // Find the "terminal" object and change it to add the HTML that
    // represents the terminal to the end of it.
    $("#terminal").append(terminal.html);
	
	$( "#reset" ).click(function() {
  		//alert( "Handler for .click() called." );
  		emptyStack(stack);
	});

    //var stack = [];
    var stack = Object.create(ObservableStack);
    stack.registerObserver(renderStack);

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
});
