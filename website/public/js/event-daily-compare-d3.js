window.qd.plotDailyComparison = function(divId, myDailyEvents, theirDailyEvents) {
  $(divId).html("");
  var margin = {
      top: 50,
      right: 0,
      bottom: 100,
      left: 28
    },
    width = $(divId).width() - 30,
    height = width / 2.5;

  var myTransformedEvents = _.map(myDailyEvents, function(e) {
    e.dataFor = "My Events";
    e.day = moment().days(e.day).format("ddd");
    return e;
  });
  var theirTransformedEvents = _.map(theirDailyEvents, function(e) {
    e.dataFor = "Their Events";
    e.day = moment().days(e.day).format("ddd");
    return e;
  });
  var data = _.union(myTransformedEvents, theirTransformedEvents);

  var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var x1 = d3.scale.ordinal();

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.ordinal()
    .range(["rgba(11,94,215,.8)", "rgba(245, 143, 8, 0.8)"]);

  var xAxis = d3.svg.axis()
    .scale(x0)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  var svg = d3.select(divId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var events = d3.set(data.map(function(line) {
    return line.dataFor;
  })).values();
  x0.domain(data.map(function(d) {
    return d.day;
  }));
  x1.domain(events).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) {
    return d.dailyEventCount;
  })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Push Count");

  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("width", x1.rangeBand())
    .attr("x", function(d) {
      return x0(d.day) + x1(d.dataFor);
    })
    .attr("y", function(d) {
      return y(+d.dailyEventCount);
    })
    .attr("height", function(d) {
      return height - y(+d.dailyEventCount);
    })
    .style("fill", function(d) {
      return color(d.dataFor);
    });

  var legend = svg.selectAll(".legend")
    .data(events.slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      return d;
    });
};