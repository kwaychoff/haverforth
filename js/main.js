//Creating the Stack Class
var Stack = {
	stuff : [],
	len : 0,
	Push : function(x) {
		this.stuff = this.stuff.concat([x]);
		console.log(typeof this.stuff);
   		this.len = this.len + 1;
	},
	Pop : function() {
		this.len = this.len - 1;
		return this.stuff.pop();
	},
	getLen : function() {
		return this.len;
	},
	getRepl : function() {
		return this.stuff.slice().join(" ");
	}
}

//http://www.dofactory.com/javascript/observer-design-pattern
var ObservableStack = Object.create(Stack);
ObservableStack.observers = [];
ObservableStack.registerObserver =  function(observer) {
         this.observers.push(observer);
     };
// ObservableStack.fire = function(o, thisObj) {
//     var scope = thisObj || window;
//     this.observers.forEach(function(item) {
//         item.call(scope, o);
//     });  
ObservableStack.fire = function(data) {
	this.observers.forEach((observer) => observer(data));
};



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
    //stack.length = 0;
    //renderStack(stack);
    var count = stack.getLen();
    for (i = 0; i < count; i++) { 
    	stack.Pop();
	}
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
	var first = stack.Pop();
	var second = stack.Pop();
    stack.Push(second+first);
}
function sub(stack) {
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(second - first);
}
function mult(stack) {
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(first*second);
}
function div(stack) {
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(second/first);
}
function nip(stack) {
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(first);
}
function swap(stack) {
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(first);
	stack.Push(second);
}
function over(stack){
	var first = stack.Pop();
	var second = stack.Pop();
	stack.Push(second);
	stack.Push(first);
	stack.Push(second);
}
function great(stack){
	var first = stack.Pop();
	var second = stack.Pop();
	if (second > first){
		stack.Push(-1);
	}
	else{
		stack.Push(0);
	}
}
function eq(stack){
	var first = stack.Pop();
	var second = stack.Pop();
	if (second === first){
		stack.Push(-1);
	}
	else{
		stack.Push(0);
	}
}
function less(stack){
	var first = stack.Pop();
	var second = stack.Pop();
	if (second < first){
		stack.Push(-1);
	}
	else{
		stack.Push(0);
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
 //https://we-are.bookmyshow.com/understanding-deep-and-shallow-copy-in-javascript-13438bad941c
function renderStack(stack) {
    $("#thestack").empty();
    console.log(typeof stack);
    try {
		var count = stack.getLen();
		var copyStack = jQuery.extend(true, {}, stack);
		var holder = [];
		for (i = 0; i < count; i++) { 
			var item = copyStack.Pop();
			holder.push(item);
		}
		for (i = 0; i < count; i++) {
			$("#thestack").append("<tr><td>" + holder[i] + "</td></tr>");
		}
	}
	catch(err){
		console.log(err.message);
	}
};	
    // stack.slice().reverse().forEach(function(element) {
//         $("#thestack").append("<tr><td>" + element + "</td></tr>");
//     });


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
    	userInput(stack, newInput, terminal);
    }else if (newInput[0] === "if"){
    	ifElse(stack, newInput, terminal);
    }else{
		newInput.forEach(function(element){
			if (!(isNaN(Number(element)))) {
				print(terminal,"pushing " + Number(element));
				stack.Push(Number(element));
			} else if (element === ".s") {
				print(terminal, " <" + String(stack.getLen()) + "> " + stack.getRepl());
			}else if (element in words) {
				words[element](stack);
			}else {
				print(terminal, ":-( Unrecognized input");
			}
			renderStack(stack);
    });}
};

function ifElse(stack, newInput, terminal) {
	var inside = newInput.slice(1, -1);
	var firstHalf = [];
	var secondHalf = [];
	var infirst = true;
	inside.forEach(function(element) {
		if(element === "else"){
			infirst = false;
		}else if(infirst === true){
			firstHalf.push(element);
		}else{
			secondHalf.push(element);
		}
	});
	console.log(firstHalf);
	console.log(secondHalf);
	var top = stack.Pop();
	if (Number(top) === 0){ //this is false
		process(stack, secondHalf.join(" "), terminal);
	}
	else{
		process(stack, firstHalf.join(" "), terminal);
	}
}
    
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

    var stack = Object.create(ObservableStack);
    stack.registerObserver(renderStack);
    //stack.fire();

    print(terminal, "Welcome to HaverForth! v0.1");
    print(terminal, "As you type, the stack (on the right) will be kept in sync");

    runRepl(terminal, stack);
});
