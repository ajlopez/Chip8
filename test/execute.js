
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

exports['load registers'] = function (test) {
    var machine = chip8.machine();
    
    for (var nr = 0; nr < 16; nr++) {
        var code = 0x6000 | (nr << 8) | nr * 10;
        machine.execute(code);
        test.equal(machine.v[nr], nr * 10);
    }
}
