$(document).ready(function() {
    setTimeout(() => $('.text').removeClass('is-off'), 3000)

    setInterval(() => $('.content').html('LocalGOST'), 500);

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    
    window.api_password = localStorage.getItem('__shell_password');

    // COMMANDS
    function help() {
        var commands_help = "";
        for (i = 0; i < commands.length; i++) {
            commands_help += commands[i].name + " - " + commands[i].help + "\n";
        }
        terminal.append("'!' before command - run async\n" +
                       "Commands:\n" + commands_help);
    }
    
    function back_eval(cmd) {
        
    }
    
    function back_shell(cmd) {
        
    }
    
    function back_spawn_reverse_shell(args) {
        // args == [ ip, port ]
        if (args.length !== 2) {
            terminal.append("Please pass reverse_shell {ip} {port}\n");
            return;
        }
    }
    
    function login(password) {
        localStorage.setItem('__shell_password', password);
        window.api_password = password;
        terminal.append("Password setup done.\n");
    }
    
    var commands = [{
        "name": "clear",
        "function": () => terminal.text(""),
        "help": "clear terminal"
    }, {
        "name": "help",
        "function": help,
        "help": "this help"
    }, {
        "name": "login",
        "arg_str": true,
        "function": login,
        "help": "set password for requests"
    }, {
        "name": "eval",
        "arg_str": true,
        "function": back_eval,
        "help": "run code"
    }, {
        "name": "sh",
        "arg_str": true,
        "function": back_shell,
        "help": "spawn proccess with this args"
    }, {
        "name": "reverse_shell",
        "function": back_spawn_reverse_shell,
        "help": "spawn reverse shell. Args: [ip, port]"
    }, {
        "name": "animation",
        "function": () => $('.screen').toggleClass('glitch'),
        "help": "toggle animation"
    }];
    // END COMMANDS

    var terminal = $(".terminal");
    var prompt = "➜";
    var path = "~";

    var commandHistory = [];
    var historyIndex = 0;

    var command = "";
    

    function processCommand() {
        var isValid = false;
        command = command.trim();
        var spaceIndex = command.indexOf(" ") > 0 ? command.indexOf(" ") : command.length;
        var cmd = command.substr(0, spaceIndex);
        var async = cmd[0] == '!';
        if (async) {
            cmd = cmd.substr(1);
        }
        var args = command.substr(spaceIndex + 1);
        
        for (var i = 0; i < commands.length; i++) {
            if (cmd === commands[i].name) {
                if (commands[i].arg_str === undefined || !commands[i].arg_str) {
                    args = args.split(" ");
                }

                if (async) {
                    setTimeout(() => commands[i].function(args), 0);
                } else {
                    commands[i].function(args);
                }
                isValid = true;
                break;
            }
        }
        if (!isValid && command.length > 0) {
            terminal.append("command not found: " + command + "\n");
        }

        commandHistory.push(command);
        historyIndex = commandHistory.length;
        command = "";
    }

    function displayPrompt() {
        terminal.append("<span class=\"prompt\">" + prompt + "</span> ");
        terminal.append("<span class=\"path\">" + path + "</span> ");
        terminal.scrollTop(terminal[0].scrollHeight);
    }

    // Delete n number of characters from the end of our output
    function erase(n) {
        command = command.slice(0, -n);
        terminal.html(terminal.html().slice(0, -n));
    }

    function clearCommand() {
        if (command.length > 0) {
            erase(command.length);
        }
    }

    function appendCommand(str) {
        terminal.append(str);
        command += str;
    }

    $(document).keydown(function(e) {
        e = e || window.event;
        var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

        // BACKSPACE
        if (keyCode === 8 && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            if (command !== "") {
                erase(1);
            }
        }

        // UP or DOWN
        if (keyCode === 38 || keyCode === 40) {
            // Move up or down the history
            if (keyCode === 38) {
                // UP
                historyIndex--;
                if (historyIndex < 0) {
                    historyIndex++;
                }
            } else if (keyCode === 40) {
                // DOWN
                historyIndex++;
                if (historyIndex > commandHistory.length - 1) {
                    historyIndex--;
                }
            }

            // Get command
            var cmd = commandHistory[historyIndex];
            if (cmd !== undefined) {
                clearCommand();
                appendCommand(cmd);
            }
        }
    });

    $(document).keypress(function(e) {
        // Make sure we get the right event
        e = e || window.event;
        var keyCode = typeof e.which === "number" ? e.which : e.keyCode;

        // Which key was pressed?
        switch (keyCode) {
            // ENTER
            case 13: {
                terminal.append("\n");

                processCommand();
                displayPrompt();
                break;
            }
            default: {
                appendCommand(String.fromCharCode(keyCode));
            }
        }
    });
    
    $(document).bind("paste", function(e) {
        var pastedData = e.originalEvent.clipboardData.getData('text');
        pastedData = pastedData.split("\n");
        for (var i = 0; i < pastedData.length; i++) {
            appendCommand(pastedData[i]);
            if (i !== pastedData.length-1) {
                terminal.append("\n");

                processCommand();
                displayPrompt();
            }
        }
    });
    
    var writeEmulatorText = "Hello!\n"
    var writeEmulator = setInterval(function() {
        emulatedChar = writeEmulatorText[0]
        writeEmulatorText = writeEmulatorText.substr(1)
        terminal.append(emulatedChar)
        if (writeEmulatorText.length == 0) {
            clearInterval(writeEmulator);
            displayPrompt();
        }
    }, 100);  
});
