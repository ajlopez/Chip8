
var chip8 = require('..');

exports['create machine'] = function (test) {
    var machine = chip8.machine();
    
    test.ok(machine);
    test.equal(typeof machine, 'object');
    test.strictEqual(machine.pc, 0);
    test.ok(machine.memory);
    test.ok(Array.isArray(machine.memory));
    test.equal(machine.memory.length, 4096);
    test.ok(machine.stack);
    test.ok(Array.isArray(machine.stack));
    test.equal(machine.stack.length, 16);
}

