
var chip8 = require('..');

exports['load register 0'] = function (test) {
    var machine = chip8.machine();
    machine.execute(0x6012);
    test.equal(machine.v[0], 0x12);
}

exports['load register 1'] = function (test) {
    var machine = chip8.machine();
    machine.execute(0x6112);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x12);
}

