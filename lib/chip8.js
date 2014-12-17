
function Machine() {
    this.reset();
}

Machine.prototype.reset = function () {
    this.pc = 0;
    this.memory = new Array(4096);
    this.stack = new Array(16);
    this.v = createArray(16);
}

Machine.prototype.execute = function (code) {
    this.v[0] = code & 0xff;
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