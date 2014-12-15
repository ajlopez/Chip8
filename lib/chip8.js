
function Machine() {
    this.reset();
}

Machine.prototype.reset = function () {
    this.pc = 0;
    this.memory = new Array(4096);
    this.stack = new Array(16);
}

module.exports = {
    machine: function () { return new Machine(); }
}