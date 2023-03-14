class Benchmark {
  constructor(maximumCount, onRun, onAbort) {
    this.counter = 0;
    this.maximumCount = maximumCount;
    this.onRun = onRun;
    this.onAbort = onAbort;
    this.startTime = new Date(0);
    this.timestampArray = new Array();
  }

  run() {
    if(this.counter < this.maximumCount) {
        this.onRun();
        this.counter++;
    }
    else {
      this.onAbort();
      this.timestampArray.length = 0;
    }
  }

  setStartTime(startTime) {
    this.startTime = startTime;
  }

  addTimestamp(endTime) {
    this.timestampArray.push(Math.abs(endTime.getTime() - this.startTime.getTime()));
  }

  get maximum() {
    var maximum = 0;
    if(this.timestampArray.length > 0) {
      var i;
      for(i = 0; i < this.timestampArray.length; i++) {
        var currentMs = this.timestampArray[i];
        if(maximum < currentMs) {
          maximum = currentMs;
        }
      }
    }
    return maximum;
  }

  get minimum() {
    var minimum = 0;
    if(this.timestampArray.length > 0) {
      minimum = this.timestampArray[0];
      var i;
      for(i = 0; i < this.timestampArray.length; i++) {
        var currentMs = this.timestampArray[i];
        if(minimum > currentMs) {
          minimum = currentMs;
        }
      }
    }
    return minimum;
  }

  get average() {
    var average = 0;
    if(this.timestampArray.length > 0) {
      var sumMs = 0;
      var i;
      for(i = 0; i < this.timestampArray.length; i++) {
        var currentMs = this.timestampArray[i];
        sumMs += currentMs;
      }
      average = sumMs / this.timestampArray.length;
    }
    return average;
  }
}
