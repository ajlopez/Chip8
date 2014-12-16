
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

exports['create machine with registers'] = function (test) {
    var machine = chip8.machine();
    
    test.ok(machine);
    test.ok(machine.v);
    test.ok(Array.isArray(machine.v));
    test.equal(machine.v.length, 16);
    
    for (var k = 0; k < machine.v.length; k++)
        test.equal(machine.v[k], 0);
}

