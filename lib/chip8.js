
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

Machine.prototype.execute = function (code) {
    if (code == 0x00ee) {
        var addr = this.stack[this.sp - 1];
        this.sp--;
        this.pc = addr;
        return;
    }
    
    var nv = (code & 0x0f00) >> 8;    
    var leftcode = (code & 0xf000) >> 12;
    
    if (leftcode === 0x08) {
        var nv0 = (code & 0x00f0) >> 4;

        var rightcode = code & 0x0f;

        if (rightcode == 1)
            this.v[nv] |= this.v[nv0];
        else if (rightcode == 2)
            this.v[nv] &= this.v[nv0];
        else if (rightcode == 3)
            this.v[nv] ^= this.v[nv0];
        else if (rightcode == 4) {
            var result = this.v[nv] + this.v[nv0];
            
            if ((result & 0x00ff) != result) {
                result = result & 0x00ff;
                this.vf = 1;
            }
            else
                this.vf = 0;
                
            this.v[nv] = result;
        }
        else if (rightcode == 5) {
            var result = this.v[nv] - this.v[nv0];
            result &= 0x00ff;
            
            if (this.v[nv] > this.v[nv0])
                this.vf = 1;
            else
                this.vf = 0;
                
            this.v[nv] = result;
        }
        else if (rightcode == 7) {
            var result = this.v[nv0] - this.v[nv];
            result &= 0x00ff;
            
            if (this.v[nv0] > this.v[nv])
                this.vf = 1;
            else
                this.vf = 0;
                
            this.v[nv] = result;
        }
        else if (rightcode == 6) {
            if (this.v[nv] & 0x01)
                this.vf = 1;
            else
                this.vf = 0;
                
            this.v[nv] >>= 1;
        }
        else if (rightcode == 0x0e) {
            if (this.v[nv] & 0x80)
                this.vf = 1;
            else
                this.vf = 0;
                
            this.v[nv] <<= 1;
        }
        else
            this.v[nv] = this.v[nv0];
    }
    else if (leftcode === 0x0a) {
        var addr = code & 0x0fff;
        this.i = addr;
    }
    else if (leftcode === 0x0b) {
        var addr = code & 0x0fff;
        this.pc = this.v[0] + addr;
    }
    else if (leftcode === 0x01) {
        var addr = code & 0x0fff;
        this.pc = addr;
    }
    else if (leftcode === 0x02) {
        var addr = code & 0x0fff;
        this.stack[this.sp++] = this.pc;
        this.pc = addr;
    }
    else if (leftcode === 0x03) {
        var value = code & 0x00ff;
        
        if (this.v[nv] == value)
            this.pc += 2;
    }
    else if (leftcode === 0x04) {
        var value = code & 0x00ff;
        
        if (this.v[nv] != value)
            this.pc += 2;
    }
    else if (leftcode === 0x05) {
        var nv0 = (code & 0x00f0) >> 4;
        
        if (this.v[nv] == this.v[nv0])
            this.pc += 2;
    }
    else if (leftcode === 0x0f) {
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