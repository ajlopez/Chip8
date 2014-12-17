
var chip8 = require('..');

exports['load register 0'] = function (test) {
    var machine = chip8.machine();
    machine.execute(0x6012);
    test.equal(machine.v[0], 0x12);
}

