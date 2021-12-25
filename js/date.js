// For todays date;
Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"_"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"_"+ this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +"_"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +"_"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}