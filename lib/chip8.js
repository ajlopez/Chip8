
function Machine() {
    this.reset();
}

Machine.prototype.reset = function () {
    this.pc = 0;
    this.memory = new Array(4096);
    this.stack = new Array(16);
    this.sp = 0;
    this.v = createArray(16);
    this.i = 0;
}

function loadAddress(self, code, nv) {
    var addr = code & 0x0fff;
    self.i = addr;
}

function jumpToLocation(self, code, nv) {
    var addr = code & 0x0fff;
    self.pc = self.v[0] + addr;
}

function jumpToAddress(self, code, nv) {
    var addr = code & 0x0fff;
    self.pc = addr;
}

function callAddress(self, code, nv) {
    var addr = code & 0x0fff;
    self.stack[self.sp++] = self.pc;
    self.pc = addr;
}

function skipIfEqual(self, code, nv) {
    var value = code & 0x00ff;
    
    if (self.v[nv] == value)
        self.pc += 2;
}

function skipIfNotEqual(self, code, nv) {
    var value = code & 0x00ff;
    
    if (self.v[nv] != value)
        self.pc += 2;
}

function skipIfEqualRegister(self, code, nv) {
    var nv0 = (code & 0x00f0) >> 4;
    
    if (self.v[nv] == self.v[nv0])
        self.pc += 2;
}

function loadAndOpers(self, code, nv) {
    var nv0 = (code & 0x00f0) >> 4;

    var rightcode = code & 0x0f;

    if (rightcode == 1)
        self.v[nv] |= self.v[nv0];
    else if (rightcode == 2)
        self.v[nv] &= self.v[nv0];
    else if (rightcode == 3)
        self.v[nv] ^= self.v[nv0];
    else if (rightcode == 4) {
        var result = self.v[nv] + self.v[nv0];
        
        if ((result & 0x00ff) != result) {
            result = result & 0x00ff;
            self.vf = 1;
        }
        else
            self.vf = 0;
            
        self.v[nv] = result;
    }
    else if (rightcode == 5) {
        var result = self.v[nv] - self.v[nv0];
        result &= 0x00ff;
        
        if (self.v[nv] > self.v[nv0])
            self.vf = 1;
        else
            self.vf = 0;
            
        self.v[nv] = result;
    }
    else if (rightcode == 7) {
        var result = self.v[nv0] - self.v[nv];
        result &= 0x00ff;
        
        if (self.v[nv0] > self.v[nv])
            self.vf = 1;
        else
            self.vf = 0;
            
        self.v[nv] = result;
    }
    else if (rightcode == 6) {
        if (self.v[nv] & 0x01)
            self.vf = 1;
        else
            self.vf = 0;
            
        self.v[nv] >>= 1;
    }
    else if (rightcode == 0x0e) {
        if (self.v[nv] & 0x80)
            self.vf = 1;
        else
            self.vf = 0;
            
        self.v[nv] <<= 1;
    }
    else
        self.v[nv] = self.v[nv0];
}

var dispatch = [];
dispatch[0x01] = jumpToAddress;
dispatch[0x02] = callAddress;
dispatch[0x03] = skipIfEqual;
dispatch[0x04] = skipIfNotEqual;
dispatch[0x05] = skipIfEqualRegister;
dispatch[0x08] = loadAndOpers;
dispatch[0x0a] = loadAddress;
dispatch[0x0b] = jumpToLocation;

Machine.prototype.execute = function (code) {
    if (code == 0x00ee) {
        var addr = this.stack[this.sp - 1];
        this.sp--;
        this.pc = addr;
        return;
    }
    
    var nv = (code & 0x0f00) >> 8;    
    var leftcode = (code & 0xf000) >> 12;
    
    if (dispatch[leftcode]) {
        dispatch[leftcode](this, code, nv);
        return;
    }
    
    if (leftcode === 0x0f) {
        if ((code & 0x00ff) == 0x001e)
            this.i += this.v[nv];
            
        if ((code & 0x00ff) == 0x0033) {
            var value = this.v[nv];
            var value1 = value % 10;
            var value2 = Math.floor((value % 100) / 10);
            var value3 = Math.floor((value % 1000) / 100);
            
            this.memory[this.i] = value3;
            this.memory[this.i + 1] = value2;
            this.memory[this.i + 2] = value1;
        }
    }
    else
        this.v[nv] = code & 0xff;
}

function createArray(size) {
    var array = new Array(size);
    
    for (var k = 0; k < size; k++)
        array[k] = 0;
        
    return array;
}

module.exports = {
    machine: function () { return new Machine(); }
}