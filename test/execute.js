
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

exports['load register 2 from register 1'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 10;
    machine.execute(0x8210);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 10);
    test.equal(machine.v[2], 10);
}

exports['or registers 1 and 2'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x10;
    machine.v[2] = 0x12;
    machine.execute(0x8211);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x10);
    test.equal(machine.v[2], 0x10 | 0x12);
}

exports['and registers 1 and 2'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x12;
    machine.execute(0x8212);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0x11 & 0x12);
}

exports['xor registers 1 and 2'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x12;
    machine.execute(0x8213);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0x11 ^ 0x12);
}

exports['add registers 1 and 2 without carry'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x12;
    machine.execute(0x8214);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0x11 + 0x12);
    test.strictEqual(machine.vf, 0);
}

exports['add registers 1 and 2 with carry'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x81;
    machine.v[2] = 0x82;
    machine.execute(0x8214);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x81);
    test.equal(machine.v[2], (0x81 + 0x82) & 0x00ff);
    test.strictEqual(machine.vf, 1);
}

exports['load registers from registers'] = function (test) {
    var machine = chip8.machine();
    
    machine.v[0] = 10;
    
    for (var nr = 1; nr < 16; nr++) {
        var code = 0x8000 | (nr << 8) | ((nr - 1) << 4);
        machine.execute(code);
        test.equal(machine.v[nr], 10);
    }
}

exports['load register i'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 10;
    machine.execute(0xa123);
    test.equal(machine.i, 0x0123);
}

exports['add to register i'] = function (test) {
    var machine = chip8.machine();
    machine.i = 0x0123;
    machine.v[2] = 0x0010;
    machine.execute(0xf21e);
    test.equal(machine.i, 0x0133);
}
