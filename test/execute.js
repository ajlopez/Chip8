
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

exports['subtract registers 1 and 2 without borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x12;
    machine.execute(0x8215);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0x12 - 0x11);
    test.strictEqual(machine.vf, 1);
}

exports['subtract registers 1 and 2 with borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x10;
    machine.execute(0x8215);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], (0x10 - 0x11) & 0x00ff);
    test.strictEqual(machine.vf, 0);
}

exports['subtract registers 1 and 2 giving 0 without borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x11;
    machine.execute(0x8215);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0);
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

exports['shift right register without bit'] = function (test) {
    var machine = chip8.machine();
    machine.v[2] = 0x82;
    machine.execute(0x8216);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0);
    test.equal(machine.v[2], 0x0082 >> 1);
    test.strictEqual(machine.vf, 0);
}

exports['shift right register with bit'] = function (test) {
    var machine = chip8.machine();
    machine.v[2] = 0x83;
    machine.execute(0x8216);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0);
    test.equal(machine.v[2], 0x0083 >> 1);
    test.strictEqual(machine.vf, 1);
}

exports['shift left register without bit'] = function (test) {
    var machine = chip8.machine();
    machine.v[2] = 0x62;
    machine.execute(0x821e);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0);
    test.equal(machine.v[2], 0x0062 << 1);
    test.strictEqual(machine.vf, 0);
}

exports['shift left register with bit'] = function (test) {
    var machine = chip8.machine();
    machine.v[2] = 0x83;
    machine.execute(0x821e);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0);
    test.equal(machine.v[2], 0x0083 << 1);
    test.strictEqual(machine.vf, 1);
}

exports['subtract negate registers 1 and 2 without borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x12;
    machine.v[2] = 0x11;
    machine.execute(0x8217);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x12);
    test.equal(machine.v[2], 0x12 - 0x11);
    test.strictEqual(machine.vf, 1);
}

exports['subtract negate registers 1 and 2 with borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x10;
    machine.v[2] = 0x11;
    machine.execute(0x8217);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x10);
    test.equal(machine.v[2], (0x10 - 0x11) & 0x00ff);
    test.strictEqual(machine.vf, 0);
}

exports['subtract negate registers 1 and 2 giving 0 without borrow'] = function (test) {
    var machine = chip8.machine();
    machine.v[1] = 0x11;
    machine.v[2] = 0x11;
    machine.execute(0x8217);
    test.equal(machine.v[0], 0);
    test.equal(machine.v[1], 0x11);
    test.equal(machine.v[2], 0);
    test.strictEqual(machine.vf, 0);
}

exports['jump to address in register'] = function (test) {
    var machine = chip8.machine();
    machine.v[0] = 0x10;
    machine.execute(0xb123);
    test.equal(machine.pc, 0x133);
}

exports['jump to address'] = function (test) {
    var machine = chip8.machine();
    machine.v[0] = 0x10;
    machine.execute(0x1123);
    test.equal(machine.pc, 0x123);
}

exports['call to address'] = function (test) {
    var machine = chip8.machine();
    machine.pc = 0x20;
    machine.execute(0x2123);
    test.equal(machine.pc, 0x123);
    test.equal(machine.sp, 1);
    test.equal(machine.stack[0], 0x20);
}

exports['return to address'] = function (test) {
    var machine = chip8.machine();
    machine.pc = 0x20;
    machine.sp = 1;
    machine.stack[0] = 0x100;
    machine.execute(0x00ee);
    test.equal(machine.pc, 0x100);
    test.equal(machine.sp, 0);
}

exports['skip if equal'] = function (test) {
    var machine = chip8.machine();
    machine.pc = 0x20;
    machine.v[1] = 0x45;
    machine.execute(0x3145);
    test.equal(machine.pc, 0x22);
}

exports["don't skip if not equal"] = function (test) {
    var machine = chip8.machine();
    machine.pc = 0x20;
    machine.v[1] = 0x45;
    machine.execute(0x3144);
    test.equal(machine.pc, 0x20);
}

